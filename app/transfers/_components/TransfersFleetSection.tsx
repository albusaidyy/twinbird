'use client';

import { Users, Luggage, ShieldCheck } from 'lucide-react';
import { TransferVehicle } from '@/types/app-config';

interface TransfersFleetSectionProps {
  title?: string;
  subtitle?: string;
  vehicles?: TransferVehicle[];
  primaryColor?: string;
  accentColor?: string;
}

export function TransfersFleetSection({
  title = 'Our Modern Fleet',
  subtitle = 'Well-maintained, clean, air-conditioned vehicles driven by professional local chauffeurs',
  vehicles = [],
  accentColor = '#d97706',
}: TransfersFleetSectionProps) {
  const visibleVehicles = (vehicles || []).filter((v) => v.enabled !== false);
  if (!visibleVehicles || visibleVehicles.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-[#0f1712] border-t border-zinc-200/60 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p 
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            FLEET & COMFORT
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            visibleVehicles.length <= 2
              ? 'lg:grid-cols-2 max-w-3xl'
              : visibleVehicles.length === 3
              ? 'lg:grid-cols-3 max-w-5xl'
              : 'lg:grid-cols-4 max-w-7xl'
          } mx-auto gap-6`}
        >
          {visibleVehicles.map((v) => (
            <div
              key={v.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                v.featured
                  ? 'bg-amber-50/40 dark:bg-zinc-900/90 border-2 border-amber-500/40 shadow-xl'
                  : 'bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              {v.featured && (
                <div 
                  className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  {v.category}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {v.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {v.description}
                </p>

                <div className="pt-2 space-y-2 border-t border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <Users className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    <span>{v.passengers}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <Luggage className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    <span>{v.luggage}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-200/40 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Air-conditioned
                </span>
                <span>Chauffeur-driven</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
