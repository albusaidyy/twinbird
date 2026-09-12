'use client';

import React from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { ExcursionItem } from '@/types/app-config';

export function ExcursionHeroCard({
  excursion,
  primaryColor,
}: {
  excursion: ExcursionItem;
  primaryColor: string;
}) {
  const imageUrl =
    excursion.heroImageUrl && excursion.heroImageUrl.trim() !== ''
      ? excursion.heroImageUrl
      : excursion.imageUrl && excursion.imageUrl.trim() !== ''
      ? excursion.imageUrl
      : '/images/hero/hero.jpg';

  const badgeText = excursion.badge || 'DAY EXCURSION';
  const durationText = excursion.duration || '10 Hours';
  const descriptionText = excursion.description || excursion.overview || '';

  return (
    <div className="relative w-full rounded-3xl md:rounded-[32px] overflow-hidden min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-end p-6 sm:p-10 md:p-12 text-white shadow-2xl bg-stone-900 border border-black/5">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={excursion.title}
        fill
        priority
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover object-center pointer-events-none z-0 transition-transform duration-700 hover:scale-105"
      />

      {/* Cinematic Gradient Overlays for High Contrast Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-radial-at-c from-transparent via-black/20 to-black/60 pointer-events-none" />

      {/* Hero Card Content */}
      <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {excursion.showBadge !== false && badgeText && (
            <span
              className="inline-flex items-center rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: primaryColor || '#de5d35' }}
            >
              {badgeText}
            </span>
          )}

          {excursion.showDuration !== false && durationText && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] sm:text-xs font-medium text-white/95 ring-1 ring-white/20">
              <Clock className="h-3.5 w-3.5 text-white/90" />
              <span>{durationText}</span>
            </span>
          )}
        </div>

        {/* Title */}
        {excursion.showTitle !== false && (
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.15] drop-shadow-md">
            {excursion.title}
          </h1>
        )}

        {/* Subtitle / Excerpt */}
        {descriptionText && (
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl drop-shadow-xs font-normal">
            {descriptionText}
          </p>
        )}
      </div>
    </div>
  );
}
