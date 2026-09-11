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
    <div className="flex items-center justify-between bg-accent/20 p-4 rounded-lg mb-6 border border-border">
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          type="color"
          className="w-12 p-1 h-9"
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
