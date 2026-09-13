'use client';

import React from 'react';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { AirTicketingFeaturesSection } from './_components/AirTicketingFeaturesSection';
import { AirTicketingBookingSection } from './_components/AirTicketingBookingSection';
import { AirTicketingServicesSection } from './_components/AirTicketingServicesSection';
import { AirTicketingFAQSection } from './_components/AirTicketingFAQSection';
import { defaultConfig } from '@/config/default-config';

export default function AirTicketingPage() {
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;

  const airTicketingPage = config.airTicketingPage || defaultConfig.airTicketingPage!;

  return (
    <main className="min-h-screen">
      {/* Global Header Navigation */}
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      {/* 1. Standard Hero Section */}
      <Hero
        hero={airTicketingPage.hero}
        primaryColor={primaryColor}
      />

      {/* 2. Standalone Features Highlights Section */}
      <AirTicketingFeaturesSection
        features={airTicketingPage.features}
        primaryColor={primaryColor}
        accentColor={accentColor}
        backgroundColor="#f5f5f0"
      />

      {/* 3. Main Booking Section (Local and International Routes + Booking Modal Dialog) */}
      <AirTicketingBookingSection
        routes={airTicketingPage.routesSection?.routes}
        routesTitle={airTicketingPage.routesSection?.title}
        routesSubtitle={airTicketingPage.routesSection?.subtitle}
        routesNote={airTicketingPage.routesSection?.note}
        localTitle={airTicketingPage.routesSection?.localTitle}
        localSubtitle={airTicketingPage.routesSection?.localSubtitle}
        internationalTitle={airTicketingPage.routesSection?.internationalTitle}
        internationalSubtitle={airTicketingPage.routesSection?.internationalSubtitle}
        formConfig={airTicketingPage.bookingForm}
        primaryColor={primaryColor}
        accentColor={accentColor}
        defaultAccessKey={config.contactPage?.form?.accessKey}
      />

      {/* 4. Partner Airlines & Flight Operators Logo Carousel */}
      {airTicketingPage.servicesSection?.enabled && (
        <AirTicketingServicesSection
          airlinesTitle={airTicketingPage.servicesSection.airlinesTitle}
          airlinesSubtitle={airTicketingPage.servicesSection.airlinesSubtitle}
          airlines={airTicketingPage.servicesSection.airlines}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      )}

      {/* 5. Frequently Asked Questions */}
      {airTicketingPage.faq?.enabled && (
        <AirTicketingFAQSection
          data={airTicketingPage.faq}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
