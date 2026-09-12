'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
  primaryColor?: string;
}

export function ImageLightbox({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  title,
  primaryColor = '#193da9',
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevOpen, setPrevOpen] = useState(isOpen);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Sync index and reset zoom when lightbox opens or initialIndex changes (React render-time adjustment)
  if (isOpen !== prevOpen || initialIndex !== prevInitialIndex) {
    setPrevOpen(isOpen);
    setPrevInitialIndex(initialIndex);
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // Keyboard controls (Escape, Left, Right, +, -)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev + 0.25, 4));
    } else {
      setZoom((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Pan drag when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImageUrl = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-in fade-in-0 duration-200 overflow-hidden"
      onClick={onClose}
      onWheel={handleWheel}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title & Counter */}
        <div className="text-white">
          {title && (
            <h4 className="text-sm sm:text-base font-semibold truncate max-w-[200px] sm:max-w-md drop-shadow-md">
              {title}
            </h4>
          )}
          <span className="text-xs text-white/70 font-mono">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Action Controls & Close Button */}
        <div className="flex items-center gap-2">
          {/* Zoom Toolbar */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 shadow-lg text-white">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-0.5 text-xs font-mono font-medium hover:bg-white/20 rounded transition-colors cursor-pointer"
              title="Reset zoom (0)"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            {zoom > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer ml-0.5 text-white/80 hover:text-white"
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-lg focus:outline-none"
            title="Close (Esc)"
            aria-label="Close photo view"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImageUrl}
          alt={`${title || 'Photo'} ${currentIndex + 1}`}
          onClick={handleToggleZoom}
          draggable={false}
          className="max-w-[92vw] max-h-[85vh] object-contain transition-transform duration-150 ease-out select-none shadow-2xl rounded-lg"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
          }}
        />
      </div>

      {/* Left / Right Arrow Navigation */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 cursor-pointer shadow-xl focus:outline-none"
            title="Previous photo (Left arrow)"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 cursor-pointer shadow-xl focus:outline-none"
            title="Next photo (Right arrow)"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Bottom Thumbnail Strip on larger screens */}
      {images.length > 1 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] overflow-x-auto flex items-center gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 shadow-xl hide-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((thumbUrl, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className={`relative shrink-0 w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-white scale-105 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
                style={{
                  borderColor: isActive ? primaryColor || '#ffffff' : undefined,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
