'use client';

import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { TourListSection } from './_components/TourListSection';
import { defaultConfig } from '@/config/default-config';

export default function ToursPage() {
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;

  const toursPage = config.toursPage || defaultConfig.toursPage!;

  return (
    <main className="min-h-screen">
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      {/* Page Hero */}
      <Hero hero={toursPage.hero} primaryColor={primaryColor} />

      {/* Tours Listing Cards Section */}
      <TourListSection
        data={toursPage.tours}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />

      <Footer />
    </main>
  );
}
