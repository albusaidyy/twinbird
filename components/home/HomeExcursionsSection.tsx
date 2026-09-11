'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import type { SectionList, ExcursionItem } from '@/types/app-config';
import { isColorDark } from '@/lib/utils';
import { defaultConfig } from '@/config/default-config';
import { getExcursionSlug } from '@/lib/excursion-utils';

interface HomeExcursionsSectionProps {
  data?: SectionList<ExcursionItem>;
  primaryColor: string;
  accentColor?: string;
}

export function HomeExcursionsSection({
  data,
  primaryColor,
  accentColor = '#d97706',
}: HomeExcursionsSectionProps) {
  const fallback = defaultConfig.homepage.excursions;
  const config = data || fallback;

  if (config && config.enabled === false) return null;

  const title = config?.title ?? fallback?.title ?? 'Handcrafted Day Excursions';
  const subtitle =
    config?.subtitle ??
    fallback?.subtitle ??
    'Immerse yourself in Kenya’s marine sanctuaries, coastal coral gardens, and ancient forests on guided day journeys back before evening.';
  const eyebrow = config?.eyebrow ?? fallback?.eyebrow ?? 'DAY EXPEDITIONS & EXCURSIONS';
  const bgColor = config?.backgroundColor || '#fafafa';
  const isDark = isColorDark(bgColor);

  const visibleExcursions = (config?.items || fallback?.items || []).filter(
    (item) => item.enabled !== false && !item.deleted
  );

  if (visibleExcursions.length === 0) return null;

  return (
    <section
      className={`py-24 px-6 ${isDark ? 'dark text-white' : 'text-foreground'}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        {((title && title.trim() !== '') ||
          (eyebrow && eyebrow.trim() !== '') ||
          (subtitle && subtitle.trim() !== '')) && (
          <div className="mb-12 flex flex-col items-center text-center">
            {eyebrow && eyebrow.trim() !== '' && (
              <span
                className="mb-3 text-xs font-semibold uppercase tracking-widest"
                style={{ color: primaryColor }}
              >
                {eyebrow}
              </span>
            )}
            {title && title.trim() !== '' && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {title}
              </h2>
            )}
            {subtitle && subtitle.trim() !== '' && (
              <p className="mt-3 max-w-lg text-muted-foreground text-sm leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* 3-Column Excursions Grid matching FeaturedTours styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleExcursions.slice(0, 6).map((excursion, idx) => {
            const slug = getExcursionSlug(excursion);
            const targetHref = `/excursions/${slug}`;
            const canShowBadge = excursion.showBadge !== false && Boolean(excursion.badge);
            const canShowDuration = excursion.showDuration !== false && Boolean(excursion.duration);
            const canShowRating = excursion.showRating !== false && excursion.rating > 0;
            const canShowTitle = excursion.showTitle !== false && Boolean(excursion.title);
            const canShowPrice = excursion.showPrice !== false && Boolean(excursion.price || excursion.priceLabel);

            return (
              <article
                key={excursion.id || excursion.title || `excursion-${idx}`}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={targetHref} className="block relative h-52 overflow-hidden">
                    <Image
                      src={excursion.imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop'}
                      alt={excursion.title || 'Day Excursion'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {canShowBadge && (
                      <span
                        className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {excursion.badge}
                      </span>
                    )}
                  </Link>

                  <div className="p-5 pb-0">
                    {(canShowRating || canShowDuration) && (
                      <div className="flex items-center gap-1 mb-2">
                        {canShowRating && (
                          <>
                            <Star className="h-3.5 w-3.5" style={{ fill: accentColor, color: accentColor }} />
                            <span className="text-xs font-semibold text-foreground">{excursion.rating}</span>
                          </>
                        )}
                        {canShowDuration && (
                          <span className="text-xs text-muted-foreground ml-1">
                            {canShowRating ? `· ${excursion.duration}` : excursion.duration}
                          </span>
                        )}
                      </div>
                    )}

                    {canShowTitle && (
                      <Link href={targetHref} className="block">
                        <h3 className="font-bold text-foreground text-base hover:text-primary transition-colors line-clamp-2">
                          {excursion.title}
                        </h3>
                      </Link>
                    )}

                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {excursion.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-4">
                  <div className="flex items-center justify-between border-t border-border/50 pt-3">
                    {canShowPrice ? (
                      <span className="text-xs text-muted-foreground font-medium italic">
                        {excursion.price || excursion.priceLabel}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={targetHref}
                      className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                      style={{ color: primaryColor }}
                    >
                      View Details <ArrowRight className="h-3 w-3" />
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
