'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Navbar({
  primaryColor,
  appName,
  logoUrl,
  nav,
}: {
  primaryColor: string;
  appName: string;
  logoUrl: string | null;
  nav: { key: string; label: string; href: string; enabled: boolean }[];
}) {
  const pathname = usePathname();
  const visible = nav.filter((n) => n.enabled).slice(0, 6);

  return (
    <nav 
      className="sticky inset-x-0 top-0 z-50 flex items-center justify-between px-6 lg:px-12 transition-all duration-300 border-b bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm border-border py-3"
    >
      <Link href="/" className="flex items-center gap-2.5">
        {logoUrl && logoUrl.trim() !== '' ? (
          <Image src={logoUrl} alt={appName} width={160} height={48} className="h-11 w-auto object-contain drop-shadow" style={{ width: 'auto' }} />
        ) : (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-white font-bold text-sm shadow-md transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            {appName.charAt(0)}
          </div>
        )}
        <span className="font-semibold text-sm tracking-wide transition-colors text-foreground">
          {appName}
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {visible.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative py-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-foreground font-semibold' 
                  : 'text-muted-foreground hover:text-foreground' 
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/contact"
          className="rounded-full px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          Book a Trip
        </Link>
      </div>
    </nav>
  );
}

