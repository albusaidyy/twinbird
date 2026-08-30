import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Safari Tours Kenya';
  const pageTitle = config.aboutPage?.metaTitle || 'About Our Wilderness Heritage & Guides';
  const description =
    config.aboutPage?.metaDescription ||
    config.branding.metaDescription ||
    'Discover our story, decades of African wildlife guiding, certified naturalists, and commitment to savannah conservation in Kenya.';

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
