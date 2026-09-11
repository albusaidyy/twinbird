import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { AppConfig } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { ImageUploaderField } from '../shared/ImageUploaderField';

export function HomeHeroEditor({ draft, set }: EditorProps) {
  const h = draft.homepage.hero;
  const upd = <K extends keyof AppConfig['homepage']['hero']>(k: K, v: AppConfig['homepage']['hero'][K]) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, hero: { ...p.homepage.hero, [k]: v } } }));

  return (
    <div className="space-y-5">
      <SectionToggle title="Hero Section" enabled={h.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={h.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showEyebrow} onCheckedChange={(v) => upd('showEyebrow', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Eyebrow text" id="h-eyebrow">
            <Input id="h-eyebrow" value={h.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} disabled={!h.showEyebrow} />
          </FieldRow>
        </div>
      </div>
      <Separator />
      
      <FieldRow label="Headline" id="h-headline">
        <Input id="h-headline" value={h.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Italic / highlight text" id="h-italic">
        <Input id="h-italic" value={h.italicText} onChange={(e) => upd('italicText', e.target.value)} />
      </FieldRow>
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showSubtitle} onCheckedChange={(v) => upd('showSubtitle', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Subtitle" id="h-subtitle">
            <textarea
              id="h-subtitle"
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Switch checked={h.showPrimaryCta} onCheckedChange={(v) => upd('showPrimaryCta', v)} />
            <span className="text-sm font-semibold">Primary CTA</span>
          </div>
          <FieldRow label="Button label" id="h-cta1-label">
            <Input id="h-cta1-label" value={h.primaryCtaLabel} onChange={(e) => upd('primaryCtaLabel', e.target.value)} disabled={!h.showPrimaryCta} />
          </FieldRow>
          <FieldRow label="Button link" id="h-cta1-href">
            <Input id="h-cta1-href" value={h.primaryCtaHref} onChange={(e) => upd('primaryCtaHref', e.target.value)} disabled={!h.showPrimaryCta} />
          </FieldRow>
        </div>
        
        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Switch checked={h.showSecondaryCta} onCheckedChange={(v) => upd('showSecondaryCta', v)} />
            <span className="text-sm font-semibold">Secondary CTA</span>
          </div>
          <FieldRow label="Button label" id="h-cta2-label">
            <Input id="h-cta2-label" value={h.secondaryCtaLabel} onChange={(e) => upd('secondaryCtaLabel', e.target.value)} disabled={!h.showSecondaryCta} />
          </FieldRow>
          <FieldRow label="Button link" id="h-cta2-href">
            <Input id="h-cta2-href" value={h.secondaryCtaHref} onChange={(e) => upd('secondaryCtaHref', e.target.value)} disabled={!h.showSecondaryCta} />
          </FieldRow>
        </div>
      </div>
      <Separator />
      <FieldRow label="Background image" id="h-image">
        <ImageUploaderField
          id="h-image"
          value={h.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="hero"
          placeholder="Paste image URL or click Upload..."
        />
      </FieldRow>
      <p className="text-[11px] text-muted-foreground mt-1">Recommended: 1920x1080px or higher (JPG, PNG, WEBP). Used as the hero background.</p>
    </div>
  );
}
