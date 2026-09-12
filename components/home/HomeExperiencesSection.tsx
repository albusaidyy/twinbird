'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { SectionList, ExperienceItem } from '@/types/app-config';
import { getIcon } from '@/lib/icons';
import { isColorDark } from '@/lib/utils';
import { defaultConfig } from '@/config/default-config';

interface HomeExperiencesSectionProps {
  data?: SectionList<ExperienceItem>;
  primaryColor: string;
}

export function HomeExperiencesSection({
  data,
  primaryColor,
}: HomeExperiencesSectionProps) {
  const fallback = defaultConfig.homepage.experiences;
  const config = data || fallback;

  if (config && config.enabled === false) return null;

  const title = config?.title ?? fallback?.title ?? 'Our experiences';
  const subtitle = config?.subtitle ?? fallback?.subtitle ?? 'Tailored journeys designed to connect you deeply with the spirit of the wild.';
  const eyebrow = config?.eyebrow ?? fallback?.eyebrow ?? 'WHAT WE OFFER';
  const bgColor = config?.backgroundColor || '#fbf9f5';
  const isDark = isColorDark(bgColor);

  const items = (config?.items || fallback?.items || []).filter(
    (item) => item.enabled !== false
  );

  if (items.length === 0) return null;

  return (
    <section
      className={`py-20 md:py-28 px-6 transition-colors ${
        isDark ? 'dark text-white' : 'text-foreground'
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        {((title && title.trim() !== '') ||
          (eyebrow && eyebrow.trim() !== '') ||
          (subtitle && subtitle.trim() !== '')) && (
          <div className="mb-14 md:mb-16 flex flex-col items-center text-center">
            {eyebrow && eyebrow.trim() !== '' && (
              <span
                className="mb-3 text-xs md:text-sm font-bold uppercase tracking-[0.2em]"
                style={{ color: primaryColor }}
              >
                {eyebrow}
              </span>
            )}
            {title && title.trim() !== '' && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-serif">
                {title}
              </h2>
            )}
            {subtitle && subtitle.trim() !== '' && (
              <p className="mt-4 max-w-2xl text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* 3-Column Experience Grid */}
        <div
          className={`grid grid-cols-1 gap-6 md:gap-8 ${
            items.length === 1
              ? 'max-w-md mx-auto'
              : items.length === 2
              ? 'md:grid-cols-2 max-w-4xl mx-auto'
              : 'md:grid-cols-3'
          }`}
        >
          {items.map((item, idx) => {
            const IconComp = getIcon(item.icon || 'Compass');
            const href = item.ctaHref || '/safaris';

            return (
              <div
                key={item.id || `experience-${idx}`}
                className="group relative flex flex-col justify-between rounded-3xl bg-card border border-border/80 p-8 sm:p-9 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
              >
                <div>
                  {/* Icon */}
                  <div
                    className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${primaryColor}14`,
                      color: primaryColor,
                    }}
                  >
                    <IconComp className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* CTA Link */}
                <div className="mt-8 pt-4 border-t border-border/40">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm sm:text-base font-bold transition-all duration-200 group-hover:gap-3"
                    style={{ color: primaryColor }}
                  >
                    <span>{item.ctaLabel || 'Explore'}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
