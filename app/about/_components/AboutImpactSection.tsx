import React from 'react';
import { getIcon } from '@/lib/icons';
import { isColorDark } from '@/lib/utils';
import type { AboutImpactSection as AboutImpactSectionType } from '@/types/app-config';

function renderIcon(name: string, className?: string) {
  return React.createElement(getIcon(name), { className });
}

interface AboutImpactSectionProps {
  data: AboutImpactSectionType;
  accentColor: string;
}

export function AboutImpactSection({
  data,
  accentColor,
}: AboutImpactSectionProps) {
  if (!data.enabled) return null;

  const visibleStats = data.stats.filter((s) => s.enabled);
  const isDark = isColorDark(data.backgroundColor || '#0f172a');


  return (
    <section
      className={`py-20 md:py-28 px-6 border-b border-border/40 ${
        isDark ? 'dark text-white' : 'text-foreground'
      }`}
      style={{ backgroundColor: data.backgroundColor || '#0f172a' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Impact Narrative & Stats */}
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-[1.15] text-white">
              {data.title}
            </h2>

            {data.subtitle && (
              <p className="mt-4 text-base md:text-lg text-slate-300 max-w-xl leading-relaxed">
                {data.subtitle}
              </p>
            )}

            {/* 2x2 Stats Grid */}
            {visibleStats.length > 0 && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-10 mt-10">
                {visibleStats.map((stat, idx) => (
                  <div key={`${stat.label}-${idx}`} className="flex flex-col">
                    <span
                      className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight"
                      style={{ color: accentColor || '#f6ab03' }}
                    >
                      {stat.value}
                    </span>
                    <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Global Partners Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md text-center flex flex-col items-center">
              {/* Partner Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  backgroundColor: `${accentColor || '#f6ab03'}20`,
                  color: accentColor || '#f6ab03',
                }}
              >
                {renderIcon(data.partnersCard.icon || 'ShieldCheck', 'w-7 h-7')}
              </div>

              {/* Card Title */}
              <h3 className="font-serif font-bold text-xl text-white mb-6">
                {data.partnersCard.title}
              </h3>

              {/* Partners Tags */}
              <div className="flex flex-wrap gap-2.5 justify-center">
                {data.partnersCard.partners.map((partner, idx) => (
                  <span
                    key={`${partner}-${idx}`}
                    className="px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-medium text-slate-200 shadow-sm"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
