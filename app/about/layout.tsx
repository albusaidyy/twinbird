import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Sea Smoke Fishing Club';
  const pageTitle = config.aboutPage?.metaTitle || 'About Our Heritage & Crew';
  const description =
    config.aboutPage?.metaDescription ||
    config.branding.metaDescription ||
    'Discover our story, decades of sportfishing heritage, tournament-rigged boats, and marine conservation commitment in Kenya.';

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

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
