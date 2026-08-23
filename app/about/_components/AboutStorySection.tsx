'use client';

import Image from 'next/image';
import { isColorDark } from '@/lib/utils';
import type { AboutStorySection as AboutStorySectionType } from '@/types/app-config';

interface AboutStorySectionProps {
  data: AboutStorySectionType;
  primaryColor: string;
}

export function AboutStorySection({ data, primaryColor }: AboutStorySectionProps) {
  if (!data.enabled) return null;

  const isDark = isColorDark(data.backgroundColor);
  const hasImage = Boolean(data.imageUrl && data.imageUrl.trim() !== '');
  const visibleParagraphs = (
    data.paragraphs && data.paragraphs.length > 0
      ? data.paragraphs
      : ([data.paragraph1, data.paragraph2].filter(Boolean) as string[])
  )
    .map((p) => (typeof p === 'string' ? { enabled: true, text: p } : p))
    .filter((p) => p && p.enabled && p.text && p.text.trim() !== '');

  return (
    <section
      className={`py-20 md:py-28 px-6 border-b border-border/60 ${
        isDark ? 'dark text-white' : 'text-foreground'
      }`}
      style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {data.eyebrow && data.eyebrow.trim() !== '' && (
              <span
                className="mb-4 inline-block text-xs font-bold uppercase tracking-widest"
                style={{ color: primaryColor }}
              >
                {data.eyebrow}
              </span>
            )}

            <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight leading-[1.15] text-foreground">
              {data.title}
            </h2>

            <div className="mt-6 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {visibleParagraphs.map((para, idx) => (
                <p key={idx}>{para.text}</p>
              ))}
            </div>
          </div>

          {/* Right Column: Imagery */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-border/40 bg-muted">
              {hasImage ? (
                <Image
                  src={data.imageUrl}
                  alt={data.imageAlt || data.title || 'About us'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/30 text-muted-foreground text-sm">
                  Image placeholder
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
