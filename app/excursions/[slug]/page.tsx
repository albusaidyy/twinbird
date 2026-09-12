"use client";

import React, { use } from "react";
import Link from "next/link";
import { useAppConfig } from "@/components/providers/AppConfigProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExcursionHeroCard } from "../_components/ExcursionHeroCard";
import { ExcursionDetailsContent } from "../_components/ExcursionDetailsContent";
import { ExcursionMosaicGallery } from "../_components/ExcursionMosaicGallery";
import { ExcursionBookingForm } from "../_components/ExcursionBookingForm";
import { defaultConfig } from "@/config/default-config";
import { findExcursionBySlug } from "@/lib/excursion-utils";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function SingleExcursionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { config } = useAppConfig();
  const { primaryColor, appName, logoUrl } = config.branding;

  const excursionsPage = config.excursionsPage || defaultConfig.excursionsPage!;
  const allExcursions = (excursionsPage.tours?.items || []).filter(
    (t) => !t.deleted,
  );

  // Resolve matching excursion
  const excursion = findExcursionBySlug(allExcursions, resolvedParams.slug);

  if (!excursion) {
    return (
      <main className="min-h-screen flex flex-col justify-between bg-[#faf7f2] dark:bg-stone-950">
        <Navbar
          primaryColor={primaryColor}
          appName={appName}
          logoUrl={logoUrl}
          nav={config.navigation}
        />
        <div className="py-40 text-center space-y-4 px-6">
          <h1 className="text-3xl font-bold text-foreground font-serif">
            Excursion Not Found
          </h1>
          <p className="text-muted-foreground">
            The requested coastal excursion could not be located.
          </p>
          <Link
            href="/excursions"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Excursions
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] dark:bg-stone-950 text-foreground">
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-20 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium"
        >
          <Link
            href="/"
            className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <Link
            href="/excursions"
            className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            Excursions
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span
            className="font-medium truncate max-w-[240px] sm:max-w-md"
            style={{ color: primaryColor || "#c25e3d" }}
          >
            {excursion.title}
          </span>
        </nav>

        {/* 1. Hero Card */}
        <ExcursionHeroCard
          excursion={excursion}
          primaryColor={primaryColor}
        />

        {/* 2. Narrative Details & Inclusions / Itinerary */}
        <div className="max-w-5xl mx-auto w-full space-y-16 sm:space-y-20">
          <ExcursionDetailsContent
            excursion={excursion}
            primaryColor={primaryColor}
          />

          {/* 3. Mosaic Gallery */}
          <ExcursionMosaicGallery excursion={excursion} />

          {/* 4. Booking Form (At the end of the gallery) */}
          {excursionsPage.bookingForm?.enabled !== false && (
            <section id="reservation-form" className="pt-6 sm:pt-10">
              <div className="max-w-3xl mx-auto">
                <ExcursionBookingForm
                  excursion={excursion}
                  config={excursionsPage.bookingForm}
                  primaryColor={primaryColor}
                  defaultAccessKey={config.contactPage?.form?.accessKey}
                />
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
