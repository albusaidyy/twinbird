'use client';

import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { ContactSection } from './_components/ContactSection';
import { FAQSection } from './_components/FAQSection';
import { defaultConfig } from '@/config/default-config';

export default function ContactPage() {
  const { config } = useAppConfig();
  const { primaryColor, appName, logoUrl } = config.branding;
  
  const contactPage = config.contactPage || defaultConfig.contactPage;
  const charterItems = config.toursPage?.tours?.items || config.homepage.tours.items;
  const tourNames = charterItems.filter(t => t.enabled).map(t => t.title);
  const subjects = ['General Inquiry', ...tourNames, 'Feedback'];

  return (
    <main className="min-h-screen">
      <Navbar 
        primaryColor={primaryColor}
        appName={appName}
        logoUrl={logoUrl}
        nav={config.navigation}
      />
      
      {/* Page Hero */}
      <Hero hero={contactPage.hero} primaryColor={primaryColor} />

      {/* Main Content */}
      <ContactSection 
        data={contactPage.contact} 
        formConfig={contactPage.form}
        primaryColor={primaryColor} 
        subjects={subjects}
      />
      <FAQSection data={contactPage.faq} primaryColor={primaryColor} />

      <Footer />
    </main>
  );
}
