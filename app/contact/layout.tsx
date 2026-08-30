import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Safari Tours Kenya';
  const pageTitle = config.contactPage?.metaTitle || 'Contact & Safari Reservations';
  const description =
    config.contactPage?.metaDescription ||
    config.branding.metaDescription ||
    'Get in touch with our safari desk to plan your custom wildlife safari, Big Five game drive, or luxury lodge vacation.';

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
