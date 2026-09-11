'use client';

import { Clock, MapPin, Calendar, Users } from 'lucide-react';

export function ExcursionQuickInfoBar({
  duration,
  showDuration = true,
  location,
  showLocation = true,
  schedule,
  showSchedule = true,
  groupType,
  showGroupType = true,
  primaryColor,
}: {
  duration?: string;
  showDuration?: boolean;
  location?: string;
  showLocation?: boolean;
  schedule?: string;
  showSchedule?: boolean;
  groupType?: string;
  showGroupType?: boolean;
  primaryColor: string;
}) {
  const items = [
    showDuration !== false && duration ? { icon: Clock, label: duration } : null,
    showLocation !== false && location ? { icon: MapPin, label: location } : null,
    showSchedule !== false && schedule ? { icon: Calendar, label: schedule } : null,
    showGroupType !== false && groupType ? { icon: Users, label: groupType } : null,
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string }[];

  if (items.length === 0) return null;

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
