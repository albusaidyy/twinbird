import type { ExcursionItem } from "@/types/app-config";

export function slugifyExcursion(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getExcursionSlug(excursion: ExcursionItem): string {
  if (excursion.slug && excursion.slug.trim() !== "") {
    return excursion.slug.trim().toLowerCase();
  }
  if (excursion.href && excursion.href.trim() !== "") {
    const extracted = excursion.href
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/^\/?excursions\//i, "")
      .replace(/^\/+|\/+$/g, "")
      .trim();
    if (extracted && !extracted.startsWith("http")) {
      return extracted.toLowerCase();
    }
  }
  return slugifyExcursion(excursion.title);
}

export function findExcursionBySlug(
  excursions: ExcursionItem[],
  slug: string,
): ExcursionItem | undefined {
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  return excursions.find((t) => {
    if (t.deleted) return false;
    const eSlug = getExcursionSlug(t);
    return eSlug === decodedSlug || slugifyExcursion(t.title) === decodedSlug;
  });
}

export function isExcursionMatch(
  a: ExcursionItem,
  b: ExcursionItem,
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
