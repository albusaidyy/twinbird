'use client';

import Image from 'next/image';
import { isColorDark } from '@/lib/utils';
import type { SectionList, AboutTeamMember } from '@/types/app-config';

interface AboutTeamSectionProps {
  data: SectionList<AboutTeamMember>;
  primaryColor: string;
}

export function AboutTeamSection({ data, primaryColor }: AboutTeamSectionProps) {
  if (!data.enabled) return null;

  const visibleMembers = data.items.filter((m) => m.enabled);
  if (visibleMembers.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);

  return (
    <section
      className={`py-20 md:py-28 px-6 border-b border-border/60 ${
        isDark ? 'dark text-white' : 'text-foreground'
      }`}
      style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleMembers.map((member, idx) => {
            const hasImage = Boolean(member.imageUrl && member.imageUrl.trim() !== '');

            return (
              <div key={`${member.name}-${idx}`} className="flex flex-col group">
                {/* Member Image Card */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted/80 shadow-md border border-border/40 transition-transform duration-300 group-hover:-translate-y-1">
                  {hasImage ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/20 text-muted-foreground text-sm">
                      Crew Member Photo
                    </div>
                  )}

                  {/* Role Badge Overlay on bottom-left */}
                  {member.role && (
                    <div className="absolute bottom-4 left-4 z-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-foreground shadow-lg border border-black/5 dark:border-white/10">
                      {member.role}
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="mt-5">
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    {member.name}
                  </h3>
                  {member.quote && (
                    <p className="mt-2 text-sm text-muted-foreground italic leading-relaxed">
                      {member.quote}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
