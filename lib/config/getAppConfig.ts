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

    const savedHpItems = sanitizeTours(savedConfig.homepage?.tours?.items);
    const savedTpItems = sanitizeTours(savedConfig.toursPage?.tours?.items);
    const fallbackItems = defaultConfig.toursPage!.tours.items;

    // Map of latest content values keyed by id, slug, or title
    const contentMap = new Map<string, TourItem>();
    const allItems = [...fallbackItems, ...(savedHpItems || []), ...(savedTpItems || [])];
    for (const item of allItems) {
      const key = item.id || item.slug || item.title;
      if (key) {
        contentMap.set(key, { ...(contentMap.get(key) || {}), ...item });
      }
    }

    const homepageTours = (savedHpItems || fallbackItems).map((item) => {
      const key = item.id || item.slug || item.title;
      const latestContent = key ? contentMap.get(key) : null;
      return {
        ...item,
        ...(latestContent || {}),
        enabled: item.enabled !== undefined ? item.enabled : true,
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
    });

    const listingTours = (savedTpItems || fallbackItems).map((item) => {
      const key = item.id || item.slug || item.title;
      const latestContent = key ? contentMap.get(key) : null;
      return {
        ...item,
        ...(latestContent || {}),
        enabled: item.enabled !== undefined ? item.enabled : true,
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
    });

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

