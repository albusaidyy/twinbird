import React from 'react';
import { Input } from '@/components/ui/input';

export function BackgroundColorPicker({
  value,
  onChange,
  label = 'Background Color',
  desc = 'Pick a custom color for this section.',
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  label?: string;
  desc?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-accent/20 p-3 sm:p-4 rounded-lg mb-4 border border-border">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm leading-tight">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className="flex gap-2 items-center shrink-0 self-start sm:self-auto">
        <Input
          type="color"
          className="w-11 sm:w-12 p-1 h-9 cursor-pointer shrink-0"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
        />
        <Input
          className="w-24 font-mono text-xs"
          value={value || ''}
          placeholder="#ffffff"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
