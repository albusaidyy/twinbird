import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Twinbird Travel Agency';
  const pageTitle = config.excursionsPage?.metaTitle || 'Excursions & Coastal Day Trips';
  const description =
    config.excursionsPage?.metaDescription ||
    config.branding.metaDescription ||
    'Discover unforgettable day tours, marine park snorkeling, cultural excursions, and coastal adventures across Kenya.';

  return {
    title: `${pageTitle} | ${appName}`,
    description,
    openGraph: {
      title: `${pageTitle} | ${appName}`,
      description,
      type: 'website',
    },
  };
}

export default function ExcursionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
