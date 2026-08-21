'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { getIcon } from '@/lib/icons';
import { isColorDark } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { ArrowRight, Star } from 'lucide-react';
import type {
  StatItem,
  TourItem,
  ReviewItem,
  WhyUsItem,
  GalleryItem,
  CTABannerSection,
} from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import { getTourSlug } from '@/lib/tour-utils';

// Extracted to components/

// ─── Stats ────────────────────────────────────────────────────────────────────
function StatsBar({ data, primaryColor }: { data: { enabled: boolean; backgroundColor?: string; items: StatItem[] }; primaryColor: string }) {
  if (!data.enabled) return null;
  const visibleStats = data.items.filter(s => s.enabled);
  if (visibleStats.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);

  return (
    <section 
      className={`border-b border-border ${isDark ? 'dark text-white' : 'text-foreground'}`}
      style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
    >
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {visibleStats.map((s) => (
          <div key={s.label} className="flex flex-col items-center py-10 px-6 text-center">
            <span
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: primaryColor }}
            >
              {s.value}
            </span>
            <span className="mt-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Featured Tours ───────────────────────────────────────────────────────────
function FeaturedTours({ data, primaryColor, accentColor }: { data: { enabled: boolean; backgroundColor?: string; items: TourItem[]; title?: string; subtitle?: string; eyebrow?: string }; primaryColor: string; accentColor: string }) {
  if (!data.enabled) return null;
  const visibleTours = data.items.filter(t => t.enabled);
  if (visibleTours.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);

  const title = data.title ?? defaultConfig.homepage.tours.title;
  const subtitle = data.subtitle ?? defaultConfig.homepage.tours.subtitle;
  const eyebrow = data.eyebrow ?? defaultConfig.homepage.tours.eyebrow;

  return (
    <section 
      className={`py-24 px-6 ${isDark ? 'dark text-white' : 'text-foreground'}`}
      style={{ backgroundColor: data.backgroundColor || '#fafafa' }}
    >
      <div className="mx-auto max-w-6xl">
        {((title && title.trim() !== '') || (eyebrow && eyebrow.trim() !== '') || (subtitle && subtitle.trim() !== '')) && (
          <div className="mb-12 flex flex-col items-center text-center">
            {eyebrow && eyebrow.trim() !== '' && (
              <span
                className="mb-3 text-xs font-semibold uppercase tracking-widest"
                style={{ color: primaryColor }}
              >
                {eyebrow}
              </span>
            )}
            {title && title.trim() !== '' && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {title}
              </h2>
            )}
            {subtitle && subtitle.trim() !== '' && (
              <p className="mt-3 max-w-lg text-muted-foreground text-sm leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTours.map((tour) => {
            const slug = getTourSlug(tour);
            const targetHref = `/tours/${slug}`;

            return (
              <article
                key={tour.title}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={targetHref} className="block relative h-52 overflow-hidden">
                  <Image
                    src={tour.imageUrl}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={true}
                  />
                  <span
                    className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tour.badge}
                  </span>
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3.5 w-3.5" style={{ fill: accentColor, color: accentColor }} />
                    <span className="text-xs font-semibold text-foreground">{tour.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">· {tour.duration}</span>
                  </div>
                  <Link href={targetHref} className="block">
                    <h3 className="font-bold text-foreground text-base hover:text-primary transition-colors">
                      {tour.title}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {tour.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={targetHref}
                      className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                      style={{ color: primaryColor }}
                    >
                      View Details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────
function WhyUs({ data, primaryColor, accentColor, fallbackImageUrl }: { data: { enabled: boolean; backgroundColor?: string; imageUrl?: string; items: WhyUsItem[]; title?: string; subtitle?: string; eyebrow?: string }; primaryColor: string; accentColor: string; fallbackImageUrl: string }) {
  if (!data.enabled) return null;
  const visibleItems = data.items.filter(i => i.enabled);
  if (visibleItems.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);

  const title = data.title ?? defaultConfig.homepage.whyUs.title;
  const subtitle = data.subtitle ?? defaultConfig.homepage.whyUs.subtitle;
  const eyebrow = data.eyebrow ?? defaultConfig.homepage.whyUs.eyebrow;

  return (
    <section 
      className={`py-24 px-6 ${isDark ? 'dark text-white' : 'text-foreground'}`}
      style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left: Image with Badge */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={data.imageUrl || fallbackImageUrl}
              alt="Why choose us"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div 
            className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="text-4xl font-bold tracking-tight">100%</span>
            <span className="text-xs font-semibold uppercase tracking-widest mt-1">
              Locally Owned<br/>& Operated
            </span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          {eyebrow && eyebrow.trim() !== '' && (
            <span 
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              {eyebrow}
            </span>
          )}
          {title && title.trim() !== '' && (
            <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-10">
              {title}
            </h2>
          )}
          {subtitle && subtitle.trim() !== '' && (
            <p className="mt-3 mb-10 text-muted-foreground text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
          
          <div className="space-y-8">
            {visibleItems.map(({ icon, title, body }) => {
              const Icon = getIcon(icon);
              return (
                <div key={title} className="flex gap-5">
                  <div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform hover:scale-105"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-foreground text-lg mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
function Reviews({ data, primaryColor, accentColor }: { data: { enabled: boolean; backgroundColor?: string; items: ReviewItem[]; title?: string; subtitle?: string; eyebrow?: string }; primaryColor: string; accentColor: string }) {
  if (!data.enabled) return null;
  const visibleReviews = data.items.filter(r => r.enabled);
  if (visibleReviews.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);

  const title = data.title ?? defaultConfig.homepage.reviews.title;
  const subtitle = data.subtitle ?? defaultConfig.homepage.reviews.subtitle;
  const eyebrow = data.eyebrow ?? defaultConfig.homepage.reviews.eyebrow;

  return (
    <section 
      className={`py-24 px-6 ${isDark ? 'dark text-white' : 'text-foreground'}`}
      style={{ backgroundColor: data.backgroundColor || '#020617' }}
    >
      <div className="mx-auto max-w-5xl">
        {((title && title.trim() !== '') || (eyebrow && eyebrow.trim() !== '') || (subtitle && subtitle.trim() !== '')) && (
          <div className="mb-10 flex flex-col items-center text-center">
            {title && title.trim() !== '' && (
              <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
            )}
            {subtitle && subtitle.trim() !== '' && (
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed">{subtitle}</p>
            )}
            {eyebrow && eyebrow.trim() !== '' && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {eyebrow}
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: accentColor }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleReviews.map((r) => (
            <div
              key={r.name}
              className="flex flex-col gap-4 rounded-2xl bg-zinc-800 p-7 transition-shadow hover:shadow-xl hover:shadow-black/30"
            >
              <span
                className="text-5xl font-serif leading-none select-none"
                style={{ color: primaryColor }}
              >
                &ldquo;
              </span>
              <p className="flex-1 text-sm text-zinc-300 leading-relaxed">{r.quote}</p>
              <div className="mt-2 border-t border-zinc-700 pt-4">
                <span className="text-sm font-bold text-white">{r.name}</span>
                <span className="text-sm text-zinc-500"> · {r.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Catch Gallery ────────────────────────────────────────────────────────────
function Gallery({ data, primaryColor }: { data: { enabled: boolean; backgroundColor?: string; indicatorColor?: string; items: GalleryItem[]; title?: string; subtitle?: string; eyebrow?: string }; primaryColor: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollWidth <= clientWidth) return;
        
        const firstChild = scrollRef.current.children[0] as HTMLElement;
        const scrollAmount = firstChild ? firstChild.clientWidth + 24 : 336; // 24px is gap-6
        
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isDragging]);

  if (!data.enabled) return null;
  const visibleItems = data.items.filter(i => i.enabled);
  if (visibleItems.length === 0) return null;
  
  // Duplicate items a few times to create a longer carousel that can scroll on large screens
  const displayItems = [...visibleItems, ...visibleItems, ...visibleItems];

  const isDark = isColorDark(data.backgroundColor);

  const title = data.title ?? defaultConfig.homepage.gallery.title;
  const subtitle = data.subtitle ?? defaultConfig.homepage.gallery.subtitle;
  const eyebrow = data.eyebrow ?? defaultConfig.homepage.gallery.eyebrow;

  return (
    <section 
      className={`py-24 ${isDark ? 'dark text-white' : 'text-foreground'}`}
      style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
    >
      {((title && title.trim() !== '') || (eyebrow && eyebrow.trim() !== '') || (subtitle && subtitle.trim() !== '')) && (
        <div className="mx-auto max-w-4xl px-6 mb-12 flex flex-col items-center text-center">
          {eyebrow && eyebrow.trim() !== '' && (
            <span className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: primaryColor }}>
              {eyebrow}
            </span>
          )}
          {title && title.trim() !== '' && (
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          )}
          {subtitle && subtitle.trim() !== '' && (
            <p className="mt-3 max-w-lg text-muted-foreground text-sm leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl px-6 overflow-hidden">
        <div 
          ref={scrollRef} 
          onScroll={() => {
            if (scrollRef.current) {
              const firstChild = scrollRef.current.children[0] as HTMLElement;
              const itemWidth = firstChild ? firstChild.clientWidth + 24 : 336;
              const realIndex = Math.round(scrollRef.current.scrollLeft / itemWidth);
              setActiveIndex(realIndex % visibleItems.length);
            }
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
            setScrollLeftPos(scrollRef.current?.scrollLeft || 0);
          }}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (!isDragging || !scrollRef.current) return;
            e.preventDefault();
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 1.5; // Drag speed multiplier
            scrollRef.current.scrollLeft = scrollLeftPos - walk;
          }}
          className={`w-full flex gap-6 overflow-x-auto pb-8 ${isDragging ? '' : 'snap-x snap-mandatory'} hide-scrollbar select-none`} 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {displayItems.map((item, i) => {
            return (
              <div key={i} className="relative shrink-0 w-[80vw] md:w-[calc(50%-0.75rem)] lg:w-[calc(100%/3-1rem)] aspect-[3/4] max-h-[450px] snap-center rounded-2xl overflow-hidden group select-none">
                <Image src={item.imageUrl} alt={item.caption} fill sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw" className="object-cover pointer-events-none" draggable={false} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        {visibleItems.map((_, idx) => (
           <button 
             key={idx} 
             onClick={() => {
               if (scrollRef.current) {
                 const firstChild = scrollRef.current.children[0] as HTMLElement;
                 const itemWidth = firstChild ? firstChild.clientWidth + 24 : 336;
                 // Scroll to the instance in the middle set to avoid hitting bounds
                 const targetScrollLeft = (visibleItems.length + idx) * itemWidth;
                 scrollRef.current.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
               }
             }}
             className="h-2 w-2 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none" 
             style={{ 
               backgroundColor: data.indicatorColor || '#000000', 
               opacity: activeIndex === idx ? 1 : 0.3,
               transform: activeIndex === idx ? 'scale(1.2)' : 'scale(1)'
             }} 
             aria-label={`Go to slide ${idx + 1}`}
           />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner({
  cta,
  primaryColor,
}: {
  cta: CTABannerSection;
  primaryColor: string;
}) {
  if (!cta.enabled) return null;
  const isDark = isColorDark(cta.backgroundColor || primaryColor);

  return (
    <section
      className={`relative overflow-hidden py-24 px-6 text-center ${isDark ? 'dark text-white' : 'text-slate-900'}`}
      style={{ backgroundColor: cta.backgroundColor || primaryColor }}
    >
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          {cta.headline}
        </h2>
        <p className="mt-4 text-white/80 text-base leading-relaxed">{cta.subtitle}</p>
        <Link
          href={cta.ctaHref}
          id="banner-cta-btn"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold transition-all hover:scale-105 hover:shadow-xl"
          style={{ color: primaryColor }}
        >
          {cta.ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}



// Extracted Footer

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { config } = useAppConfig();
  const { primaryColor, accentColor, appName, logoUrl } = config.branding;
  const hp = config.homepage;

  const defaultOrder = ['stats', 'tours', 'whyus', 'reviews', 'gallery', 'cta'];
  const order = [...(hp.sectionOrder || defaultOrder)];
  if (!order.includes('gallery')) {
    const reviewsIdx = order.indexOf('reviews');
    if (reviewsIdx !== -1) order.splice(reviewsIdx + 1, 0, 'gallery');
    else order.push('gallery');
  }

  const renderSection = (key: string) => {
    switch (key) {
      case 'stats':   return <StatsBar key={key} data={hp.stats} primaryColor={primaryColor} />;
      case 'tours':   return <FeaturedTours key={key} data={hp.tours} primaryColor={primaryColor} accentColor={accentColor} />;
      case 'whyus':   return <WhyUs key={key} data={hp.whyUs} primaryColor={primaryColor} accentColor={accentColor} fallbackImageUrl={hp.hero.imageUrl} />;
      case 'reviews': return <Reviews key={key} data={hp.reviews} primaryColor={primaryColor} accentColor={accentColor} />;
      case 'gallery': return <Gallery key={key} data={hp.gallery || defaultConfig.homepage.gallery} primaryColor={primaryColor} />;
      case 'cta':     return <CTABanner key={key} cta={hp.ctaBanner} primaryColor={primaryColor} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar primaryColor={primaryColor} appName={appName} logoUrl={logoUrl} nav={config.navigation} />
      <Hero hero={hp.hero} primaryColor={primaryColor} />
      {order.map(renderSection)}
      <Footer />
    </div>
  );
}
