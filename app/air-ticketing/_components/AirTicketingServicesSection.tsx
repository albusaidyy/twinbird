"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plane, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AirlinePartnerItem } from "@/types/app-config";
import { defaultConfig } from "@/config/default-config";

interface AirTicketingServicesSectionProps {
  title?: string;
  subtitle?: string;
  airlinesTitle?: string;
  airlinesSubtitle?: string;
  airlines?: AirlinePartnerItem[];
  primaryColor?: string;
  accentColor?: string;
}

export function AirTicketingServicesSection({
  airlinesTitle,
  airlinesSubtitle,
  airlines,
  primaryColor = "#1b4332",
}: AirTicketingServicesSectionProps) {
  const defaultAirlines =
    defaultConfig.airTicketingPage?.servicesSection?.airlines || [];
  const rawAirlines =
    airlines && airlines.length > 0 ? airlines : defaultAirlines;
  const visibleAirlines = rawAirlines.filter((a) => a.enabled !== false);

  const displayAirlinesTitle =
    airlinesTitle ||
    defaultConfig.airTicketingPage?.servicesSection?.airlinesTitle ||
    "Partner Airlines & Flight Operators";
  const displayAirlinesSubtitle =
    airlinesSubtitle ||
    defaultConfig.airTicketingPage?.servicesSection?.airlinesSubtitle ||
    "We coordinate seamlessly with Kenya's premier safari bush carriers, regional scheduled airlines, and global flag carriers";

  // Carousel state & drag logic
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance logo carousel
  useEffect(() => {
    if (visibleAirlines.length <= 1 || isPaused || isDragging) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const firstChild = scrollRef.current.children[0] as HTMLElement;
        const scrollAmount = firstChild ? firstChild.clientWidth + 20 : 260;

        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 3600);

    return () => clearInterval(interval);
  }, [visibleAirlines.length, isPaused, isDragging]);

  const handleScrollPrev = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstChild ? firstChild.clientWidth + 20 : 260;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const handleScrollNext = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstChild ? firstChild.clientWidth + 20 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (visibleAirlines.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#0c120e] border-t border-zinc-200/60 dark:border-zinc-800 transition-colors duration-300">
      <div
        className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-400/10">
            <Plane className="h-3.5 w-3.5" />
            <span>OPERATING PARTNERS & CARRIERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            {displayAirlinesTitle}
          </h2>
          {displayAirlinesSubtitle && (
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {displayAirlinesSubtitle}
            </p>
          )}
        </div>

        {/* Scrollable / Draggable Logo Carousel Container */}
        <div className="relative mx-auto w-full group/carousel">
          {/* Previous Arrow Button (Desktop Side) */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleScrollPrev}
            className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-lg cursor-pointer transition-all duration-200 opacity-80 hover:opacity-100 hidden sm:flex items-center justify-center"
            aria-label="Previous airline"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Next Arrow Button (Desktop Side) */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleScrollNext}
            className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-lg cursor-pointer transition-all duration-200 opacity-80 hover:opacity-100 hidden sm:flex items-center justify-center"
            aria-label="Next airline"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div
            ref={scrollRef}
            onScroll={() => {
              if (scrollRef.current) {
                const firstChild = scrollRef.current.children[0] as HTMLElement;
                const itemWidth = firstChild
                  ? firstChild.clientWidth + 20
                  : 260;
                const realIndex = Math.round(
                  scrollRef.current.scrollLeft / itemWidth,
                );
                setActiveIndex(realIndex % visibleAirlines.length);
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
            className={`w-full flex gap-5 overflow-x-auto py-3 px-1 ${
              isDragging ? "" : "snap-x snap-mandatory"
            } hide-scrollbar select-none`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {visibleAirlines.map((airline, idx) => {
              const itemKey = airline.id || `airline-${idx}`;
              const logoSrc = airline.imageUrl || airline.logoUrl;
              const isBroken = failedLogos[itemKey];
              const altText = airline.name || `Airline Partner ${idx + 1}`;

              return (
                <div
                  key={itemKey}
                  className="relative shrink-0 w-[42vw] sm:w-[180px] md:w-[210px] snap-center rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 shadow-xs hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 group p-4 flex items-center justify-center h-24 sm:h-28"
                >
                  {logoSrc && !isBroken ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoSrc}
                      alt={altText}
                      className="max-h-14 sm:max-h-16 max-w-[130px] sm:max-w-[160px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none opacity-85 group-hover:opacity-100"
                      loading="lazy"
                      onError={() => {
                        setFailedLogos((prev) => ({
                          ...prev,
                          [itemKey]: true,
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <Plane className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-semibold text-xs sm:text-sm truncate max-w-[130px]">
                        {altText}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Dot Indicators & Mobile Navigation */}
        <div className="flex justify-center items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleScrollPrev}
            className="h-8 w-8 rounded-full sm:hidden border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            aria-label="Previous airline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {visibleAirlines.length > 1 && (
            <div className="flex justify-center items-center gap-2">
              {visibleAirlines.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (scrollRef.current) {
                      const firstChild = scrollRef.current
                        .children[0] as HTMLElement;
                      const itemWidth = firstChild
                        ? firstChild.clientWidth + 20
                        : 260;
                      const targetScrollLeft = idx * itemWidth;
                      scrollRef.current.scrollTo({
                        left: targetScrollLeft,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="h-2 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer"
                  style={{
                    width: activeIndex === idx ? "24px" : "8px",
                    backgroundColor:
                      activeIndex === idx ? primaryColor : "#9ca3af",
                    opacity: activeIndex === idx ? 1 : 0.4,
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleScrollNext}
            className="h-8 w-8 rounded-full sm:hidden border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            aria-label="Next airline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `,
        }}
      />
    </section>
  );
}
