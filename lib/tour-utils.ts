import type { TourItem } from '@/types/app-config';

export function slugifyTour(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getTourSlug(tour: TourItem): string {
  if (tour.slug && tour.slug.trim() !== '') {
    return tour.slug.trim().toLowerCase();
  }
  if (tour.href && tour.href.trim() !== '') {
    const extracted = tour.href
      .replace(/^https?:\/\/[^/]+/i, '')
      .replace(/^\/?safaris\//i, '')
      .replace(/^\/+|\/+$/g, '')
      .trim();
    if (extracted && !extracted.startsWith('http')) {
      return extracted.toLowerCase();
    }
  }
  return slugifyTour(tour.title);
}

export function findTourBySlug(tours: TourItem[], slug: string): TourItem | undefined {
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  return tours.find((t) => {
    if (t.deleted) return false;
    const tSlug = getTourSlug(t);
    return tSlug === decodedSlug || slugifyTour(t.title) === decodedSlug;
  });
}
