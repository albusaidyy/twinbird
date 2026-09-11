import React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FieldRow } from './FieldRow';

export function SectionHeaderFields({
  data,
  onChange,
}: {
  data: { title?: string; subtitle?: string; eyebrow?: string; enabled: boolean };
  onChange: (key: 'title' | 'subtitle' | 'eyebrow', value: string) => void;
}) {
  return (
    <>
      <FieldRow label="Section Eyebrow" id="sec-eyebrow">
        <Input
          id="sec-eyebrow"
          value={data.eyebrow ?? ''}
          onChange={(e) => onChange('eyebrow', e.target.value)}
          disabled={!data.enabled}
        />
      </FieldRow>
      <FieldRow label="Section Title" id="sec-title">
        <Input
          id="sec-title"
          value={data.title ?? ''}
          onChange={(e) => onChange('title', e.target.value)}
          disabled={!data.enabled}
        />
      </FieldRow>
      <FieldRow label="Section Subtitle" id="sec-subtitle">
        <Input
          id="sec-subtitle"
          value={data.subtitle ?? ''}
          onChange={(e) => onChange('subtitle', e.target.value)}
          disabled={!data.enabled}
        />
      </FieldRow>
      <Separator />
    </>
  );
}
