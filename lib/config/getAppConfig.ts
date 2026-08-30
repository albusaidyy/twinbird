import { defaultConfig } from '@/config/default-config';
import type { AppConfig, TourItem } from '@/types/app-config';
import { supabase } from '@/lib/supabase';

export async function getAppConfig(): Promise<AppConfig> {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('config')
      .eq('id', 'main')
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

    const desiredOrder = ['home', 'tours', 'about', 'contact'];
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
        if (!item.href || item.href.startsWith('/contact') || item.href.startsWith('/bookings')) {
          const s = item.slug || item.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
          return { ...item, href: `/tours/${s}` };
        }
        return item;
      });
    };

    function isTourMatch(a: TourItem, b: TourItem, aIdx?: number, bIdx?: number): boolean {
      if (a.id && b.id) return a.id === b.id;
      if (a.slug && b.slug) return a.slug === b.slug;
      if (a.title && b.title && a.title.trim().toLowerCase() === b.title.trim().toLowerCase()) return true;
      if (aIdx !== undefined && bIdx !== undefined) return aIdx === bIdx;
      return false;
    }

    const hasSavedHpItems = Array.isArray(savedConfig.homepage?.tours?.items) && (savedConfig.homepage!.tours!.items!.length > 0);
    const hasSavedTpItems = Array.isArray(savedConfig.toursPage?.tours?.items) && (savedConfig.toursPage!.tours!.items!.length > 0);

    const savedHpItems = sanitizeTours(savedConfig.homepage?.tours?.items) || [];
    const savedTpItems = sanitizeTours(savedConfig.toursPage?.tours?.items) || [];
    const fallbackItems = defaultConfig.toursPage?.tours?.items || defaultConfig.homepage?.tours?.items || [];

    const deduplicateTours = (items: TourItem[]): TourItem[] => {
      const seen = new Set<string>();
      const result: TourItem[] = [];
      for (const item of items) {
        const key = item.id || item.slug || (item.title ? item.title.trim().toLowerCase() : '');
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

    // The single canonical source of truth for the base tours list
    const rawBaseTours: TourItem[] = hasSavedHpItems
      ? savedHpItems
      : hasSavedTpItems
      ? savedTpItems
      : fallbackItems;

    const baseToursList = deduplicateTours(rawBaseTours);

    const findMatching = (list: TourItem[], target: TourItem, targetIdx: number): TourItem | undefined => {
      return list.find((t, i) => isTourMatch(t, target, i, targetIdx));
    };

    const buildEnrichedTour = (baseItem: TourItem, index: number, isListing: boolean): TourItem => {
      const tpItem = findMatching(savedTpItems, baseItem, index);
      const hpItem = findMatching(savedHpItems, baseItem, index);
      const fbItem = findMatching(fallbackItems, baseItem, index);

      // Deep page details priority: toursPage (tpItem) > homepage (hpItem) > fallback (fbItem) > baseItem
      const deep = tpItem || hpItem || fbItem || baseItem;
      const card = isListing
        ? (tpItem || hpItem || fbItem || baseItem)
        : (hpItem || tpItem || fbItem || baseItem);

      return {
        // Base defaults
        ...(fbItem || {}),
        ...baseItem,
        ...(hpItem || {}),
        ...(tpItem || {}),

        // Identity
        id: baseItem.id || deep.id || `safari-${index + 1}`,
        slug: baseItem.slug || deep.slug || '',
        title: hpItem?.title || baseItem.title || deep.title || '',
        href: hpItem?.href || baseItem.href || deep.href,

        // Card attributes (managed by main tour editor in Homepage / Featured Tours)
        badge: hpItem?.badge !== undefined ? hpItem.badge : (card.badge ?? deep.badge ?? ''),
        price: hpItem?.price !== undefined ? hpItem.price : (card.price ?? deep.price),
        priceLabel: hpItem?.priceLabel !== undefined ? hpItem.priceLabel : (card.priceLabel ?? deep.priceLabel),
        rating: hpItem?.rating !== undefined ? hpItem.rating : (card.rating ?? deep.rating ?? 5),
        imageUrl: hpItem?.imageUrl || card.imageUrl || deep.imageUrl || '/images/hero/hero.jpg',
        description: hpItem?.description !== undefined ? hpItem.description : (card.description ?? deep.description ?? ''),
        enabled: isListing
          ? (tpItem?.enabled !== undefined ? tpItem.enabled : (card.enabled ?? true))
          : (hpItem?.enabled !== undefined ? hpItem.enabled : (card.enabled ?? true)),
        deleted: baseItem.deleted !== undefined ? baseItem.deleted : (deep.deleted ?? false),
        deletedAt: baseItem.deletedAt || deep.deletedAt,

        // Card-level visibility toggles
        showTitle: card.showTitle !== undefined ? card.showTitle : true,
        showBadge: card.showBadge !== undefined ? card.showBadge : true,
        showRating: card.showRating !== undefined ? card.showRating : true,
        showPrice: card.showPrice !== undefined ? card.showPrice : true,

        // Single safari excursion deep page fields
        heroImageUrl: tpItem?.heroImageUrl ?? hpItem?.heroImageUrl ?? fbItem?.heroImageUrl,
        heroBackgroundColor: tpItem?.heroBackgroundColor ?? hpItem?.heroBackgroundColor ?? fbItem?.heroBackgroundColor,
        indicatorColor: tpItem?.indicatorColor ?? hpItem?.indicatorColor ?? fbItem?.indicatorColor,
        gallery: tpItem?.gallery && tpItem.gallery.length > 0 ? tpItem.gallery : (hpItem?.gallery && hpItem.gallery.length > 0 ? hpItem.gallery : fbItem?.gallery),
        overview: tpItem?.overview !== undefined ? tpItem.overview : (hpItem?.overview !== undefined ? hpItem.overview : fbItem?.overview),

        // Quick info strip bar (Hours/Duration, Location, Schedule, Group Suitability)
        duration: tpItem?.duration !== undefined ? tpItem.duration : (hpItem?.duration !== undefined ? hpItem.duration : (fbItem?.duration ?? baseItem.duration ?? '')),
        showDuration: tpItem?.showDuration !== undefined ? tpItem.showDuration : (hpItem?.showDuration !== undefined ? hpItem.showDuration : (fbItem?.showDuration !== undefined ? fbItem.showDuration : true)),

        location: tpItem?.location !== undefined ? tpItem.location : (hpItem?.location !== undefined ? hpItem.location : (fbItem?.location ?? baseItem.location ?? '')),
        showLocation: tpItem?.showLocation !== undefined ? tpItem.showLocation : (hpItem?.showLocation !== undefined ? hpItem.showLocation : (fbItem?.showLocation !== undefined ? fbItem.showLocation : true)),

        schedule: tpItem?.schedule !== undefined ? tpItem.schedule : (hpItem?.schedule !== undefined ? hpItem.schedule : (fbItem?.schedule ?? baseItem.schedule ?? '')),
        showSchedule: tpItem?.showSchedule !== undefined ? tpItem.showSchedule : (hpItem?.showSchedule !== undefined ? hpItem.showSchedule : (fbItem?.showSchedule !== undefined ? fbItem.showSchedule : true)),

        groupType: tpItem?.groupType !== undefined ? tpItem.groupType : (hpItem?.groupType !== undefined ? hpItem.groupType : (fbItem?.groupType ?? baseItem.groupType ?? '')),
        showGroupType: tpItem?.showGroupType !== undefined ? tpItem.showGroupType : (hpItem?.showGroupType !== undefined ? hpItem.showGroupType : (fbItem?.showGroupType !== undefined ? fbItem.showGroupType : true)),

        // Inclusions & Exclusions & Features
        included: tpItem?.included !== undefined ? tpItem.included : (hpItem?.included !== undefined ? hpItem.included : fbItem?.included),
        showIncluded: tpItem?.showIncluded !== undefined ? tpItem.showIncluded : (hpItem?.showIncluded !== undefined ? hpItem.showIncluded : (fbItem?.showIncluded !== undefined ? fbItem.showIncluded : true)),

        notIncluded: tpItem?.notIncluded !== undefined ? tpItem.notIncluded : (hpItem?.notIncluded !== undefined ? hpItem.notIncluded : fbItem?.notIncluded),
        showNotIncluded: tpItem?.showNotIncluded !== undefined ? tpItem.showNotIncluded : (hpItem?.showNotIncluded !== undefined ? hpItem.showNotIncluded : (fbItem?.showNotIncluded !== undefined ? fbItem.showNotIncluded : true)),

        whyChoose: tpItem?.whyChoose !== undefined ? tpItem.whyChoose : (hpItem?.whyChoose !== undefined ? hpItem.whyChoose : fbItem?.whyChoose),
        showWhyChoose: tpItem?.showWhyChoose !== undefined ? tpItem.showWhyChoose : (hpItem?.showWhyChoose !== undefined ? hpItem.showWhyChoose : (fbItem?.showWhyChoose !== undefined ? fbItem.showWhyChoose : true)),

        knowBeforeYouGo: tpItem?.knowBeforeYouGo !== undefined ? tpItem.knowBeforeYouGo : (hpItem?.knowBeforeYouGo !== undefined ? hpItem.knowBeforeYouGo : fbItem?.knowBeforeYouGo),
        showKnowBeforeYouGo: tpItem?.showKnowBeforeYouGo !== undefined ? tpItem.showKnowBeforeYouGo : (hpItem?.showKnowBeforeYouGo !== undefined ? hpItem.showKnowBeforeYouGo : (fbItem?.showKnowBeforeYouGo !== undefined ? fbItem.showKnowBeforeYouGo : true)),

        metaTitle: tpItem?.metaTitle ?? hpItem?.metaTitle ?? fbItem?.metaTitle,
        metaDescription: tpItem?.metaDescription ?? hpItem?.metaDescription ?? fbItem?.metaDescription,
      };
    };

    const listingTours = baseToursList.map((t, idx) => buildEnrichedTour(t, idx, true));
    const homepageTours = baseToursList.map((t, idx) => buildEnrichedTour(t, idx, false));

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
        tours: {
          ...defaultConfig.homepage.tours,
          ...(savedConfig.homepage?.tours || {}),
          items: homepageTours,
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
            savedConfig.toursPage.hero.backgroundColor !== '#0b251a'
              ? savedConfig.toursPage.hero.backgroundColor
              : (savedConfig.branding?.primaryColor || defaultConfig.branding.primaryColor || '#193da9'),
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
            savedConfig.toursPage?.bookingForm?.fields.length > 0
              ? savedConfig.toursPage.bookingForm.fields
              : defaultConfig.toursPage!.bookingForm!.fields,
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
    };

    return mergedConfig;
  } catch {
    return defaultConfig;
  }
}

