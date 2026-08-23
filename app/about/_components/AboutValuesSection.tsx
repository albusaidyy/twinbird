import React from 'react';
import { getIcon } from '@/lib/icons';
import { isColorDark } from '@/lib/utils';
import type { SectionList, AboutValueItem } from '@/types/app-config';

function renderIcon(name: string, className?: string) {
  return React.createElement(getIcon(name), { className });
}

interface AboutValuesSectionProps {
  data: SectionList<AboutValueItem>;
  primaryColor: string;
}

export function AboutValuesSection({
  data,
  primaryColor,
}: AboutValuesSectionProps) {
  if (!data.enabled) return null;

  const visibleItems = data.items.filter((i) => i.enabled);
  if (visibleItems.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);

  return (
    <section
      className={`py-20 md:py-28 px-6 border-b border-border/60 ${
        isDark ? 'dark text-white' : 'text-foreground'
      }`}
      style={{ backgroundColor: data.backgroundColor || '#fafafa' }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          {data.eyebrow && data.eyebrow.trim() !== '' && (
            <span
              className="mb-3 inline-block text-xs font-bold uppercase tracking-widest"
              style={{ color: primaryColor }}
            >
              {data.eyebrow}
            </span>
          )}

          {data.title && (
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
              {data.title}
            </h2>
          )}

          {data.subtitle && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* 4-Card Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleItems.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="bg-card text-card-foreground rounded-2xl p-7 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-200 border border-border/60 group"
            >
              {/* Icon Container */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${primaryColor}14`,
                  color: primaryColor,
                }}
              >
                {renderIcon(item.icon, 'w-7 h-7')}
              </div>

              {/* Card Title */}
              <h3 className="font-serif font-bold text-lg text-foreground mb-2.5">
                {item.title}
              </h3>

              {/* Card Body */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
