import type { TourItem } from '@/types/app-config';

export function isTourMatch(a: TourItem, b: TourItem, aIdx?: number, bIdx?: number): boolean {
  if (a.id && b.id) return a.id === b.id;
  if (a.slug && b.slug) return a.slug === b.slug;
  if (a.title && b.title && a.title.trim().toLowerCase() === b.title.trim().toLowerCase()) return true;
  if (aIdx !== undefined && bIdx !== undefined) return aIdx === bIdx;
  return false;
}

export function slugifyNavRoute(label: string): string {
  const trimmed = label.trim().toLowerCase();
  if (trimmed === 'home' || trimmed === 'main' || trimmed === '') return '/';
  if (
    trimmed === 'air ticketing' ||
    trimmed === 'air-ticketing' ||
    trimmed === 'flights' ||
    trimmed === 'flight' ||
    trimmed === 'flight booking' ||
    trimmed === 'air tickets' ||
    trimmed === 'plane tickets' ||
    trimmed === 'aviation'
  )
    return '/air-ticketing';
  if (
    trimmed === 'fishing charters' ||
    trimmed === 'charters' ||
    trimmed === 'tours' ||
    trimmed === 'safari' ||
    trimmed === 'safaris' ||
    trimmed === 'safari tours'
  )
    return '/safaris';
  if (
    trimmed === 'excursions' ||
    trimmed === 'excursion' ||
    trimmed === 'day trips' ||
    trimmed === 'day tours' ||
    trimmed === 'activities'
  )
    return '/excursions';
  if (trimmed === 'transfers' || trimmed === 'airport transfers' || trimmed === 'taxi' || trimmed === 'cabs')
    return '/transfers';
  if (trimmed === 'about' || trimmed === 'about us' || trimmed === 'our story') return '/about';
  if (trimmed === 'contact' || trimmed === 'contact us' || trimmed === 'booking' || trimmed === 'book') return '/contact';

  const slug = trimmed
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `/${slug}`;
}

export const NAV_PRESETS = [
  { label: 'Home', href: '/' },
  { label: 'Air Ticketing', href: '/air-ticketing' },
  { label: 'Safaris', href: '/safaris' },
  { label: 'Excursions', href: '/excursions' },
  { label: 'Transfers', href: '/transfers' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Recursively scans an AppConfig object to find all image URLs currently in use.
 */
export function getAllUsedImageUrls(config: unknown): Set<string> {
  const urls = new Set<string>();

  function traverse(obj: unknown) {
    if (!obj) return;
    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('/') ||
        /\.(png|jpe?g|svg|webp|gif|avif|ico|bmp)$/i.test(trimmed)
      ) {
        urls.add(trimmed);
      }
      return;
    }
    if (Array.isArray(obj)) {
      for (const item of obj) {
        traverse(item);
      }
      return;
    }
    if (typeof obj === 'object') {
      for (const val of Object.values(obj as Record<string, unknown>)) {
        traverse(val);
      }
    }
  }

  traverse(config);
  return urls;
}

/**
 * Checks whether a given media item is currently in use in the configuration.
 */
export function isMediaItemInUse(
  item: { url: string; storagePath?: string },
  usedUrls: Set<string>
): boolean {
  if (usedUrls.has(item.url)) return true;
  if (item.storagePath && usedUrls.has(item.storagePath)) return true;
  for (const u of usedUrls) {
    if (u === item.url) return true;
    if (item.storagePath && u.includes(item.storagePath)) return true;
  }
  return false;
}
