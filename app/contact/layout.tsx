import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Sea Smoke Fishing Club';
  const pageTitle = config.contactPage?.metaTitle || 'Contact & Reservations';
  const description =
    config.contactPage?.metaDescription ||
    config.branding.metaDescription ||
    'Get in touch with our booking desk to plan your custom fishing trip, big game charter, or private boat excursion.';

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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
