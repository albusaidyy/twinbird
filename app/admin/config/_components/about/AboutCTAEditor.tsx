import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';

export function AboutCTAEditor({ draft, set }: EditorProps) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const cta = about.cta;
  const upd = <K extends keyof typeof cta>(k: K, val: (typeof cta)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, cta: { ...current.cta, [k]: val } } };
    });

  return (
    <div className="space-y-6">
      <SectionToggle title="CTA Banner Section" enabled={cta.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={cta.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />

      <FieldRow label="Banner Title" id="abcta-title">
        <Input id="abcta-title" value={cta.title} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <FieldRow label="Banner Subtitle" id="abcta-sub">
        <textarea
          id="abcta-sub"
          rows={3}
          value={cta.subtitle}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary CTA */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Primary Button</h4>
            <Switch
              checked={cta.primaryCta.enabled}
              onCheckedChange={(checked) =>
                upd('primaryCta', { ...cta.primaryCta, enabled: checked })
              }
            />
          </div>
          <FieldRow label="Button Label" id="abcta-p-lbl">
            <Input
              id="abcta-p-lbl"
              value={cta.primaryCta.label}
              onChange={(e) => upd('primaryCta', { ...cta.primaryCta, label: e.target.value })}
              disabled={!cta.primaryCta.enabled}
            />
          </FieldRow>
          <FieldRow label="Button Link" id="abcta-p-href">
            <Input
              id="abcta-p-href"
              value={cta.primaryCta.href}
              onChange={(e) => upd('primaryCta', { ...cta.primaryCta, href: e.target.value })}
              disabled={!cta.primaryCta.enabled}
            />
          </FieldRow>
        </div>

        {/* Secondary CTA */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Secondary Button</h4>
            <Switch
              checked={cta.secondaryCta.enabled}
              onCheckedChange={(checked) =>
                upd('secondaryCta', { ...cta.secondaryCta, enabled: checked })
              }
            />
          </div>
          <FieldRow label="Button Label" id="abcta-s-lbl">
            <Input
              id="abcta-s-lbl"
              value={cta.secondaryCta.label}
              onChange={(e) => upd('secondaryCta', { ...cta.secondaryCta, label: e.target.value })}
              disabled={!cta.secondaryCta.enabled}
            />
          </FieldRow>
          <FieldRow label="Button Link" id="abcta-s-href">
            <Input
              id="abcta-s-href"
              value={cta.secondaryCta.href}
              onChange={(e) => upd('secondaryCta', { ...cta.secondaryCta, href: e.target.value })}
              disabled={!cta.secondaryCta.enabled}
            />
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
