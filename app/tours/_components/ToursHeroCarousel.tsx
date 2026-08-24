'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroSection, TourItem } from '@/types/app-config';
import { getTourSlug } from '@/lib/tour-utils';
import { isColorDark } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function ToursHeroCarousel({
  hero,
  tours = [],
  primaryColor,
  accentColor = '#f6ab03',
}: {
  hero: HeroSection;
  tours?: TourItem[];
  primaryColor: string;
  accentColor?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const firstChild = scrollRef.current.children[0] as HTMLElement;
        const scrollAmount = firstChild ? firstChild.clientWidth + 24 : 340;

        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3800);
    return () => clearInterval(interval);
  }, [isDragging]);

  if (!hero || hero.enabled === false) return null;

  const validTours = (tours || []).filter((t) => t.enabled !== false && !t.deleted);
  const carouselItems = validTours.length > 0
    ? validTours
    : [
        {
          title: 'Big Game Marlin & Sailfish Safari',
          badge: 'Most Popular',
          imageUrl: hero.imageUrl || '/images/hero/hero.jpg',
          duration: '8h',
          rating: 5,
        } as TourItem,
      ];

  // Duplicate if few items to allow infinite smooth scroll
  const displayItems = carouselItems.length < 4
    ? [...carouselItems, ...carouselItems, ...carouselItems]
    : carouselItems;

  const isDark = isColorDark(hero.backgroundColor || '#000000');

  return (
    <section
      className={`pt-32 pb-16 px-6 relative overflow-hidden ${
        isDark ? 'dark text-white' : 'text-slate-900'
      }`}
      style={{ backgroundColor: hero.backgroundColor || '#000000' }}
    >
      {/* Background ambient lighting or overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Hero Title & Subtitle Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
          {hero.showEyebrow && hero.eyebrow && hero.eyebrow.trim() !== '' && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white ring-1 ring-white/30 backdrop-blur-sm shadow-sm"
              style={{ backgroundColor: `${primaryColor}66` }}
            >
              {hero.eyebrow}
            </span>
          )}

          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            {hero.headline}{' '}
            {hero.italicText && (
              <span className="italic font-light" style={{ color: accentColor }}>
                {hero.italicText}
              </span>
            )}
          </h1>

          {hero.showSubtitle && hero.subtitle && hero.subtitle.trim() !== '' && (
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
          )}
        </div>

        {/* Hero Image Carousel */}
        <div className="relative mx-auto w-full overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={() => {
              if (scrollRef.current) {
                const firstChild = scrollRef.current.children[0] as HTMLElement;
                const itemWidth = firstChild ? firstChild.clientWidth + 24 : 340;
                const realIndex = Math.round(scrollRef.current.scrollLeft / itemWidth);
                setActiveIndex(realIndex % carouselItems.length);
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
              const walk = (x - startX) * 1.5;
              scrollRef.current.scrollLeft = scrollLeftPos - walk;
            }}
            className={`w-full flex gap-6 overflow-x-auto pb-4 ${
              isDragging ? '' : 'snap-x snap-mandatory'
            } hide-scrollbar select-none`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {displayItems.map((tour, i) => {
              const slug = getTourSlug(tour);
              const targetHref = `/tours/${slug}`;

              return (
                <Link
                  key={i}
                  href={targetHref}
                  className="relative shrink-0 w-[78vw] md:w-[calc(50%-0.75rem)] lg:w-[calc(100%/3-1rem)] aspect-[3/4] max-h-[460px] snap-center rounded-3xl overflow-hidden group select-none shadow-xl border border-white/10 block"
                >
                  <Image
                    src={tour.imageUrl || hero.imageUrl || '/images/hero/hero.jpg'}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top Badge */}
                  {tour.badge && (
                    <span
                      className="absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {tour.badge}
                    </span>
                  )}

                  {/* Bottom Text Overlay on Card */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 space-y-1.5 text-white">
                    <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {tour.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>{tour.duration || 'Guided Tour'}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-white group-hover:translate-x-1 transition-transform">
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Carousel Dot Indicators */}
        {carouselItems.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (scrollRef.current) {
                    const firstChild = scrollRef.current.children[0] as HTMLElement;
                    const itemWidth = firstChild ? firstChild.clientWidth + 24 : 340;
                    const targetScrollLeft = idx * itemWidth;
                    scrollRef.current.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                  }
                }}
                className="h-2.5 w-2.5 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none"
                style={{
                  backgroundColor: activeIndex === idx ? primaryColor : '#ffffff',
                  opacity: activeIndex === idx ? 1 : 0.35,
                  transform: activeIndex === idx ? 'scale(1.3)' : 'scale(1)',
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
}
