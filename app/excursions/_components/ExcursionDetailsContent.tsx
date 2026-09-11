'use client';

import { CheckCircle2, XCircle, Info, Compass } from 'lucide-react';
import type { ExcursionItem } from '@/types/app-config';

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
    `Departure: Scheduled pickup from your hotel lobby`,
    `Duration: Approx. ${excursion.duration || 'Full Day'}`,
    'What to bring: Comfortable attire, sunglasses, sunscreen, hat, and camera',
    'Booking: Advance reservations recommended to secure permits and boat slots',
  ];

  const included = excursion.included !== undefined ? excursion.included : defaultIncluded;
  const notIncluded = excursion.notIncluded !== undefined ? excursion.notIncluded : defaultNotIncluded;
  const whyChoose = excursion.whyChoose !== undefined ? excursion.whyChoose : defaultWhyChoose;
  const knowBeforeYouGo = excursion.knowBeforeYouGo !== undefined ? excursion.knowBeforeYouGo : defaultKnowBeforeYouGo;

  const canShowIncluded = excursion.showIncluded !== false && included.length > 0;
  const canShowNotIncluded = excursion.showNotIncluded !== false && notIncluded.length > 0;
  const canShowWhyChoose = excursion.showWhyChoose !== false && whyChoose.length > 0;
  const canShowKnowBeforeYouGo = excursion.showKnowBeforeYouGo !== false && knowBeforeYouGo.length > 0;

  return (
    <div className="space-y-12 text-slate-800 dark:text-slate-200">
      {/* Excursion Overview */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Excursion Overview
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          {overview}
        </p>
      </section>

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
