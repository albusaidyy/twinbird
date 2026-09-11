'use client';

import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { ExcursionListSection } from './_components/ExcursionListSection';
import { defaultConfig } from '@/config/default-config';

export default function ExcursionsPage() {
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;

  const excursionsPage = config.excursionsPage || defaultConfig.excursionsPage!;

  return (
    <main className="min-h-screen">
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      {/* Page Hero */}
      <Hero hero={excursionsPage.hero} primaryColor={primaryColor} />

      {/* Excursions Listing Cards Section */}
      <ExcursionListSection
        data={excursionsPage.tours}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />

      <Footer />
    </main>
  );
}
