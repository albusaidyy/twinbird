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
    'Experience an exhilarating day on the ocean with premier charter boats and tournament-grade sportfishing gear.';

  const included =
    tour.included && tour.included.length > 0
      ? tour.included
      : [
          'Heavy and light sportfishing tackle, Shimano & Penn rods/reels',
          'Live bait, teaser spreads, and custom trolling lures',
          'Certified marine park permits and fishing licenses',
          'Experienced skipper and professional first mate',
          'Freshly prepared lunch and ice-cold refreshments',
          'Garmin sonar GPS, safety life vests, and first-aid equipment',
        ];

  const notIncluded =
    tour.notIncluded && tour.notIncluded.length > 0
      ? tour.notIncluded
      : [
          'Crew gratuities and tips (optional)',
          'Hotel pickup & return transfers (available on request)',
          'Personal swimwear & beach towels',
          'Alcoholic spirits (BYOB welcome)',
        ];

  const whyChoose =
    tour.whyChoose && tour.whyChoose.length > 0
      ? tour.whyChoose
      : [
          'Deep-sea sportfisher equipped with fighting chairs & shaded canopy',
          'Experienced local captain with decades of sportfishing knowledge',
          'Strict billfish conservation protocol with tagging and release',
          'All-inclusive private charter with premium gear and catering',
        ];

  const knowBeforeYouGo =
    tour.knowBeforeYouGo && tour.knowBeforeYouGo.length > 0
      ? tour.knowBeforeYouGo
      : [
          `Departure: Morning from Watamu Pier / Coastal Harbor`,
          `Duration: Approx. ${tour.duration || '6 - 8 hours'}`,
          'What to bring: Polarized sunglasses, reef-safe sunscreen, light jacket, deck shoes',
          'Booking: Reserve in advance to secure your boat and crew',
        ];

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
