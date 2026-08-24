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

    // Merge navigation: ensure default navigation items (e.g. 'tours') exist and order: Home, Fishing Charters, Contact
    const savedNav = savedConfig.navigation || [];
    const savedNavKeys = new Set(savedNav.map((n) => n.key));
    const rawNav = [
      ...savedNav,
      ...defaultConfig.navigation.filter((n) => !savedNavKeys.has(n.key)),
    ];

    const desiredOrder = ['home', 'tours', 'contact'];
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

    const hasSavedHpItems = Array.isArray(savedConfig.homepage?.tours?.items) && (savedConfig.homepage!.tours!.items!.length > 0);
    const hasSavedTpItems = Array.isArray(savedConfig.toursPage?.tours?.items) && (savedConfig.toursPage!.tours!.items!.length > 0);

    const savedHpItems = sanitizeTours(savedConfig.homepage?.tours?.items);
    const savedTpItems = sanitizeTours(savedConfig.toursPage?.tours?.items);
    const fallbackItems = defaultConfig.homepage?.tours?.items || defaultConfig.toursPage?.tours?.items || [];

    // The primary source of truth for the tours list is homepage.tours.items (Featured Tours).
    // If no DB items exist yet, fall back to the defaults.
    const rawBaseTours: TourItem[] = hasSavedHpItems
      ? (savedHpItems || [])
      : hasSavedTpItems
      ? (savedTpItems || [])
      : fallbackItems;

    // Strip permanently-deleted items from the canonical list.
    // Soft-deleted items are kept (they show as inactive in admin, hidden to public via filter).
    const baseToursList: TourItem[] = rawBaseTours.filter((t) => !t.deleted);

    // Map of single-charter deep page details from toursPage (and fallback defaults)
    const pageDetailsMap = new Map<string, TourItem>();
    const allDetailSources = [...fallbackItems, ...(savedTpItems || []), ...(savedHpItems || [])];
    for (const item of allDetailSources) {
      const key = item.id || item.slug || item.title;
      if (key) {
        pageDetailsMap.set(key, { ...(pageDetailsMap.get(key) || {}), ...item });
      }
    }

    // Both homepage tours and listing tours stem from the base tours list,
    // with listing tours fed the full single-charter page details.
    const enrichTour = (item: TourItem): TourItem => {
      const key = item.id || item.slug || item.title;
      const deepDetails = key ? pageDetailsMap.get(key) : null;
      return {
        ...item,
        ...(deepDetails || {}),
        // Retain card-level values from the base tour item
        title: item.title,
        badge: item.badge ?? deepDetails?.badge ?? '',
        price: item.price !== undefined ? item.price : deepDetails?.price,
        priceLabel: item.priceLabel !== undefined ? item.priceLabel : deepDetails?.priceLabel,
        rating: item.rating !== undefined ? item.rating : (deepDetails?.rating ?? 5),
        duration: item.duration ?? deepDetails?.duration ?? '',
        imageUrl: item.imageUrl || deepDetails?.imageUrl || '/images/hero/hero.jpg',
        description: item.description ?? deepDetails?.description ?? '',
        enabled: item.enabled !== undefined ? item.enabled : true,
        deleted: item.deleted !== undefined ? item.deleted : deepDetails?.deleted !== undefined ? deepDetails.deleted : false,
        deletedAt: item.deletedAt || deepDetails?.deletedAt,
        showTitle: item.showTitle !== undefined ? item.showTitle : true,
        showBadge: item.showBadge !== undefined ? item.showBadge : true,
        showDuration: item.showDuration !== undefined ? item.showDuration : true,
        showRating: item.showRating !== undefined ? item.showRating : true,
        showPrice: item.showPrice !== undefined ? item.showPrice : true,
        showLocation: item.showLocation !== undefined ? item.showLocation : true,
        showSchedule: item.showSchedule !== undefined ? item.showSchedule : true,
        showGroupType: item.showGroupType !== undefined ? item.showGroupType : true,
        showIncluded: item.showIncluded !== undefined ? item.showIncluded : true,
        showNotIncluded: item.showNotIncluded !== undefined ? item.showNotIncluded : true,
        showWhyChoose: item.showWhyChoose !== undefined ? item.showWhyChoose : true,
        showKnowBeforeYouGo: item.showKnowBeforeYouGo !== undefined ? item.showKnowBeforeYouGo : true,
      };
    };

    const homepageTours = baseToursList.map(enrichTour);
    const listingTours = baseToursList.map(enrichTour);

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

