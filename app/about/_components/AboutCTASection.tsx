'use client';

import Link from 'next/link';
import { isColorDark } from '@/lib/utils';
import type { AboutCTASection as AboutCTASectionType } from '@/types/app-config';

interface AboutCTASectionProps {
  data: AboutCTASectionType;
  primaryColor: string;
}

export function AboutCTASection({ data, primaryColor }: AboutCTASectionProps) {
  if (!data.enabled) return null;

  const isDark = isColorDark(data.backgroundColor || '#fafafa');

  return (
    <section
      className={`py-24 md:py-32 px-6 ${
        isDark ? 'dark text-white' : 'text-foreground'
      }`}
      style={{ backgroundColor: data.backgroundColor || '#fafafa' }}
    >
      <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
        {data.title && (
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
            {data.title}
          </h2>
        )}

        {data.subtitle && (
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {data.subtitle}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {data.primaryCta?.enabled && (
            <Link
              href={data.primaryCta.href || '/contact'}
              className="rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: primaryColor }}
            >
              {data.primaryCta.label || 'Book Your Safari'}
            </Link>
          )}

          {data.secondaryCta?.enabled && (
            <Link
              href={data.secondaryCta.href || '/contact'}
              className="rounded-full px-8 py-4 text-sm font-semibold text-foreground bg-background/90 border border-border/80 shadow-sm transition-all hover:bg-accent hover:border-border"
            >
              {data.secondaryCta.label || 'Get in Touch'}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
