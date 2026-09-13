'use client';

import React from 'react';
import { ShieldCheck, Clock, Plane, Sparkles, Ticket, Headphones, MapPin, LucideIcon } from 'lucide-react';
import { AirTicketingFeature } from '@/types/app-config';

const iconComponents: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  Plane,
  Sparkles,
  Ticket,
  Headphones,
  MapPin,
};

interface AirTicketingFeaturesSectionProps {
  features?: AirTicketingFeature[];
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
}

export function AirTicketingFeaturesSection({
  features = [],
  accentColor = '#d97706',
  backgroundColor = '#f5f5f0',
}: AirTicketingFeaturesSectionProps) {
  if (!features || features.length === 0) return null;

  return (
    <section 
      className="py-12 md:py-16 px-6 transition-colors duration-300 border-b border-black/5 dark:border-white/5"
      style={{ backgroundColor }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const IconComp = iconComponents[item.icon] || Plane;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md border border-black/5 dark:border-zinc-800 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: `${accentColor}18`, 
                      color: accentColor 
                    }}
                  >
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
