'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { TourItem } from '@/types/app-config';
import { Clock, Star, Maximize2 } from 'lucide-react';
import { ImageLightbox } from '@/components/ui/image-lightbox';

export function TourGalleryHeader({
  tour,
  gallery,
  primaryColor,
  accentColor = '#f6ab03',
  heroBackgroundColor,
}: {
  tour: TourItem;
  gallery?: string[];
  primaryColor: string;
  accentColor?: string;
  heroBackgroundColor?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const hasMovedRef = useRef(false);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const rawImages =
    gallery && gallery.length > 0
      ? gallery
      : tour.gallery && tour.gallery.length > 0
      ? tour.gallery
      : [
          tour.imageUrl || '/images/hero/hero.jpg',
          tour.imageUrl || '/images/hero/hero.jpg',
          tour.imageUrl || '/images/hero/hero.jpg',
        ];

  // Clean empty strings
  const images = rawImages.filter(Boolean);
  const validImages = images.length > 0 ? images : ['/images/hero/hero.jpg'];

  let displayItems = [...validImages];
  if (validImages.length > 1) {
    while (displayItems.length < 12) {
      displayItems = [...displayItems, ...validImages];
    }
  }

  // Exact auto-scroll interval matching Catch Gallery (3000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollWidth <= clientWidth) return;

        const firstChild = scrollRef.current.children[0] as HTMLElement;
        const scrollAmount = firstChild ? firstChild.clientWidth + 20 : 320; // 20px gap

        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isDragging]);

  const bgColor = tour.heroBackgroundColor || heroBackgroundColor || primaryColor || '#193da9';
  const indicatorDotColor = tour.indicatorColor || accentColor || '#f6ab03';
  const hasImage = Boolean(tour.heroImageUrl && tour.heroImageUrl.trim() !== '');

  return (
    <section
      className="relative pt-2 md:pt-4 pb-6 w-full text-white"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Hero Image with gradient overlay matching standard Hero */}
      {hasImage && (
        <>
          <Image
            src={tour.heroImageUrl!}
            alt={tour.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%] pointer-events-none z-0"
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 pointer-events-none" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Hero Header Block with standard Hero typography and compact spacing */}
        <div className="flex flex-col items-center text-center mb-6 max-w-3xl mx-auto space-y-2.5">
          {/* Eyebrow / Badge & Duration Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tour.showBadge !== false && tour.badge && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white ring-1 ring-white/30 backdrop-blur-sm"
                style={{ backgroundColor: `${primaryColor}66` }}
              >
                {tour.badge}
              </span>
            )}
            {tour.showDuration !== false && tour.duration && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/20">
                <Clock className="h-3 w-3 text-white/80" />
                <span>{tour.duration}</span>
              </span>
            )}
            {tour.showRating !== false && tour.rating > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/20">
                <Star className="h-3 w-3 fill-current text-amber-300" />
                <span>{tour.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Headline */}
          {tour.showTitle !== false && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              {tour.title}
            </h1>
          )}

          {/* Subtitle */}
          {tour.description && (
            <p className="max-w-2xl text-xs sm:text-sm md:text-base text-white/85 leading-relaxed drop-shadow-xs">
              {tour.description}
            </p>
          )}
        </div>

        {/* Hero Image Carousel Container — overflow-hidden here, NOT on section */}
        <div className="relative w-full" style={{ overflow: 'hidden' }}>
          <div
            ref={scrollRef}
            onScroll={() => {
              if (scrollRef.current) {
                const firstChild = scrollRef.current.children[0] as HTMLElement;
                const itemWidth = firstChild ? firstChild.clientWidth + 20 : 320;
                const realIndex = Math.round(scrollRef.current.scrollLeft / itemWidth);
                setActiveIndex(realIndex % validImages.length);
              }
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              hasMovedRef.current = false;
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
              if (Math.abs(walk) > 6) {
                hasMovedRef.current = true;
              }
              scrollRef.current.scrollLeft = scrollLeftPos - walk;
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              hasMovedRef.current = false;
              setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
              setScrollLeftPos(scrollRef.current?.scrollLeft || 0);
            }}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={(e) => {
              if (!isDragging || !scrollRef.current) return;
              const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
              const walk = (x - startX) * 1.5;
              if (Math.abs(walk) > 6) {
                hasMovedRef.current = true;
              }
              scrollRef.current.scrollLeft = scrollLeftPos - walk;
            }}
            className={`w-full flex gap-5 overflow-x-auto pb-2 ${
              isDragging || validImages.length <= 1 ? '' : 'snap-x snap-mandatory'
            } hide-scrollbar select-none ${validImages.length <= 2 ? 'justify-center' : ''}`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: isDragging ? 'auto' : 'smooth',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {displayItems.map((imgUrl, i) => {
              const photoIndex = i % validImages.length;
              const photoNum = photoIndex + 1;
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (!hasMovedRef.current) {
                      setLightboxIndex(photoIndex);
                      setLightboxOpen(true);
                    }
                  }}
                  className="relative shrink-0 w-[78vw] sm:w-[calc(50%-0.65rem)] lg:w-[calc(100%/3-0.85rem)] aspect-[4/3] md:aspect-[3/4] max-h-[340px] snap-center rounded-2xl overflow-hidden group select-none cursor-pointer"
                  title="Click to view full photo"
                >
                  <Image
                    src={imgUrl}
                    alt={`${tour.title} photo ${photoNum}`}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-75" />

                  {/* Subtle expand icon badge on hover */}
                  <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators always inside z-10 wrapper, shown when ≥1 image */}
        <div className="flex justify-center items-center gap-2 mt-4 relative z-20">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (scrollRef.current) {
                  const firstChild = scrollRef.current.children[0] as HTMLElement;
                  const itemWidth = firstChild ? firstChild.clientWidth + 20 : 320;
                  const targetScrollLeft = (validImages.length > 1 ? validImages.length + idx : idx) * itemWidth;
                  scrollRef.current.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                }
              }}
              className="h-2 w-2 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer"
              style={{
                backgroundColor: indicatorDotColor || '#ffffff',
                opacity: activeIndex === idx ? 1 : 0.3,
                transform: activeIndex === idx ? 'scale(1.2)' : 'scale(1)',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal with Zoom / Pan controls */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={validImages}
        initialIndex={lightboxIndex}
        title={tour.title}
        primaryColor={primaryColor}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
}
