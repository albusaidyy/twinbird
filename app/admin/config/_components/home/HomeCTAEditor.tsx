import React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { AppConfig } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';

export function HomeCTAEditor({ draft, set }: EditorProps) {
  const cta = draft.homepage.ctaBanner;
  const upd = <K extends keyof AppConfig['homepage']['ctaBanner']>(k: K, v: AppConfig['homepage']['ctaBanner'][K]) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, ctaBanner: { ...p.homepage.ctaBanner, [k]: v } } }));

  return (
    <div className="space-y-5">
      <SectionToggle title="CTA Banner" enabled={cta.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={cta.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <FieldRow label="Headline" id="cta-headline">
        <Input id="cta-headline" value={cta.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Subtitle" id="cta-subtitle">
        <textarea
          id="cta-subtitle"
          rows={2}
          value={cta.subtitle}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Button label" id="cta-label">
          <Input id="cta-label" value={cta.ctaLabel} onChange={(e) => upd('ctaLabel', e.target.value)} />
        </FieldRow>
        <FieldRow label="Button link" id="cta-href">
          <Input id="cta-href" value={cta.ctaHref} onChange={(e) => upd('ctaHref', e.target.value)} />
        </FieldRow>
      </div>
    </div>
  );
}
