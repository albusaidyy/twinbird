'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Info, Compass, Clock, ChevronDown } from 'lucide-react';
import type { ExcursionItem } from '@/types/app-config';
import { defaultExcursionSchedule } from '@/config/default-config';

export function ExcursionDetailsContent({
  excursion,
  primaryColor,
}: {
  excursion: ExcursionItem;
  primaryColor: string;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

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

  const cleanList = (list: string[]) => list.map((s) => s.trim()).filter(Boolean);
  const knowBeforeYouGo = cleanList(
    excursion.knowBeforeYouGo && excursion.knowBeforeYouGo.length > 0
      ? excursion.knowBeforeYouGo
      : excursion.whatToCarry && excursion.whatToCarry.length > 0
      ? excursion.whatToCarry
      : defaultKnowBeforeYouGo
  );

  const included = cleanList(
    excursion.included !== undefined ? excursion.included : defaultIncluded
  );
  const notIncluded = cleanList(
    excursion.notIncluded !== undefined
      ? excursion.notIncluded
      : defaultNotIncluded
  );
  const whyChoose = cleanList(
    excursion.whyChoose !== undefined ? excursion.whyChoose : defaultWhyChoose
  );
  const scheduleItems =
    excursion.scheduleItems && excursion.scheduleItems.length > 0
      ? excursion.scheduleItems
      : defaultExcursionSchedule;

  const canShowIncluded =
    excursion.showIncluded !== false && included.length > 0;
  const canShowNotIncluded =
    excursion.showNotIncluded !== false && notIncluded.length > 0;
  const canShowWhyChoose =
    excursion.showWhyChoose !== false && whyChoose.length > 0;
  const canShowKnowBeforeYouGo =
    (excursion.showKnowBeforeYouGo !== false ||
      excursion.showWhatToCarry !== false) &&
    knowBeforeYouGo.length > 0;
  const canShowSchedule =
    excursion.showSchedule !== false &&
    excursion.showScheduleItems !== false &&
    scheduleItems.length > 0;

  return (
    <div className="space-y-12 text-slate-800 dark:text-slate-200">
      {/* Excursion Overview */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Excursion Overview
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {overview}
        </p>
      </section>

      {/* Day Schedule (Vertical Timeline) */}
      {canShowSchedule && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" style={{ color: primaryColor }} />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Day Schedule
            </h2>
          </div>

          <div className="relative pl-1 sm:pl-2">
            {scheduleItems.map((item, idx) => {
              const isLast = idx === scheduleItems.length - 1;
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={idx}
                  className="relative flex items-start gap-4 sm:gap-6 group"
                >
                  {/* Left Column: Pill Badge & Vertical Connector Line */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Time Pill Badge */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIndex((prev) => (prev === idx ? null : idx))
                      }
                      className="inline-flex items-center justify-center rounded-full px-3 sm:px-3.5 py-1 text-xs font-semibold text-white shadow-xs z-10 select-none whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor || '#437d70' }}
                    >
                      {item.time || `Stop ${idx + 1}`}
                    </button>

                    {/* Vertical Connector Line */}
                    {!isLast && (
                      <div className="w-[1.5px] bg-stone-200 dark:bg-stone-700/80 my-2 grow min-h-[36px]" />
                    )}
                  </div>

                  {/* Right Column: Title (always visible) & Description (collapsible) */}
                  <div
                    className={`grow ${
                      isLast ? 'pb-2' : isExpanded ? 'pb-7' : 'pb-5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIndex((prev) => (prev === idx ? null : idx))
                      }
                      className="w-full text-left flex items-center justify-between gap-3 group/header focus:outline-none cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground leading-snug group-hover/header:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-foreground' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && item.description && (
                      <div className="pt-2 animate-in fade-in-0 duration-200">
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-normal whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* What's Included */}
      {canShowIncluded && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" style={{ color: primaryColor }} />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              What’s Included
            </h2>
          </div>
          <ul className="space-y-3 pl-2">
            {included.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* What's Not Included */}
      {canShowNotIncluded && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-rose-500/80" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              What’s Not Included
            </h2>
          </div>
          <ul className="space-y-3 pl-2">
            {notIncluded.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed"
              >
                <span className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0 bg-rose-400/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Why Choose This Excursion */}
      {canShowWhyChoose && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5" style={{ color: primaryColor }} />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Why Choose This Excursion
            </h2>
          </div>
          <ul className="space-y-3 pl-2">
            {whyChoose.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Know Before You Go */}
      {canShowKnowBeforeYouGo && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" style={{ color: primaryColor }} />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Know Before You Go
            </h2>
          </div>
          <ul className="space-y-3 pl-2">
            {knowBeforeYouGo.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
