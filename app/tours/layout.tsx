import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Sea Smoke Fishing Club';
  const pageTitle = config.toursPage?.metaTitle || 'Fishing Charters & Packages';
  const description =
    config.toursPage?.metaDescription ||
    config.branding.metaDescription ||
    'Explore our fleet of sportfishing charter packages, from inshore light tackle to full-day offshore marlin safaris in Watamu, Kenya.';

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

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
