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
  { label: 'Safaris', href: '/safaris' },
  { label: 'Excursions', href: '/excursions' },
  { label: 'Transfers', href: '/transfers' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
