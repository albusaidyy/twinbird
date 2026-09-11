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

export function AboutHeroEditor({ draft, set }: EditorProps) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const h = about.hero;
  const upd = <K extends keyof AppConfig['homepage']['hero']>(k: K, v: AppConfig['homepage']['hero'][K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, hero: { ...current.hero, [k]: v } } };
    });

  return (
    <div className="space-y-5">
      <SectionToggle title="About Hero Section" enabled={h.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={h.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />

      <FieldRow label="Section Height" id="abh-size">
        <select
          id="abh-size"
          value={h.size || 'large'}
          onChange={(e) => upd('size', e.target.value as 'small' | 'medium' | 'large' | 'fullscreen')}
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="small">Small (50vh)</option>
          <option value="medium">Medium (70vh)</option>
          <option value="large">Large (85vh)</option>
          <option value="fullscreen">Fullscreen (100vh)</option>
        </select>
      </FieldRow>

      <div className="flex gap-4 items-start">
        <Switch checked={h.showEyebrow} onCheckedChange={(v) => upd('showEyebrow', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Eyebrow badge text" id="abh-eyebrow">
            <Input id="abh-eyebrow" value={h.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} disabled={!h.showEyebrow} />
          </FieldRow>
        </div>
      </div>
      <Separator />

      <FieldRow label="Headline" id="abh-headline">
        <Input id="abh-headline" value={h.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Italic / highlight text" id="abh-italic">
        <Input id="abh-italic" value={h.italicText} onChange={(e) => upd('italicText', e.target.value)} />
      </FieldRow>

      <div className="flex gap-4 items-start">
        <Switch checked={h.showSubtitle} onCheckedChange={(v) => upd('showSubtitle', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Subtitle" id="abh-subtitle">
            <textarea
              id="abh-subtitle"
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
      <FieldRow label="Background image" id="abh-image">
        <ImageUploaderField
          id="abh-image"
          value={h.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="hero"
          placeholder="Upload or choose hero image..."
        />
      </FieldRow>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3 pt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">About Page SEO & Meta</h4>
        <FieldRow label="Meta Title" id="ab-meta-title">
          <Input
            id="ab-meta-title"
            value={draft.aboutPage?.metaTitle || ''}
            placeholder="e.g. About Our Heritage & Guides"
            onChange={(e) =>
              set((p) => {
                const current = p.aboutPage || defaultConfig.aboutPage!;
                return { ...p, aboutPage: { ...current, metaTitle: e.target.value } };
              })
            }
          />
        </FieldRow>
        <FieldRow label="Meta Description" id="ab-meta-desc">
          <textarea
            id="ab-meta-desc"
            rows={2}
            value={draft.aboutPage?.metaDescription || ''}
            placeholder="e.g. Discover our story, decades of wildlife guiding, and savannah conservation..."
            onChange={(e) =>
              set((p) => {
                const current = p.aboutPage || defaultConfig.aboutPage!;
                return { ...p, aboutPage: { ...current, metaDescription: e.target.value } };
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </FieldRow>
      </div>
    </div>
  );
}
