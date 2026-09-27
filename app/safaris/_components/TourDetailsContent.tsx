'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Info, Compass, CalendarDays, ChevronDown } from 'lucide-react';
import type { TourItem } from '@/types/app-config';
import { defaultSafariItinerary } from '@/config/default-config';

export function TourDetailsContent({
  tour,
  primaryColor,
}: {
  tour: TourItem;
  primaryColor: string;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const overview =
    tour.overview ||
    tour.description ||
    'Experience an exhilarating wildlife safari with customized 4x4 Land Cruisers, certified professional naturalists, and premier game drives.';

  const defaultIncluded = [
    'Customized 4x4 Safari Land Cruiser with pop-up viewing roof',
    'Professional certified safari guide & wildlife tracker',
    'All National Park & Reserve conservation entry fees',
    'Full-board accommodation at luxury tented camp or safari lodge',
    'Unlimited bottled mineral water during all game drives',
    'Round-trip hotel or airport transfers in comfortable transport',
  ];

  const defaultNotIncluded = [
    'Driver-guide and camp staff gratuities (optional)',
    'Hot air balloon safari excursion (available as an add-on)',
    'Personal travel, medical, and baggage insurance',
    'Alcoholic spirits and premium bottled beverages',
  ];

  const defaultWhyChoose = [
    'Guaranteed window seats in custom 4x4 safari vehicles',
    'Silver & gold-level certified professional safari guides',
    'Ethical wildlife tracking with high Big Five sighting success',
    'Handpicked luxury eco-camps inside prime wildlife territories',
  ];

  const defaultKnowBeforeYouGo = [
    `Departure: Early morning pickup from your hotel or airport`,
    `Duration: Approx. ${tour.duration || 'Full Day'}`,
    'What to bring: Neutral-colored clothing, wide-brim hat, binoculars, camera gear, and a warm fleece for morning game drives',
    'Booking: Advance reservations recommended to secure park permits and lodge bookings',
  ];

  const cleanList = (list: string[]) => list.map((s) => s.trim()).filter(Boolean);
  const included = cleanList(tour.included !== undefined ? tour.included : defaultIncluded);
  const notIncluded = cleanList(tour.notIncluded !== undefined ? tour.notIncluded : defaultNotIncluded);
  const whyChoose = cleanList(tour.whyChoose !== undefined ? tour.whyChoose : defaultWhyChoose);
  const knowBeforeYouGo = cleanList(tour.knowBeforeYouGo !== undefined ? tour.knowBeforeYouGo : defaultKnowBeforeYouGo);
  const itinerary =
    tour.itinerary && tour.itinerary.length > 0
      ? tour.itinerary
      : defaultSafariItinerary;

  const canShowIncluded = tour.showIncluded !== false && included.length > 0;
  const canShowNotIncluded = tour.showNotIncluded !== false && notIncluded.length > 0;
  const canShowWhyChoose = tour.showWhyChoose !== false && whyChoose.length > 0;
  const canShowKnowBeforeYouGo = tour.showKnowBeforeYouGo !== false && knowBeforeYouGo.length > 0;
  const canShowItinerary =
    tour.showItinerary !== false && itinerary.length > 0;

  return (
    <div className="space-y-12 text-slate-800 dark:text-slate-200">
      {/* Tour Overview */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Tour Overview
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {overview}
        </p>
      </section>

      {/* Day-by-Day Safari Itinerary (Vertical Timeline) */}
      {canShowItinerary && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" style={{ color: primaryColor }} />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Day-by-Day Itinerary
            </h2>
          </div>

          <div className="relative pl-1 sm:pl-2">
            {itinerary.map((item, idx) => {
              const isLast = idx === itinerary.length - 1;
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={idx}
                  className="relative flex items-start gap-4 sm:gap-6 group"
                >
                  {/* Left Column: Pill Badge & Vertical Connector Line */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Day Pill Badge */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIndex((prev) => (prev === idx ? null : idx))
                      }
                      className="inline-flex items-center justify-center rounded-full px-3 sm:px-3.5 py-1 text-xs font-semibold text-white shadow-xs z-10 select-none whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor || '#1b4332' }}
                    >
                      {item.day || `Day ${idx + 1}`}
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
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: primaryColor }} />
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
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0 bg-rose-400/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Why Choose This Tour */}
      {canShowWhyChoose && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5" style={{ color: primaryColor }} />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Why Choose This Tour
            </h2>
          </div>
          <ul className="space-y-3 pl-2">
            {whyChoose.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: primaryColor }} />
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
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: primaryColor }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
