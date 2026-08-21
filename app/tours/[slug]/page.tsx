'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TourGalleryHeader } from '../_components/TourGalleryHeader';
import { TourQuickInfoBar } from '../_components/TourQuickInfoBar';
import { TourDetailsContent } from '../_components/TourDetailsContent';
import { TourBookingForm } from '../_components/TourBookingForm';
import { defaultConfig } from '@/config/default-config';
import { findTourBySlug } from '@/lib/tour-utils';
import { ArrowLeft } from 'lucide-react';

export default function SingleTourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;

  const toursPage = config.toursPage || defaultConfig.toursPage!;
  const allTours = toursPage.tours.items;

  // Resolve matching tour or fallback to first tour
  const tour = findTourBySlug(allTours, resolvedParams.slug) || allTours[0];

  if (!tour) {
    return (
      <main className="min-h-screen flex flex-col justify-between">
        <Navbar
          primaryColor={primaryColor}
          appName={appName}
          logoUrl={logoUrl}
          nav={config.navigation}
        />
        <div className="py-40 text-center space-y-4 px-6">
          <h1 className="text-3xl font-bold text-foreground">Charter Not Found</h1>
          <p className="text-muted-foreground">The requested charter excursion could not be located.</p>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold text-white shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Charters
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const galleryImages =
    tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.imageUrl];

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      {/* Top Section: Hero Carousel for Single Charter */}
      <TourGalleryHeader
        tour={tour}
        gallery={galleryImages}
        primaryColor={primaryColor}
        accentColor={accentColor}
        heroBackgroundColor={toursPage.hero?.backgroundColor || primaryColor}
      />

      {/* Quick Info Bar */}
      <TourQuickInfoBar
        duration={tour.duration}
        location={tour.location}
        schedule={tour.schedule}
        groupType={tour.groupType}
        primaryColor={primaryColor}
      />

      {/* Details & Reservation Form */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        {toursPage.bookingForm?.enabled !== false ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Tour Narrative & Lists */}
            <div className="lg:col-span-7 xl:col-span-8">
              <TourDetailsContent tour={tour} primaryColor={primaryColor} />
            </div>

            {/* Right Column: Sticky Booking & Reservation Form */}
            <div className="lg:col-span-5 xl:col-span-4">
              <TourBookingForm
                tour={tour}
                config={toursPage.bookingForm}
                primaryColor={primaryColor}
                defaultAccessKey={config.contactPage?.form?.accessKey}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <TourDetailsContent tour={tour} primaryColor={primaryColor} />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
