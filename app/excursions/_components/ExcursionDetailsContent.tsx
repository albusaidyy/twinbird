'use client';

import React from 'react';
import { Check, CheckCircle2, Luggage, XCircle, Compass, Sparkles } from 'lucide-react';
import type { ExcursionItem } from '@/types/app-config';
import { defaultExcursionSchedule } from '@/config/default-config';

export function ExcursionDetailsContent({
  excursion,
  primaryColor,
}: {
  excursion: ExcursionItem;
  primaryColor: string;
}) {
  const overview =
    excursion.overview ||
    excursion.description ||
    'Experience an exhilarating coastal excursion with certified local guides, scenic views, and personalized hospitality.';

  const defaultIncluded = [
    'Round-trip hotel pickup and drop-off in air-conditioned transport',
    'Professional certified local guide and expedition leader',
    'All Marine Park / Conservation area entry permits and fees',
    'Snorkeling gear (mask, snorkel, flippers, life vest) where applicable',
    'Chilled bottled mineral water and light tropical refreshments',
  ];

  const defaultNotIncluded = [
    'Driver and excursion guide gratuities (optional)',
    'Personal shopping, souvenirs, and handicraft purchases',
    'Personal travel, medical, and baggage insurance',
    'Alcoholic spirits and premium bottled beverages',
  ];

  const defaultWhyChoose = [
    'Small personalized groups with dedicated local naturalists',
    'Certified marine and cultural safety protocols on all outings',
    'Support for local conservation projects and community trusts',
    'Flexible hotel pickup schedules across the coastal zone',
  ];

  const defaultKnowBeforeYouGo = [
    'Wear comfortable walking shoes or sturdy sandals for coastal terrain',
    'Swimwear, beach towel, and change of clothes',
    'Wide-brim hat, sunglasses, and reef-safe sunscreen',
    'Waterproof camera or phone dry pouch recommended',
  ];

  const whatToCarry =
    excursion.whatToCarry && excursion.whatToCarry.length > 0
      ? excursion.whatToCarry
      : excursion.knowBeforeYouGo && excursion.knowBeforeYouGo.length > 0
      ? excursion.knowBeforeYouGo
      : defaultKnowBeforeYouGo;

  const included = excursion.included !== undefined ? excursion.included : defaultIncluded;
  const notIncluded = excursion.notIncluded !== undefined ? excursion.notIncluded : defaultNotIncluded;
  const whyChoose = excursion.whyChoose !== undefined ? excursion.whyChoose : defaultWhyChoose;
  const scheduleItems =
    excursion.scheduleItems && excursion.scheduleItems.length > 0
      ? excursion.scheduleItems
      : defaultExcursionSchedule;

  const canShowIncluded = excursion.showIncluded !== false && included.length > 0;
  const canShowNotIncluded = excursion.showNotIncluded !== false && notIncluded.length > 0;
  const canShowWhyChoose = excursion.showWhyChoose !== false && whyChoose.length > 0;
  const canShowWhatToCarry =
    excursion.showWhatToCarry !== false &&
    excursion.showKnowBeforeYouGo !== false &&
    whatToCarry.length > 0;
  const canShowSchedule = excursion.showSchedule !== false && scheduleItems.length > 0;

  return (
    <div className="space-y-16 text-slate-800 dark:text-slate-200">
      {/* 1. About This Excursion */}
      <section className="space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
          About this excursion
        </h2>
        <div className="text-base sm:text-lg text-muted-foreground/90 leading-relaxed font-normal space-y-4 whitespace-pre-line">
          {overview}
        </div>
      </section>

      {/* 2. Day Schedule (Vertical Timeline) */}
      {canShowSchedule && (
        <section className="space-y-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
            Day schedule
          </h2>

          <div className="relative pl-1 sm:pl-2">
            {scheduleItems.map((item, idx) => {
              const isLast = idx === scheduleItems.length - 1;
              return (
                <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
                  {/* Left Column: Pill Badge & Vertical Connector Line */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Time Pill Badge */}
                    <span
                      className="inline-flex items-center justify-center rounded-full px-3 sm:px-3.5 py-1 text-xs font-semibold text-white shadow-xs z-10 select-none whitespace-nowrap"
                      style={{ backgroundColor: primaryColor || '#437d70' }}
                    >
                      {item.time || `Stop ${idx + 1}`}
                    </span>

                    {/* Vertical Connector Line */}
                    {!isLast && (
                      <div className="w-[1.5px] bg-stone-200 dark:bg-stone-700/80 my-2 grow min-h-[55px]" />
                    )}
                  </div>

                  {/* Right Column: Title & Description */}
                  <div className={`space-y-2 grow ${isLast ? 'pb-2' : 'pb-8'}`}>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed font-normal whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. What's Included & What to Carry (Side-by-Side White Cards) */}
      {(canShowIncluded || canShowWhatToCarry) && (
        <section className="space-y-6 sm:space-y-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
            What&apos;s included
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* Left Card: Included */}
            {canShowIncluded && (
              <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs border border-stone-200/70 dark:border-zinc-800 space-y-5 flex flex-col">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                    Included
                  </h3>
                </div>

                <ul className="space-y-3.5 grow text-sm sm:text-base text-muted-foreground/95">
                  {included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 leading-relaxed">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Right Card: What to carry */}
            {canShowWhatToCarry && (
              <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs border border-stone-200/70 dark:border-zinc-800 space-y-5 flex flex-col">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                    <Luggage className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                    What to carry
                  </h3>
                </div>

                <ul className="space-y-3.5 grow text-sm sm:text-base text-muted-foreground/95">
                  {whatToCarry.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Why Choose This Excursion */}
      {canShowWhyChoose && (
        <section className="space-y-6">
          <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs border border-stone-200/70 dark:border-zinc-800 space-y-5">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: primaryColor || '#437d70' }}
              >
                <Compass className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                Why Choose This Excursion
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyChoose.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-100 dark:border-zinc-700/60 text-sm sm:text-base text-muted-foreground/95"
                >
                  <Sparkles
                    className="h-4 w-4 mt-1 shrink-0"
                    style={{ color: primaryColor || '#437d70' }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. What's Not Included */}
      {canShowNotIncluded && (
        <section className="space-y-4">
          <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs border border-stone-200/70 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                <XCircle className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                What&apos;s Not Included
              </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base text-muted-foreground/95">
              {notIncluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
