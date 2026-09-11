'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ExcursionGalleryHeader } from '../_components/ExcursionGalleryHeader';
import { ExcursionQuickInfoBar } from '../_components/ExcursionQuickInfoBar';
import { ExcursionDetailsContent } from '../_components/ExcursionDetailsContent';
import { ExcursionBookingForm } from '../_components/ExcursionBookingForm';
import { defaultConfig } from '@/config/default-config';
import { findExcursionBySlug } from '@/lib/excursion-utils';
import { ArrowLeft } from 'lucide-react';

export default function SingleExcursionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;

  const excursionsPage = config.excursionsPage || defaultConfig.excursionsPage!;
  const allExcursions = (excursionsPage.tours?.items || []).filter((t) => !t.deleted);

  // Resolve matching excursion
  const excursion = findExcursionBySlug(allExcursions, resolvedParams.slug);

  if (!excursion) {
    return (
      <main className="min-h-screen flex flex-col justify-between">
        <Navbar
          primaryColor={primaryColor}
          appName={appName}
          logoUrl={logoUrl}
          nav={config.navigation}
        />
        <div className="py-40 text-center space-y-4 px-6">
          <h1 className="text-3xl font-bold text-foreground">Excursion Not Found</h1>
          <p className="text-muted-foreground">The requested coastal excursion could not be located.</p>
          <Link
            href="/excursions"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold text-white shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Excursions
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const galleryImages =
    excursion.gallery && excursion.gallery.length > 0 ? excursion.gallery : [excursion.imageUrl];

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      {/* Top Section: Hero Carousel for Single Excursion */}
      <ExcursionGalleryHeader
        excursion={excursion}
        gallery={galleryImages}
        primaryColor={primaryColor}
        accentColor={accentColor}
        heroBackgroundColor={excursionsPage.hero?.backgroundColor || primaryColor}
      />

      {/* Quick Info Bar */}
      <ExcursionQuickInfoBar
        duration={excursion.duration}
        showDuration={excursion.showDuration}
        location={excursion.location}
        showLocation={excursion.showLocation}
        schedule={excursion.schedule}
        showSchedule={excursion.showSchedule}
        groupType={excursion.groupType}
        showGroupType={excursion.showGroupType}
        primaryColor={primaryColor}
      />

      {/* Details & Reservation Form */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        {excursionsPage.bookingForm?.enabled !== false ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Excursion Narrative & Lists */}
            <div className="lg:col-span-7 xl:col-span-8">
              <ExcursionDetailsContent excursion={excursion} primaryColor={primaryColor} />
            </div>

            {/* Right Column: Sticky Booking & Reservation Form */}
            <div className="lg:col-span-5 xl:col-span-4">
              <ExcursionBookingForm
                excursion={excursion}
                config={excursionsPage.bookingForm}
                primaryColor={primaryColor}
                defaultAccessKey={config.contactPage?.form?.accessKey}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ExcursionDetailsContent excursion={excursion} primaryColor={primaryColor} />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
