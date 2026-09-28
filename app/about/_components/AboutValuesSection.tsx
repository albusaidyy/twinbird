import React from 'react';
import Image from 'next/image';
import { getIcon } from '@/lib/icons';
import { isColorDark } from '@/lib/utils';
import type { SectionList, AboutValueItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';

interface AboutValuesSectionProps {
  data: SectionList<AboutValueItem>;
  primaryColor: string;
  accentColor?: string;
}

export function AboutValuesSection({
  data,
  primaryColor,
  accentColor,
}: AboutValuesSectionProps) {
  if (!data.enabled) return null;

  const visibleItems = data.items.filter((i) => i.enabled);
  if (visibleItems.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);
  const activeAccent = accentColor || primaryColor;
  const fallbackImage =
    defaultConfig.aboutPage?.values.imageUrl ||
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop';
  const imageUrl = data.imageUrl || fallbackImage;

  const title = data.title ?? 'Our Core Values';
  const subtitle = data.subtitle;
  const eyebrow = data.eyebrow;

  return (
    <section
      className={`py-24 px-6 border-b border-border/60 ${
        isDark ? 'dark text-white' : 'text-foreground'
      }`}
      style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Image with 100% Badge */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div
            className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="text-4xl font-bold tracking-tight">100%</span>
            <span className="text-xs font-semibold uppercase tracking-widest mt-1">
              Locally Owned
              <br />& Operated
            </span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          {eyebrow && eyebrow.trim() !== '' && (
            <span
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: activeAccent }}
            >
              {eyebrow}
            </span>
          )}

          {title && title.trim() !== '' && (
            <h2
              className={`text-4xl md:text-5xl font-serif text-foreground leading-tight ${
                subtitle && subtitle.trim() !== '' ? 'mb-4' : 'mb-10'
              }`}
            >
              {title}
            </h2>
          )}

          {subtitle && subtitle.trim() !== '' && (
            <p className="mb-10 text-muted-foreground text-sm md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="space-y-8">
            {visibleItems.map((item, idx) => {
              const Icon = getIcon(item.icon);
              return (
                <div key={`${item.title}-${idx}`} className="flex gap-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform hover:scale-105"
                    style={{
                      backgroundColor: `${activeAccent}20`,
                      color: activeAccent,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-foreground text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
