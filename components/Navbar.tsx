'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [scrolled, setScrolled] = useState(false);
  const visible = nav.filter((n) => n.enabled).slice(0, 5);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm border-border py-3' 
          : 'bg-transparent border-transparent py-4'
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        {logoUrl ? (
          <Image src={logoUrl} alt={appName} width={160} height={48} className="h-12 w-auto object-contain drop-shadow" style={{ width: 'auto' }} />
        ) : (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-white font-bold text-sm shadow-md transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            {appName.charAt(0)}
          </div>
        )}
        <span className={`font-semibold text-sm tracking-wide transition-colors ${scrolled ? 'text-foreground' : 'text-white drop-shadow'}`}>
          {appName}
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-7">
        {visible.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              scrolled 
                ? 'text-muted-foreground hover:text-foreground' 
                : 'text-white/90 hover:text-white drop-shadow'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
