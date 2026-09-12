import type { Metadata } from 'next';
import { getAppConfig } from '@/lib/config/getAppConfig';
import { findTourBySlug } from '@/lib/tour-utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getAppConfig();
  const appName = config.branding.appName || 'Twinbird Travel Agency';
  const tours = config.toursPage?.tours?.items || [];
  const tour = findTourBySlug(tours, slug);

  if (!tour) {
    return {
      title: `Safari Expedition | ${appName}`,
      description: config.branding.metaDescription,
    };
  }

  const title = tour.metaTitle || `${tour.title} | ${appName}`;
  const description =
    tour.metaDescription ||
    tour.description ||
    tour.overview ||
    config.branding.metaDescription ||
    'Premier African wildlife safari and Big Five game drive in Kenya.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: tour.imageUrl ? [{ url: tour.imageUrl }] : undefined,
      type: 'article',
    },
  };
}

export default function SingleTourLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
