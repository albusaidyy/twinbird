'use client';

import React from 'react';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { TransfersFeaturesSection } from './_components/TransfersFeaturesSection';
import { TransfersBookingSection } from './_components/TransfersBookingSection';
import { TransfersFleetSection } from './_components/TransfersFleetSection';
import { TransfersFAQSection } from './_components/TransfersFAQSection';
import { defaultConfig } from '@/config/default-config';

export default function TransfersPage() {
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;

  const transfersPage = config.transfersPage || defaultConfig.transfersPage!;

  return (
    <main className="min-h-screen">
      {/* Global Header Navigation */}
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      {/* 1. Standard Hero Section (matching App Hero standard) */}
      <Hero
        hero={transfersPage.hero}
        primaryColor={primaryColor}
      />

      {/* 2. Standalone Features Highlights Section (4 white cards on cream safari background) */}
      <TransfersFeaturesSection
        features={transfersPage.features}
        primaryColor={primaryColor}
        accentColor={accentColor}
        backgroundColor="#f5f5f0"
      />

      {/* 2. Main Booking Section (Available Routes + Book This Transfer Form) */}
      <TransfersBookingSection
        routes={transfersPage.routesSection?.routes}
        routesTitle={transfersPage.routesSection?.title}
        routesSubtitle={transfersPage.routesSection?.subtitle}
        routesNote={transfersPage.routesSection?.note}
        formConfig={transfersPage.bookingForm}
        primaryColor={primaryColor}
        accentColor={accentColor}
        defaultAccessKey={config.contactPage?.form?.accessKey}
      />

      {/* 3. Modern Fleet Overview */}
      {transfersPage.vehiclesSection?.enabled && (
        <TransfersFleetSection
          title={transfersPage.vehiclesSection.title}
          subtitle={transfersPage.vehiclesSection.subtitle}
          vehicles={transfersPage.vehiclesSection.vehicles}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      )}

      {/* 4. Frequently Asked Questions */}
      {transfersPage.faq?.enabled && (
        <TransfersFAQSection
          data={transfersPage.faq}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
