import { defaultConfig, defaultExcursionItems } from "@/config/default-config";
import type { AppConfig, TourItem, ExcursionItem } from "@/types/app-config";
import { supabase } from "@/lib/supabase";
import { isExcursionMatch } from "@/lib/excursion-utils";

export async function getAppConfig(): Promise<AppConfig> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("config")
      .eq("id", "main")
      .single();

    if (error || !data?.config) return defaultConfig;

    const savedConfig = data.config as Partial<AppConfig>;
    if (!savedConfig.branding) return defaultConfig;

    // Merge navigation: ensure default navigation items (e.g. 'tours') exist and order: Home, Safari Tours, About, Contact
    const savedNav = savedConfig.navigation || [];
    const savedNavKeys = new Set(savedNav.map((n) => n.key));
    const rawNav = [
      ...savedNav,
      ...defaultConfig.navigation.filter((n) => !savedNavKeys.has(n.key)),
    ];

    const desiredOrder = [
      "home",
      "tours",
      "excursions",
      "transfers",
      "about",
      "contact",
    ];
    rawNav.sort((a, b) => {
      const aIdx = desiredOrder.indexOf(a.key);
      const bIdx = desiredOrder.indexOf(b.key);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });

    const sanitizeTours = (items?: TourItem[]) => {
      if (!items) return items;
      return items.map((item) => {
        if (
          !item.href ||
          item.href.startsWith("/contact") ||
          item.href.startsWith("/bookings")
        ) {
          const s =
            item.slug ||
            item.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_-]+/g, "-");
          return { ...item, href: `/tours/${s}` };
        }
        return item;
      });
    };

    function isTourMatch(
      a: TourItem,
      b: TourItem,
      aIdx?: number,
      bIdx?: number,
    ): boolean {
      if (a.id && b.id) return a.id === b.id;
      if (a.slug && b.slug) return a.slug === b.slug;
      if (
        a.title &&
        b.title &&
        a.title.trim().toLowerCase() === b.title.trim().toLowerCase()
      )
        return true;
      if (aIdx !== undefined && bIdx !== undefined) return aIdx === bIdx;
      return false;
    }

    const savedHpItems =
      sanitizeTours(savedConfig.homepage?.tours?.items) || [];
    const savedTpItems =
      sanitizeTours(savedConfig.toursPage?.tours?.items) || [];
    const fallbackItems =
      defaultConfig.toursPage?.tours?.items ||
      defaultConfig.homepage?.tours?.items ||
      [];

    const deduplicateTours = (items: TourItem[]): TourItem[] => {
      const seen = new Set<string>();
      const result: TourItem[] = [];
      for (const item of items) {
        const key =
          item.id ||
          item.slug ||
          (item.title ? item.title.trim().toLowerCase() : "");
        if (key) {
          if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
          }
        } else {
          result.push(item);
        }
      }
      return result;
    };

    // Master catalog base list for Safari Tours listing page
    const listingBaseTours = deduplicateTours(
      savedTpItems.length > 0 ? savedTpItems : fallbackItems,
    );

    // Independent ordering for Homepage Featured Tours
    const rawHomeTours: TourItem[] = [];
    if (savedHpItems.length > 0) {
      savedHpItems.forEach((hpTour, idx) => {
        const master = listingBaseTours.find((m, mIdx) => isTourMatch(m, hpTour, mIdx, idx));
        rawHomeTours.push(
          master
            ? { ...master, enabled: hpTour.enabled !== undefined ? hpTour.enabled : master.enabled }
            : hpTour,
        );
      });
      listingBaseTours.forEach((mTour, mIdx) => {
        if (!rawHomeTours.some((h, hIdx) => isTourMatch(h, mTour, hIdx, mIdx))) {
          rawHomeTours.push(mTour);
        }
      });
    } else {
      rawHomeTours.push(...listingBaseTours);
    }
    const homeBaseTours = deduplicateTours(rawHomeTours);

    const findMatching = (
      list: TourItem[],
      target: TourItem,
      targetIdx: number,
    ): TourItem | undefined => {
      return list.find((t, i) => isTourMatch(t, target, i, targetIdx));
    };

    const buildEnrichedTour = (
      baseItem: TourItem,
      index: number,
      isListing: boolean,
    ): TourItem => {
      const tpItem = findMatching(savedTpItems, baseItem, index);
      const hpItem = findMatching(savedHpItems, baseItem, index);
      const fbItem = findMatching(fallbackItems, baseItem, index);

      // Deep page details & card priority: toursPage (Master Catalog) > homepage > fallback > baseItem
      const deep = tpItem || hpItem || fbItem || baseItem;
      const card = isListing
        ? tpItem || hpItem || fbItem || baseItem
        : hpItem || tpItem || fbItem || baseItem;

      return {
        // Base defaults
        ...(fbItem || {}),
        ...baseItem,
        ...(hpItem || {}),
        ...(tpItem || {}),

        // Identity
        id: baseItem.id || deep.id || `safari-${index + 1}`,
        slug: baseItem.slug || deep.slug || "",
        title: tpItem?.title || hpItem?.title || baseItem.title || deep.title || "",
        href: tpItem?.href || hpItem?.href || baseItem.href || deep.href,

        // Card attributes (managed in Safari Tours Master Catalog)
        badge:
          tpItem?.badge !== undefined
            ? tpItem.badge
            : hpItem?.badge !== undefined
              ? hpItem.badge
              : (card.badge ?? deep.badge ?? ""),
        price:
          tpItem?.price !== undefined
            ? tpItem.price
            : hpItem?.price !== undefined
              ? hpItem.price
              : (card.price ?? deep.price),
        priceLabel:
          tpItem?.priceLabel !== undefined
            ? tpItem.priceLabel
            : hpItem?.priceLabel !== undefined
              ? hpItem.priceLabel
              : (card.priceLabel ?? deep.priceLabel),
        rating:
          tpItem?.rating !== undefined
            ? tpItem.rating
            : hpItem?.rating !== undefined
              ? hpItem.rating
              : (card.rating ?? deep.rating ?? 5),
        imageUrl:
          tpItem?.imageUrl ||
          hpItem?.imageUrl ||
          card.imageUrl ||
          deep.imageUrl ||
          "/images/hero/hero.jpg",
        description:
          tpItem?.description !== undefined
            ? tpItem.description
            : hpItem?.description !== undefined
              ? hpItem.description
              : (card.description ?? deep.description ?? ""),
        enabled: isListing
          ? tpItem?.enabled !== undefined
            ? tpItem.enabled
            : (card.enabled ?? true)
          : hpItem?.enabled !== undefined
            ? hpItem.enabled
            : (tpItem?.enabled ?? true),
        deleted:
          baseItem.deleted !== undefined
            ? baseItem.deleted
            : (deep.deleted ?? false),
        deletedAt: baseItem.deletedAt || deep.deletedAt,

        // Card-level visibility toggles
        showTitle: card.showTitle !== undefined ? card.showTitle : true,
        showBadge: card.showBadge !== undefined ? card.showBadge : true,
        showRating: card.showRating !== undefined ? card.showRating : true,
        showPrice: card.showPrice !== undefined ? card.showPrice : true,

        // Single safari excursion deep page fields
        heroImageUrl:
          tpItem?.heroImageUrl ?? hpItem?.heroImageUrl ?? fbItem?.heroImageUrl,
        heroBackgroundColor:
          tpItem?.heroBackgroundColor ??
          hpItem?.heroBackgroundColor ??
          fbItem?.heroBackgroundColor,
        indicatorColor:
          tpItem?.indicatorColor ??
          hpItem?.indicatorColor ??
          fbItem?.indicatorColor,
        gallery:
          tpItem?.gallery && tpItem.gallery.length > 0
            ? tpItem.gallery
            : hpItem?.gallery && hpItem.gallery.length > 0
              ? hpItem.gallery
              : fbItem?.gallery,
        overview:
          tpItem?.overview !== undefined
            ? tpItem.overview
            : hpItem?.overview !== undefined
              ? hpItem.overview
              : fbItem?.overview,

        // Quick info strip bar (Hours/Duration, Location, Schedule, Group Suitability)
        duration:
          tpItem?.duration !== undefined
            ? tpItem.duration
            : hpItem?.duration !== undefined
              ? hpItem.duration
              : (fbItem?.duration ?? baseItem.duration ?? ""),
        showDuration:
          tpItem?.showDuration !== undefined
            ? tpItem.showDuration
            : hpItem?.showDuration !== undefined
              ? hpItem.showDuration
              : fbItem?.showDuration !== undefined
                ? fbItem.showDuration
                : true,

        location:
          tpItem?.location !== undefined
            ? tpItem.location
            : hpItem?.location !== undefined
              ? hpItem.location
              : (fbItem?.location ?? baseItem.location ?? ""),
        showLocation:
          tpItem?.showLocation !== undefined
            ? tpItem.showLocation
            : hpItem?.showLocation !== undefined
              ? hpItem.showLocation
              : fbItem?.showLocation !== undefined
                ? fbItem.showLocation
                : true,

        schedule:
          tpItem?.schedule !== undefined
            ? tpItem.schedule
            : hpItem?.schedule !== undefined
              ? hpItem.schedule
              : (fbItem?.schedule ?? baseItem.schedule ?? ""),
        showSchedule:
          tpItem?.showSchedule !== undefined
            ? tpItem.showSchedule
            : hpItem?.showSchedule !== undefined
              ? hpItem.showSchedule
              : fbItem?.showSchedule !== undefined
                ? fbItem.showSchedule
                : true,

        groupType:
          tpItem?.groupType !== undefined
            ? tpItem.groupType
            : hpItem?.groupType !== undefined
              ? hpItem.groupType
              : (fbItem?.groupType ?? baseItem.groupType ?? ""),
        showGroupType:
          tpItem?.showGroupType !== undefined
            ? tpItem.showGroupType
            : hpItem?.showGroupType !== undefined
              ? hpItem.showGroupType
              : fbItem?.showGroupType !== undefined
                ? fbItem.showGroupType
                : true,

        // Inclusions & Exclusions & Features
        included:
          tpItem?.included !== undefined
            ? tpItem.included
            : hpItem?.included !== undefined
              ? hpItem.included
              : fbItem?.included,
        showIncluded:
          tpItem?.showIncluded !== undefined
            ? tpItem.showIncluded
            : hpItem?.showIncluded !== undefined
              ? hpItem.showIncluded
              : fbItem?.showIncluded !== undefined
                ? fbItem.showIncluded
                : true,

        notIncluded:
          tpItem?.notIncluded !== undefined
            ? tpItem.notIncluded
            : hpItem?.notIncluded !== undefined
              ? hpItem.notIncluded
              : fbItem?.notIncluded,
        showNotIncluded:
          tpItem?.showNotIncluded !== undefined
            ? tpItem.showNotIncluded
            : hpItem?.showNotIncluded !== undefined
              ? hpItem.showNotIncluded
              : fbItem?.showNotIncluded !== undefined
                ? fbItem.showNotIncluded
                : true,

        whyChoose:
          tpItem?.whyChoose !== undefined
            ? tpItem.whyChoose
            : hpItem?.whyChoose !== undefined
              ? hpItem.whyChoose
              : fbItem?.whyChoose,
        showWhyChoose:
          tpItem?.showWhyChoose !== undefined
            ? tpItem.showWhyChoose
            : hpItem?.showWhyChoose !== undefined
              ? hpItem.showWhyChoose
              : fbItem?.showWhyChoose !== undefined
                ? fbItem.showWhyChoose
                : true,

        knowBeforeYouGo:
          tpItem?.knowBeforeYouGo !== undefined
            ? tpItem.knowBeforeYouGo
            : hpItem?.knowBeforeYouGo !== undefined
              ? hpItem.knowBeforeYouGo
              : fbItem?.knowBeforeYouGo,
        showKnowBeforeYouGo:
          tpItem?.showKnowBeforeYouGo !== undefined
            ? tpItem.showKnowBeforeYouGo
            : hpItem?.showKnowBeforeYouGo !== undefined
              ? hpItem.showKnowBeforeYouGo
              : fbItem?.showKnowBeforeYouGo !== undefined
                ? fbItem.showKnowBeforeYouGo
                : true,

        metaTitle: tpItem?.metaTitle ?? hpItem?.metaTitle ?? fbItem?.metaTitle,
        metaDescription:
          tpItem?.metaDescription ??
          hpItem?.metaDescription ??
          fbItem?.metaDescription,
      };
    };

    const listingTours = listingBaseTours.map((t, idx) =>
      buildEnrichedTour(t, idx, true),
    );
    const homepageTours = homeBaseTours.map((t, idx) =>
      buildEnrichedTour(t, idx, false),
    );

    const savedHpExcursions = savedConfig.homepage?.excursions?.items || [];
    const savedEpExcursions = savedConfig.excursionsPage?.tours?.items || [];
    const fallbackExcursionItems =
      defaultConfig.excursionsPage?.tours?.items ||
      defaultConfig.homepage?.excursions?.items ||
      defaultExcursionItems;

    const deduplicateExcursions = (items: ExcursionItem[]): ExcursionItem[] => {
      const seen = new Set<string>();
      const result: ExcursionItem[] = [];
      for (const item of items) {
        const key =
          item.id ||
          item.slug ||
          (item.title ? item.title.trim().toLowerCase() : "");
        if (key) {
          if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
          }
        } else {
          result.push(item);
        }
      }
      return result;
    };

    // Master catalog base list for Excursions listing page
    const listingBaseExcursions = deduplicateExcursions(
      savedEpExcursions.length > 0 ? savedEpExcursions : fallbackExcursionItems,
    );

    // Independent ordering for Homepage Featured Excursions
    const rawHomeExcursions: ExcursionItem[] = [];
    if (savedHpExcursions.length > 0) {
      savedHpExcursions.forEach((hpExc, idx) => {
        const master = listingBaseExcursions.find((m, mIdx) => isExcursionMatch(m, hpExc, mIdx, idx));
        rawHomeExcursions.push(
          master
            ? { ...master, enabled: hpExc.enabled !== undefined ? hpExc.enabled : master.enabled }
            : hpExc,
        );
      });
      listingBaseExcursions.forEach((mExc, mIdx) => {
        if (!rawHomeExcursions.some((h, hIdx) => isExcursionMatch(h, mExc, hIdx, mIdx))) {
          rawHomeExcursions.push(mExc);
        }
      });
    } else {
      rawHomeExcursions.push(...listingBaseExcursions);
    }
    const homeBaseExcursions = deduplicateExcursions(rawHomeExcursions);

    const findMatchingExcursion = (
      list: ExcursionItem[],
      target: ExcursionItem,
      targetIdx: number,
    ): ExcursionItem | undefined => {
      return list.find((e, i) => isExcursionMatch(e, target, i, targetIdx));
    };

    const buildEnrichedExcursion = (
      baseItem: ExcursionItem,
      index: number,
      isListing: boolean,
    ): ExcursionItem => {
      const epItem = findMatchingExcursion(savedEpExcursions, baseItem, index);
      const hpItem = findMatchingExcursion(savedHpExcursions, baseItem, index);
      const fbItem = findMatchingExcursion(fallbackExcursionItems, baseItem, index);

      const deep = epItem || hpItem || fbItem || baseItem;
      const card = isListing
        ? epItem || hpItem || fbItem || baseItem
        : hpItem || epItem || fbItem || baseItem;

      return {
        ...(fbItem || {}),
        ...baseItem,
        ...(hpItem || {}),
        ...(epItem || {}),

        id: baseItem.id || deep.id || `excursion-${index + 1}`,
        slug: baseItem.slug || deep.slug || "",
        title: epItem?.title || hpItem?.title || baseItem.title || deep.title || "",
        href: epItem?.href || hpItem?.href || baseItem.href || deep.href,

        badge:
          epItem?.badge !== undefined
            ? epItem.badge
            : hpItem?.badge !== undefined
              ? hpItem.badge
              : (card.badge ?? deep.badge ?? ""),
        price:
          epItem?.price !== undefined
            ? epItem.price
            : hpItem?.price !== undefined
              ? hpItem.price
              : (card.price ?? deep.price),
        priceLabel:
          epItem?.priceLabel !== undefined
            ? epItem.priceLabel
            : hpItem?.priceLabel !== undefined
              ? hpItem.priceLabel
              : (card.priceLabel ?? deep.priceLabel),
        rating:
          epItem?.rating !== undefined
            ? epItem.rating
            : hpItem?.rating !== undefined
              ? hpItem.rating
              : (card.rating ?? deep.rating ?? 5),
        imageUrl:
          epItem?.imageUrl ||
          hpItem?.imageUrl ||
          card.imageUrl ||
          deep.imageUrl ||
          "/images/hero/hero.jpg",
        description:
          epItem?.description !== undefined
            ? epItem.description
            : hpItem?.description !== undefined
              ? hpItem.description
              : (card.description ?? deep.description ?? ""),
        enabled: isListing
          ? epItem?.enabled !== undefined
            ? epItem.enabled
            : (card.enabled ?? true)
          : hpItem?.enabled !== undefined
            ? hpItem.enabled
            : (epItem?.enabled ?? true),
        deleted: baseItem.deleted !== undefined ? baseItem.deleted : (deep.deleted ?? false),
        deletedAt: baseItem.deletedAt || deep.deletedAt,

        showTitle: card.showTitle !== undefined ? card.showTitle : true,
        showBadge: card.showBadge !== undefined ? card.showBadge : true,
        showRating: card.showRating !== undefined ? card.showRating : true,
        showPrice: card.showPrice !== undefined ? card.showPrice : true,

        heroImageUrl: epItem?.heroImageUrl ?? hpItem?.heroImageUrl ?? fbItem?.heroImageUrl,
        heroBackgroundColor: epItem?.heroBackgroundColor ?? hpItem?.heroBackgroundColor ?? fbItem?.heroBackgroundColor,
        indicatorColor: epItem?.indicatorColor ?? hpItem?.indicatorColor ?? fbItem?.indicatorColor,
        gallery: epItem?.gallery && epItem.gallery.length > 0
          ? epItem.gallery
          : hpItem?.gallery && hpItem.gallery.length > 0
            ? hpItem.gallery
            : fbItem?.gallery,
        overview: epItem?.overview !== undefined
          ? epItem.overview
          : hpItem?.overview !== undefined
            ? hpItem.overview
            : fbItem?.overview,

        duration: epItem?.duration !== undefined
          ? epItem.duration
          : hpItem?.duration !== undefined
            ? hpItem.duration
            : (fbItem?.duration ?? baseItem.duration ?? ""),
        showDuration: epItem?.showDuration !== undefined
          ? epItem.showDuration
          : hpItem?.showDuration !== undefined
            ? hpItem.showDuration
            : fbItem?.showDuration !== undefined
              ? fbItem.showDuration
              : true,

        location: epItem?.location !== undefined
          ? epItem.location
          : hpItem?.location !== undefined
            ? hpItem.location
            : (fbItem?.location ?? baseItem.location ?? ""),
        showLocation: epItem?.showLocation !== undefined
          ? epItem.showLocation
          : hpItem?.showLocation !== undefined
            ? hpItem.showLocation
            : fbItem?.showLocation !== undefined
              ? fbItem.showLocation
              : true,

        schedule: epItem?.schedule !== undefined
          ? epItem.schedule
          : hpItem?.schedule !== undefined
            ? hpItem.schedule
            : (fbItem?.schedule ?? baseItem.schedule ?? ""),
        showSchedule: epItem?.showSchedule !== undefined
          ? epItem.showSchedule
          : hpItem?.showSchedule !== undefined
            ? hpItem.showSchedule
            : fbItem?.showSchedule !== undefined
              ? fbItem.showSchedule
              : true,

        groupType: epItem?.groupType !== undefined
          ? epItem.groupType
          : hpItem?.groupType !== undefined
            ? hpItem.groupType
            : (fbItem?.groupType ?? baseItem.groupType ?? ""),
        showGroupType: epItem?.showGroupType !== undefined
          ? epItem.showGroupType
          : hpItem?.showGroupType !== undefined
            ? hpItem.showGroupType
            : fbItem?.showGroupType !== undefined
              ? fbItem.showGroupType
              : true,

        included: epItem?.included !== undefined ? epItem.included : hpItem?.included !== undefined ? hpItem.included : fbItem?.included,
        showIncluded: epItem?.showIncluded !== undefined ? epItem.showIncluded : hpItem?.showIncluded !== undefined ? hpItem.showIncluded : fbItem?.showIncluded !== undefined ? fbItem.showIncluded : true,

        notIncluded: epItem?.notIncluded !== undefined ? epItem.notIncluded : hpItem?.notIncluded !== undefined ? hpItem.notIncluded : fbItem?.notIncluded,
        showNotIncluded: epItem?.showNotIncluded !== undefined ? epItem.showNotIncluded : hpItem?.showNotIncluded !== undefined ? hpItem.showNotIncluded : fbItem?.showNotIncluded !== undefined ? fbItem.showNotIncluded : true,

        whyChoose: epItem?.whyChoose !== undefined ? epItem.whyChoose : hpItem?.whyChoose !== undefined ? hpItem.whyChoose : fbItem?.whyChoose,
        showWhyChoose: epItem?.showWhyChoose !== undefined ? epItem.showWhyChoose : hpItem?.showWhyChoose !== undefined ? hpItem.showWhyChoose : fbItem?.showWhyChoose !== undefined ? fbItem.showWhyChoose : true,

        knowBeforeYouGo: epItem?.knowBeforeYouGo !== undefined ? epItem.knowBeforeYouGo : hpItem?.knowBeforeYouGo !== undefined ? hpItem.knowBeforeYouGo : fbItem?.knowBeforeYouGo,
        showKnowBeforeYouGo: epItem?.showKnowBeforeYouGo !== undefined ? epItem.showKnowBeforeYouGo : hpItem?.showKnowBeforeYouGo !== undefined ? hpItem.showKnowBeforeYouGo : fbItem?.showKnowBeforeYouGo !== undefined ? fbItem.showKnowBeforeYouGo : true,

        metaTitle: epItem?.metaTitle ?? hpItem?.metaTitle ?? fbItem?.metaTitle,
        metaDescription: epItem?.metaDescription ?? hpItem?.metaDescription ?? fbItem?.metaDescription,
      };
    };

    const listingExcursions = listingBaseExcursions.map((e, idx) =>
      buildEnrichedExcursion(e, idx, true),
    );
    const homepageExcursions = homeBaseExcursions.map((e, idx) =>
      buildEnrichedExcursion(e, idx, false),
    );

    // Merge with defaults so new page sections like toursPage are present
    const mergedConfig: AppConfig = {
      ...defaultConfig,
      ...savedConfig,
      branding: {
        ...defaultConfig.branding,
        ...(savedConfig.branding || {}),
      },
      navigation: rawNav,
      homepage: {
        ...defaultConfig.homepage,
        ...(savedConfig.homepage || {}),
        hero: {
          ...defaultConfig.homepage.hero,
          ...(savedConfig.homepage?.hero || {}),
          secondaryCtaHref:
            savedConfig.homepage?.hero?.secondaryCtaHref === "/contact"
              ? "/excursions"
              : savedConfig.homepage?.hero?.secondaryCtaHref || defaultConfig.homepage.hero.secondaryCtaHref,
          secondaryCtaLabel:
            savedConfig.homepage?.hero?.secondaryCtaLabel === "Plan Custom Safari"
              ? "Explore Excursions"
              : savedConfig.homepage?.hero?.secondaryCtaLabel || defaultConfig.homepage.hero.secondaryCtaLabel,
        },
        sectionOrder: (() => {
          const defaultOrder = [
            "stats",
            "experiences",
            "tours",
            "excursions",
            "whyus",
            "reviews",
            "gallery",
            "cta",
          ];
          const savedOrder = savedConfig.homepage?.sectionOrder;
          if (!savedOrder || !Array.isArray(savedOrder) || savedOrder.length === 0) {
            return defaultOrder;
          }
          const missing = defaultOrder.filter((k) => !savedOrder.includes(k));
          const combined = [...savedOrder];
          for (const m of missing) {
            if (m === "experiences") {
              const statsIdx = combined.indexOf("stats");
              if (statsIdx !== -1) {
                combined.splice(statsIdx + 1, 0, "experiences");
              } else {
                combined.unshift("experiences");
              }
            } else if (m === "excursions") {
              const toursIdx = combined.indexOf("tours");
              if (toursIdx !== -1) {
                combined.splice(toursIdx + 1, 0, "excursions");
              } else {
                combined.push("excursions");
              }
            } else {
              combined.push(m);
            }
          }
          return combined;
        })(),
        experiences: {
          ...defaultConfig.homepage.experiences!,
          ...(savedConfig.homepage?.experiences || {}),
          items:
            savedConfig.homepage?.experiences?.items &&
            savedConfig.homepage.experiences.items.length > 0
              ? savedConfig.homepage.experiences.items
              : defaultConfig.homepage.experiences!.items,
        },
        tours: {
          ...defaultConfig.homepage.tours,
          ...(savedConfig.homepage?.tours || {}),
          items: homepageTours,
        },
        excursions: {
          ...defaultConfig.homepage.excursions!,
          ...(savedConfig.homepage?.excursions || {}),
          items: homepageExcursions,
        },
      },
      toursPage: {
        ...defaultConfig.toursPage!,
        ...(savedConfig.toursPage || {}),
        hero: {
          ...defaultConfig.toursPage!.hero,
          ...(savedConfig.toursPage?.hero || {}),
          backgroundColor:
            savedConfig.toursPage?.hero?.backgroundColor &&
            savedConfig.toursPage.hero.backgroundColor !== "#0b251a"
              ? savedConfig.toursPage.hero.backgroundColor
              : savedConfig.branding?.primaryColor ||
                defaultConfig.branding.primaryColor ||
                "#193da9",
        },
        tours: {
          ...defaultConfig.toursPage!.tours,
          ...(savedConfig.toursPage?.tours || {}),
          items: listingTours,
        },
        bookingForm: {
          ...defaultConfig.toursPage!.bookingForm!,
          ...(savedConfig.toursPage?.bookingForm || {}),
          fields:
            savedConfig.toursPage?.bookingForm?.fields &&
            savedConfig.toursPage.bookingForm.fields.length > 0
              ? savedConfig.toursPage.bookingForm.fields
              : defaultConfig.toursPage!.bookingForm!.fields,
        },
      },
      excursionsPage: {
        ...defaultConfig.excursionsPage!,
        ...(savedConfig.excursionsPage || {}),
        hero: {
          ...defaultConfig.excursionsPage!.hero,
          ...(savedConfig.excursionsPage?.hero || {}),
        },
        tours: {
          ...defaultConfig.excursionsPage!.tours,
          ...(savedConfig.excursionsPage?.tours || {}),
          items: listingExcursions,
        },
        bookingForm: {
          ...defaultConfig.excursionsPage!.bookingForm!,
          ...(savedConfig.excursionsPage?.bookingForm || {}),
          fields:
            savedConfig.excursionsPage?.bookingForm?.fields &&
            savedConfig.excursionsPage.bookingForm.fields.length > 0
              ? savedConfig.excursionsPage.bookingForm.fields
              : defaultConfig.excursionsPage!.bookingForm!.fields,
        },
      },
      contactPage: {
        ...defaultConfig.contactPage,
        ...(savedConfig.contactPage || {}),
        contact: {
          ...defaultConfig.contactPage.contact,
          ...(savedConfig.contactPage?.contact || {}),
        },
        form: {
          ...defaultConfig.contactPage.form,
          ...(savedConfig.contactPage?.form || {}),
          fields:
            savedConfig.contactPage?.form?.fields &&
            savedConfig.contactPage?.form?.fields.length > 0
              ? savedConfig.contactPage.form.fields
              : defaultConfig.contactPage.form.fields,
        },
        faq: {
          ...defaultConfig.contactPage.faq,
          ...(savedConfig.contactPage?.faq || {}),
        },
      },
      aboutPage: {
        ...defaultConfig.aboutPage!,
        ...(savedConfig.aboutPage || {}),
        hero: {
          ...defaultConfig.aboutPage!.hero,
          ...(savedConfig.aboutPage?.hero || {}),
        },
        story: {
          ...defaultConfig.aboutPage!.story,
          ...(savedConfig.aboutPage?.story || {}),
        },
        values: {
          ...defaultConfig.aboutPage!.values,
          ...(savedConfig.aboutPage?.values || {}),
        },
        team: {
          ...defaultConfig.aboutPage!.team,
          ...(savedConfig.aboutPage?.team || {}),
        },
        impact: {
          ...defaultConfig.aboutPage!.impact,
          ...(savedConfig.aboutPage?.impact || {}),
        },
        cta: {
          ...defaultConfig.aboutPage!.cta,
          ...(savedConfig.aboutPage?.cta || {}),
        },
      },
      transfersPage: {
        ...defaultConfig.transfersPage!,
        ...(savedConfig.transfersPage || {}),
        hero: {
          ...defaultConfig.transfersPage!.hero,
          ...(savedConfig.transfersPage?.hero || {}),
        },
        features:
          savedConfig.transfersPage?.features &&
          savedConfig.transfersPage.features.length > 0
            ? savedConfig.transfersPage.features
            : defaultConfig.transfersPage!.features,
        routesSection: {
          ...defaultConfig.transfersPage!.routesSection,
          ...(savedConfig.transfersPage?.routesSection || {}),
          routes:
            savedConfig.transfersPage?.routesSection?.routes &&
            savedConfig.transfersPage.routesSection.routes.length > 0
              ? savedConfig.transfersPage.routesSection.routes
              : defaultConfig.transfersPage!.routesSection.routes,
        },
        vehiclesSection: {
          ...defaultConfig.transfersPage!.vehiclesSection!,
          ...(savedConfig.transfersPage?.vehiclesSection || {}),
          vehicles:
            savedConfig.transfersPage?.vehiclesSection?.vehicles &&
            savedConfig.transfersPage.vehiclesSection.vehicles.length > 0
              ? savedConfig.transfersPage.vehiclesSection.vehicles
              : defaultConfig.transfersPage!.vehiclesSection!.vehicles,
        },
        bookingForm: {
          ...defaultConfig.transfersPage!.bookingForm,
          ...(savedConfig.transfersPage?.bookingForm || {}),
          fields:
            savedConfig.transfersPage?.bookingForm?.fields &&
            savedConfig.transfersPage.bookingForm.fields.length > 0
              ? savedConfig.transfersPage.bookingForm.fields
              : defaultConfig.transfersPage!.bookingForm.fields,
        },
        faq: {
          ...defaultConfig.transfersPage!.faq!,
          ...(savedConfig.transfersPage?.faq || {}),
          items:
            savedConfig.transfersPage?.faq?.items &&
            savedConfig.transfersPage.faq.items.length > 0
              ? savedConfig.transfersPage.faq.items
              : defaultConfig.transfersPage!.faq!.items,
        },
      },
    };

    return mergedConfig;
  } catch {
    return defaultConfig;
  }
}
