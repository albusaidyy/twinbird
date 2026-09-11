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
    <div className="flex items-center justify-between bg-accent/50 p-4 rounded-lg mb-6 border border-border">
      <div>
        <p className="font-semibold text-sm">Show {title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}
