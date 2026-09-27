import React from 'react';
import { Label } from '@/components/ui/label';

export function FieldRow({
  label,
  id,
  desc,
  children,
}: {
  label: string;
  id: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div>
        <Label htmlFor={id}>{label}</Label>
        {desc ? <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p> : null}
      </div>
      {children}
    </div>
  );
}
