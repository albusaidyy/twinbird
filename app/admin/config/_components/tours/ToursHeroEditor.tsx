import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { AppConfig } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { ImageUploaderField } from '../shared/ImageUploaderField';

export function ToursHeroEditor({ draft, set }: EditorProps) {
  const h = draft.toursPage?.hero || defaultConfig.toursPage?.hero || defaultConfig.contactPage.hero;
  const upd = <K extends keyof AppConfig['homepage']['hero']>(k: K, v: AppConfig['homepage']['hero'][K]) =>
    set((p) => {
      const current = p.toursPage || defaultConfig.toursPage!;
      return { ...p, toursPage: { ...current, hero: { ...current.hero, [k]: v } } };
    });

  return (
    <div className="space-y-5">
      <SectionToggle title="Safari Tours Hero Section" enabled={h.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={h.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showEyebrow} onCheckedChange={(v) => upd('showEyebrow', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Eyebrow text" id="tph-eyebrow">
            <Input id="tph-eyebrow" value={h.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} disabled={!h.showEyebrow} />
          </FieldRow>
        </div>
      </div>
      <Separator />
      
      <FieldRow label="Headline" id="tph-headline">
        <Input id="tph-headline" value={h.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Italic / highlight text" id="tph-italic">
        <Input id="tph-italic" value={h.italicText} onChange={(e) => upd('italicText', e.target.value)} />
      </FieldRow>
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showSubtitle} onCheckedChange={(v) => upd('showSubtitle', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Subtitle" id="tph-subtitle">
            <textarea
              id="tph-subtitle"
              rows={3}
              value={h.subtitle}
              onChange={(e) => upd('subtitle', e.target.value)}
              disabled={!h.showSubtitle}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
            />
          </FieldRow>
        </div>
      </div>
      
      <Separator />
      <FieldRow label="Background image" id="tph-image">
        <ImageUploaderField
          id="tph-image"
          value={h.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="hero"
          placeholder="Upload or choose hero background..."
        />
      </FieldRow>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3 pt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Safari Tours Page SEO & Meta</h4>
        <FieldRow label="Meta Title" id="tp-meta-title">
          <Input
            id="tp-meta-title"
            value={draft.toursPage?.metaTitle || ''}
            placeholder="e.g. Safari Packages & Wildlife Game Drives"
            onChange={(e) =>
              set((p) => {
                const current = p.toursPage || defaultConfig.toursPage!;
                return { ...p, toursPage: { ...current, metaTitle: e.target.value } };
              })
            }
          />
        </FieldRow>
        <FieldRow label="Meta Description" id="tp-meta-desc">
          <textarea
            id="tp-meta-desc"
            rows={2}
            value={draft.toursPage?.metaDescription || ''}
            placeholder="e.g. Explore our fleet of custom 4x4 safari packages in Maasai Mara, Amboseli, and Tsavo..."
            onChange={(e) =>
              set((p) => {
                const current = p.toursPage || defaultConfig.toursPage!;
                return { ...p, toursPage: { ...current, metaDescription: e.target.value } };
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </FieldRow>
      </div>
    </div>
  );
}
