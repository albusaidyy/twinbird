import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';
import { findExcursionBySlug } from '@/lib/excursion-utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Twinbird Travel Agency';
  const excursions = config.excursionsPage?.tours?.items || [];
  const excursion = findExcursionBySlug(excursions, slug);

  if (!excursion) {
    return {
      title: `Excursion & Day Trip | ${appName}`,
      description: config.branding.metaDescription,
    };
  }

  const title = excursion.metaTitle || `${excursion.title} | ${appName}`;
  const description =
    excursion.metaDescription ||
    excursion.description ||
    excursion.overview ||
    config.branding.metaDescription ||
    'Unforgettable coastal excursion, marine adventure, and day tour in Kenya.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: excursion.imageUrl ? [{ url: excursion.imageUrl }] : undefined,
      type: 'article',
    },
  };
}

export default function SingleExcursionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
