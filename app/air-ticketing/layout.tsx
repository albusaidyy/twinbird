import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Twinbird Travel Agency';
  const pageTitle = config.airTicketingPage?.hero?.headline || 'Flight Bookings & Air Ticketing';
  const description =
    config.airTicketingPage?.hero?.subtitle ||
    config.branding.metaDescription ||
    'Book domestic and international flights, group corporate travel, and safari air charter tickets with Twinbird Travel Agency.';
  const ogImage = config.branding.ogImageUrl || '/brand/icon.png';

  return {
    title: `${pageTitle} | ${appName}`,
    description,
    openGraph: {
      title: `${pageTitle} | ${appName}`,
      description,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${pageTitle} | ${appName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageTitle} | ${appName}`,
      description,
      images: [ogImage],
    },
  };
}

export default function AirTicketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
