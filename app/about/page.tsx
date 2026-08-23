'use client';

import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { AboutStorySection } from './_components/AboutStorySection';
import { AboutValuesSection } from './_components/AboutValuesSection';
import { AboutTeamSection } from './_components/AboutTeamSection';
import { AboutImpactSection } from './_components/AboutImpactSection';
import { AboutCTASection } from './_components/AboutCTASection';
import { defaultConfig } from '@/config/default-config';

export default function AboutPage() {
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;

  const aboutPage = config.aboutPage || defaultConfig.aboutPage!;

  return (
    <main className="min-h-screen">
      {/* Global Header Navigation */}
      <Navbar
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />

      {/* 1. Hero Section */}
      <Hero hero={aboutPage.hero} primaryColor={primaryColor} />

      {/* 2. Our Voyage / Story Section */}
      <AboutStorySection data={aboutPage.story} primaryColor={primaryColor} />

      {/* 3. Core Values Section */}
      <AboutValuesSection
        data={aboutPage.values}
        primaryColor={primaryColor}
      />

      {/* 4. Crew / Storytellers Section */}
      <AboutTeamSection data={aboutPage.team} primaryColor={primaryColor} />

      {/* 5. Impact & Global Partners Section */}
      <AboutImpactSection
        data={aboutPage.impact}
        accentColor={accentColor}
      />

      {/* 6. Call to Action Banner Section */}
      <AboutCTASection data={aboutPage.cta} primaryColor={primaryColor} />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
