import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { HeroSection } from '@/types/app-config';

export function Hero({ hero, primaryColor }: { hero: HeroSection; primaryColor: string }) {
  if (!hero.enabled) return null;
  const sizeClass = 
    hero.size === 'small' ? 'h-[50vh] min-h-[400px]' : 
    hero.size === 'medium' ? 'h-[70vh] min-h-[500px]' : 
    hero.size === 'large' ? 'h-[85vh] min-h-[600px]' : 
    'h-screen min-h-[600px]'; // fullscreen default

  return (
    <section 
      className={`relative ${sizeClass} flex flex-col items-center justify-center overflow-hidden`}
      style={{ backgroundColor: hero.backgroundColor || '#000000' }}
    >
      <Image
        src={hero.imageUrl}
        alt="Hero background"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={true}
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        {hero.showEyebrow && (  
          <span
            className="mb-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white ring-1 ring-white/30 backdrop-blur-sm"
            style={{ backgroundColor: `${primaryColor}55` }}
          >
            {hero.eyebrow}
          </span>
        )}

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-xl">
          {hero.headline}{' '}
          <span className="italic font-light" style={{ color: '#F9C84B' }}>
            {hero.italicText}
          </span>
        </h1>

        {hero.showSubtitle && (
          <p className="mt-6 max-w-2xl text-base md:text-lg text-white/80 leading-relaxed">
            {hero.subtitle}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {hero.showPrimaryCta && (
            <Link
              href={hero.primaryCtaHref}
              id="hero-primary-cta"
              className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: primaryColor }}
            >
              {hero.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {hero.showSecondaryCta && (
            <Link
              href={hero.secondaryCtaHref}
              id="hero-secondary-cta"
              className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white ring-2 ring-white/40 backdrop-blur-sm transition-all hover:bg-white/10 hover:ring-white/70"
            >
              {hero.secondaryCtaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
