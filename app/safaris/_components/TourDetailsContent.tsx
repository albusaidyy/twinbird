'use client';

import { CheckCircle2, XCircle, Info, Compass } from 'lucide-react';
import type { TourItem } from '@/types/app-config';

export function TourDetailsContent({
  tour,
  primaryColor,
}: {
  tour: TourItem;
  primaryColor: string;
}) {
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

  const included = tour.included !== undefined ? tour.included : defaultIncluded;
  const notIncluded = tour.notIncluded !== undefined ? tour.notIncluded : defaultNotIncluded;
  const whyChoose = tour.whyChoose !== undefined ? tour.whyChoose : defaultWhyChoose;
  const knowBeforeYouGo = tour.knowBeforeYouGo !== undefined ? tour.knowBeforeYouGo : defaultKnowBeforeYouGo;

  const canShowIncluded = tour.showIncluded !== false && included.length > 0;
  const canShowNotIncluded = tour.showNotIncluded !== false && notIncluded.length > 0;
  const canShowWhyChoose = tour.showWhyChoose !== false && whyChoose.length > 0;
  const canShowKnowBeforeYouGo = tour.showKnowBeforeYouGo !== false && knowBeforeYouGo.length > 0;

  return (
    <div className="space-y-12 text-slate-800 dark:text-slate-200">
      {/* Tour Overview */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Tour Overview
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
