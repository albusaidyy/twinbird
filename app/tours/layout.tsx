import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Safari Tours Kenya';
  const pageTitle = config.toursPage?.metaTitle || 'Safari Packages & Wildlife Game Drives';
  const description =
    config.toursPage?.metaDescription ||
    config.branding.metaDescription ||
    'Explore our luxury African wildlife safaris, Big Five game drives, and national park expeditions in Maasai Mara, Amboseli, and Tsavo.';

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
