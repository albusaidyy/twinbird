'use client';

import { Clock, MapPin, Calendar, Users } from 'lucide-react';

export function TourQuickInfoBar({
  duration,
  location,
  schedule,
  groupType,
  primaryColor,
}: {
  duration?: string;
  location?: string;
  schedule?: string;
  groupType?: string;
  primaryColor: string;
}) {
  const items = [
    {
      icon: Clock,
      label: duration || 'Guided 6 - 8 hours Tour',
    },
    {
      icon: MapPin,
      label: location || 'Watamu Marine Park, Kilifi County',
    },
    {
      icon: Calendar,
      label: schedule || 'Morning Slots (November To March)',
    },
    {
      icon: Users,
      label: groupType || 'Families · Private · Solo Anglers · Groups',
    },
  ].filter((item) => Boolean(item.label));

  return (
    <section className="border-y border-border/80 bg-muted/20 py-4 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-6 md:gap-4 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-xs shrink-0"
                  style={{ color: primaryColor }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="tracking-tight">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
