'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const visible = nav.filter((n) => n.enabled).slice(0, 6);

  // Close mobile menu when pathname changes (without useEffect to avoid cascading renders)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  return (
    <nav 
      className="sticky inset-x-0 top-0 z-50 transition-all duration-300 border-b bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm border-border"
    >
      <div className="flex items-center justify-between px-6 lg:px-12 py-3">
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

        {/* Desktop Navigation */}
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

        {/* Actions & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex rounded-full px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Book a Trip
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-foreground hover:bg-muted focus:outline-none transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white dark:bg-zinc-950 px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {visible.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-muted font-semibold text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border sm:hidden">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Book a Trip
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

