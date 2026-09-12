"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { ExcursionItem } from "@/types/app-config";
import { defaultExcursionGallery } from "@/config/default-config";

export function ExcursionMosaicGallery({
  excursion,
}: {
  excursion: ExcursionItem;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const fallbackImages = [
    excursion.imageUrl || defaultExcursionGallery[0],
    ...defaultExcursionGallery.slice(1),
  ];

  const rawImages =
    excursion.gallery && excursion.gallery.length > 0
      ? excursion.gallery
      : fallbackImages;
  const images = rawImages.filter((img): img is string =>
    Boolean(img && img.trim() !== ""),
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : 0,
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : 0,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images.length]);

  if (images.length === 0) return null;

  const mainImage = images[0];
  const secondImage = images[1] || images[0];
  const thirdImage = images[2] || images[1] || images[0];
  const panoramicImage = images[3] || images[0];
  const additionalImages = images.slice(4);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      (selectedImageIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <section className="space-y-6 md:space-y-8">
      {/* Gallery Heading */}
      <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight">
        Gallery
      </h2>

      {/* Mosaic Grid Container */}
      <div className="space-y-4 sm:space-y-5">
        {/* Top Row: Large Featured Image + 2 Stacked Images */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* Main Large Image (Left: 7/12 on md+) */}
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-7 relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] md:aspect-auto md:min-h-[380px] cursor-pointer bg-stone-100 dark:bg-zinc-800 shadow-xs"
          >
            <Image
              src={mainImage}
              alt={`${excursion.title} gallery photo 1`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 rounded-full bg-white/30 backdrop-blur-md text-white shadow-sm">
                <Maximize2 className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Stacked Images (Right: 5/12 on md+) */}
          <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-5">
            <div
              onClick={() => openLightbox(1)}
              className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/10] cursor-pointer bg-stone-100 dark:bg-zinc-800 shadow-xs"
            >
              <Image
                src={secondImage}
                alt={`${excursion.title} gallery photo 2`}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-white/30 backdrop-blur-md text-white shadow-sm">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div
              onClick={() => openLightbox(2)}
              className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/10] cursor-pointer bg-stone-100 dark:bg-zinc-800 shadow-xs"
            >
              <Image
                src={thirdImage}
                alt={`${excursion.title} gallery photo 3`}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-white/30 backdrop-blur-md text-white shadow-sm">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Panoramic / Wide Hero Landscape */}
        <div
          onClick={() => openLightbox(3)}
          className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] md:aspect-[24/9] cursor-pointer bg-stone-100 dark:bg-zinc-800 shadow-xs"
        >
          <Image
            src={panoramicImage}
            alt={`${excursion.title} gallery panoramic view`}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 rounded-full bg-white/30 backdrop-blur-md text-white shadow-sm">
              <Maximize2 className="h-5 w-5" />
            </span>
          </div>
        </div>

        {/* Extra Images Grid if available */}
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 pt-2">
            {additionalImages.map((imgUrl, i) => (
              <div
                key={i}
                onClick={() => openLightbox(i + 4)}
                className="relative group rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer bg-stone-100 dark:bg-zinc-800 shadow-xs"
              >
                <Image
                  src={imgUrl}
                  alt={`${excursion.title} gallery photo ${i + 5}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-white/30 backdrop-blur-md text-white shadow-sm">
                    <Maximize2 className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImageIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9] max-h-[85vh] flex items-center justify-center"
          >
            <Image
              src={images[selectedImageIndex]}
              alt={`${excursion.title} gallery photo`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/15 hover:bg-white/30 p-2.5 sm:p-3 text-white backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/15 hover:bg-white/30 p-2.5 sm:p-3 text-white backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </>
          )}

          {/* Counter Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs text-white/90">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
