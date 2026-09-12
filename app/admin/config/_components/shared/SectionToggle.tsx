import React from 'react';
import { Switch } from '@/components/ui/switch';

export function SectionToggle({
  title,
  enabled,
  onChange,
  subtitle = 'Toggle this section on or off on the page.',
}: {
  title: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-accent/50 p-3.5 sm:p-4 rounded-lg mb-6 border border-border">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm leading-tight">Show {title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} className="shrink-0" />
    </div>
  );
}
