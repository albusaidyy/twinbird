'use client';

import React, { useState } from 'react';
import { Clock, MapPin, Globe, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AirTicketingRoute, AirTicketingBookingFormConfig } from '@/types/app-config';
import { AirTicketingBookingDialog } from './AirTicketingBookingDialog';

interface AirTicketingBookingSectionProps {
  routes?: AirTicketingRoute[];
  routesTitle?: string;
  routesSubtitle?: string;
  routesNote?: string;
  localTitle?: string;
  localSubtitle?: string;
  internationalTitle?: string;
  internationalSubtitle?: string;
  formConfig?: AirTicketingBookingFormConfig;
  primaryColor?: string;
  accentColor?: string;
}

export function AirTicketingBookingSection({
  routes = [],
  routesTitle = 'Flight Routes & Schedules',
  routesSubtitle = 'Explore popular domestic bush hops, coastal connections, and regional international flights',
  routesNote = "Don't see your desired flight route or need a private bush charter? Inquire with our flight desk and we'll arrange it.",
  localTitle = 'Local & Domestic Flights',
  localSubtitle = 'Scenic safari bush flights and coastal shuttles across Kenya',
  internationalTitle = 'International & Regional Flights',
  internationalSubtitle = 'Seamless cross-border hops, regional hubs, and global connections',
  formConfig,
  primaryColor = '#1b4332',
  accentColor = '#d97706',
}: AirTicketingBookingSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRouteName, setSelectedRouteName] = useState('');
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');

  const visibleRoutes = (routes || []).filter((r) => r.enabled !== false);
  const localRoutes = visibleRoutes.filter((r) => (r.category || 'local') === 'local');
  const internationalRoutes = visibleRoutes.filter((r) => r.category === 'international');

  const handleOpenBooking = (route?: AirTicketingRoute) => {
    if (route) {
      setSelectedRouteName(`${route.from} → ${route.to}`);
      setDepartureCity(route.from);
      setDestinationCity(route.to);
    } else {
      setSelectedRouteName('');
      setDepartureCity('');
      setDestinationCity('');
    }
    setDialogOpen(true);
  };

  const renderRouteItem = (route: AirTicketingRoute) => (
    <div
      key={route.id}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 px-4 rounded-2xl transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
    >
      {/* Timeline Route Pins (Exact Transfer Routes Style) */}
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center pt-1">
          <span
            className="h-2.5 w-2.5 rounded-full ring-4 shrink-0"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 0 4px ${primaryColor}20`,
            }}
          />
          <span className="w-0.5 h-6 bg-zinc-300 dark:bg-zinc-700 my-1 rounded" />
          <span
            className="h-2.5 w-2.5 rounded-full border-2 bg-white dark:bg-zinc-900 shrink-0"
            style={{ borderColor: primaryColor }}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
              {route.from}
            </span>
            {route.popular && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                Popular
              </span>
            )}
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            to {route.to}
          </div>
          {route.airline && (
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {route.airline}
            </div>
          )}
        </div>
      </div>

      {/* Right Meta & CTA Button */}
      <div className="flex items-center justify-between sm:justify-end gap-4 pl-7 sm:pl-0 shrink-0">
        <div className="text-left sm:text-right">
          {route.price && (
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base leading-tight">
              {route.price}
              {route.priceLabel && (
                <span className="text-[10px] sm:text-[11px] text-zinc-400 block font-normal -mt-0.5">
                  {route.priceLabel}
                </span>
              )}
            </div>
          )}
          {route.duration && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap mt-0.5">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{route.duration}</span>
            </div>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => handleOpenBooking(route)}
          className="rounded-full text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap px-4 sm:px-5"
          style={{
            backgroundColor: accentColor || primaryColor,
          }}
        >
          Book Flight
        </Button>
      </div>
    </div>
  );

  return (
    <section id="booking-section" className="py-16 sm:py-24 bg-[#faf8f5] dark:bg-[#0c120e] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span
            className="text-xs font-bold uppercase tracking-widest block"
            style={{ color: primaryColor }}
          >
            ROUTES & SCHEDULES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            {routesTitle}
          </h2>
          {routesSubtitle && (
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              {routesSubtitle}
            </p>
          )}
        </div>

        {/* Two-Column Routes Container (Local on Left, International on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          
          {/* ────────────────────────────────────────────────────────── */}
          {/* COLUMN 1: Local & Domestic Flights                        */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    {localTitle}
                  </h3>
                  {localSubtitle && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {localSubtitle}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-400 hidden sm:inline-block">
                {localRoutes.length} routes
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-black/5 dark:border-white/10 divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {localRoutes.length > 0 ? (
                localRoutes.map(renderRouteItem)
              ) : (
                <p className="p-6 text-sm text-zinc-500 text-center">No local routes listed.</p>
              )}
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* COLUMN 2: International & Regional Flights                */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                >
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    {internationalTitle}
                  </h3>
                  {internationalSubtitle && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {internationalSubtitle}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-400 hidden sm:inline-block">
                {internationalRoutes.length} routes
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-black/5 dark:border-white/10 divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {internationalRoutes.length > 0 ? (
                internationalRoutes.map(renderRouteItem)
              ) : (
                <p className="p-6 text-sm text-zinc-500 text-center">No international routes listed.</p>
              )}
            </div>
          </div>

        </div>

        {/* Footnote / Custom Route Inquiry Callout Banner */}
        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl border border-black/5 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-4 w-4" style={{ color: accentColor }} />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Custom Flights & Private Charters
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {routesNote}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => handleOpenBooking()}
            className="rounded-full px-6 py-2.5 h-11 text-xs sm:text-sm font-semibold text-white shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="h-4 w-4" />
            Request Custom Flight Quote
          </Button>
        </div>

      </div>

      {/* Mobile-friendly Booking Dialog */}
      <AirTicketingBookingDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedRoute={selectedRouteName}
        defaultDeparture={departureCity}
        defaultDestination={destinationCity}
        formConfig={formConfig}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />
    </section>
  );
}

