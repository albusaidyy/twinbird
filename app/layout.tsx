import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getAppConfig } from '@/lib/config/getAppConfig';
import { AppConfigProvider } from '@/components/providers/AppConfigProvider';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const favicon = config.branding.faviconUrl || '/brand/favicons/favicon.ico';

  return {
    title: config.branding.appName || 'Safari Tours Kenya',
    description:
      config.branding.metaDescription ||
      'Premier African wildlife safaris, Big Five game drives, and luxury bush expeditions in Kenya.',
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon === '/brand/favicons/favicon.ico' ? '/brand/favicons/apple-touch-icon.png' : favicon,
      other: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          url: '/icons/pwa/icon-192.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '512x512',
          url: '/icons/pwa/icon-512.png',
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getAppConfig();

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        {/* AppConfigProvider wraps everything so ALL routes can use useAppConfig() */}
        <AppConfigProvider config={config}>{children}</AppConfigProvider>
      </body>
    </html>
  );
}
