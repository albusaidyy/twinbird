'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Star } from 'lucide-react';
import type { SectionList, TourItem } from '@/types/app-config';
import { isColorDark } from '@/lib/utils';

import { getTourSlug } from '@/lib/tour-utils';

export function TourListSection({
  data,
  primaryColor,
  accentColor = '#f6ab03',
}: {
  data: SectionList<TourItem>;
  primaryColor: string;
  accentColor?: string;
}) {
  if (!data || data.enabled === false) return null;

  const visibleTours = (data.items || []).filter((t) => t.enabled && !t.deleted);
  if (visibleTours.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor || '#f5f5f0');

  return (
    <section
      className={`py-20 md:py-28 px-6 ${isDark ? 'dark text-white' : 'text-slate-900'}`}
      style={{ backgroundColor: data.backgroundColor || '#f5f5f0' }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        {((data.title && data.title.trim() !== '') ||
          (data.eyebrow && data.eyebrow.trim() !== '') ||
          (data.subtitle && data.subtitle.trim() !== '')) && (
          <div className="mb-14 text-center max-w-3xl mx-auto">
            {data.eyebrow && data.eyebrow.trim() !== '' && (
              <span
                className="mb-3 text-xs font-bold uppercase tracking-widest block"
                style={{ color: primaryColor }}
              >
                {data.eyebrow}
              </span>
            )}
            {data.title && data.title.trim() !== '' && (
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
                {data.title}
              </h2>
            )}
            {data.subtitle && data.subtitle.trim() !== '' && (
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Tours Card Grid (Matches 3-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTours.map((tour, idx) => {
            const slug = getTourSlug(tour);
            const targetHref = `/safaris/${slug}`;
            const canShowBadge = tour.showBadge !== false && Boolean(tour.badge);
            const canShowDuration = tour.showDuration !== false && Boolean(tour.duration);
            const canShowRating = tour.showRating !== false && tour.rating > 0;
            const canShowTitle = tour.showTitle !== false && Boolean(tour.title);
            const canShowPrice = tour.showPrice !== false && Boolean(tour.price || tour.priceLabel);

            return (
              <article
                key={idx}
                className="group relative flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image Container with Duration Badge */}
                <Link href={targetHref} className="block relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <Image
                    src={tour.imageUrl || '/images/hero/hero.jpg'}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Duration Badge on top-left */}
                  {canShowDuration && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-sm">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{tour.duration}</span>
                    </div>
                  )}

                  {/* Rating / Special Badge on top-right */}
                  {canShowBadge && (
                    <span
                      className="absolute top-4 right-4 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {tour.badge}
                    </span>
                  )}
                </Link>

                {/* Card Content Area */}
                <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating Stars */}
                    {canShowRating && (
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(tour.rating)
                                  ? 'fill-current'
                                  : 'text-slate-300 dark:text-zinc-600'
                              }`}
                              style={{ color: accentColor }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {tour.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {canShowTitle && (
                      <Link href={targetHref} className="block">
                        <h3 className="font-serif text-xl font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                          {tour.title}
                        </h3>
                      </Link>
                    )}

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {tour.description}
                    </p>
                  </div>

                  {/* Bottom Bar: Price on Left, View -> on Right */}
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                    {canShowPrice ? (
                      <span className="text-xs text-muted-foreground font-medium italic">
                        {tour.price || tour.priceLabel || 'Contact for pricing'}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={targetHref}
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
                      style={{ color: primaryColor }}
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
