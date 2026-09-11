import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { StoryParagraphItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { ImageUploaderField } from '../shared/ImageUploaderField';

export function AboutStoryEditor({ draft, set }: EditorProps) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const s = about.story;
  const rawParagraphs =
    s.paragraphs && s.paragraphs.length > 0
      ? s.paragraphs
      : ([s.paragraph1, s.paragraph2].filter(Boolean) as string[]);

  const paragraphs: StoryParagraphItem[] = rawParagraphs.map((p) =>
    typeof p === 'string' ? { enabled: true, text: p } : p
  );

  const upd = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, story: { ...current.story, [k]: v } } };
    });

  const addParagraph = () => {
    upd('paragraphs', [...paragraphs, { enabled: true, text: '' }]);
  };

  const updateParagraph = (idx: number, patch: Partial<StoryParagraphItem>) => {
    const updated = [...paragraphs];
    updated[idx] = { ...updated[idx], ...patch };
    upd('paragraphs', updated);
  };

  const removeParagraph = (idx: number) => {
    const updated = paragraphs.filter((_, i) => i !== idx);
    upd('paragraphs', updated);
  };

  const moveParagraph = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= paragraphs.length) return;
    const arr = [...paragraphs];
    const [temp] = arr.splice(idx, 1);
    arr.splice(target, 0, temp);
    upd('paragraphs', arr);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="Our Story Section" enabled={s.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={s.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />

      <FieldRow label="Eyebrow text" id="abs-eyebrow">
        <Input id="abs-eyebrow" value={s.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Title" id="abs-title">
        <Input id="abs-title" value={s.title} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Story Paragraphs ({paragraphs.length})</h4>
            <p className="text-xs text-muted-foreground">Add, toggle on/off, reorder, or delete narrative paragraphs.</p>
          </div>
          <Button size="sm" variant="outline" onClick={addParagraph} className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" /> Add Paragraph
          </Button>
        </div>

        {paragraphs.map((para, idx) => (
          <div key={idx} className="border rounded-lg p-3 bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={para.enabled}
                  onCheckedChange={(checked) => updateParagraph(idx, { enabled: checked })}
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  Paragraph #{idx + 1} {!para.enabled && '(Disabled)'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0} onClick={() => moveParagraph(idx, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === paragraphs.length - 1} onClick={() => moveParagraph(idx, 1)}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeParagraph(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <textarea
              rows={3}
              value={para.text}
              disabled={!para.enabled}
              onChange={(e) => updateParagraph(idx, { text: e.target.value })}
              placeholder="Write a paragraph about your journey, heritage, or mission..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      <Separator />
      <FieldRow label="Side Image" id="abs-image">
        <ImageUploaderField
          id="abs-image"
          value={s.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="about"
          placeholder="Upload or choose story image..."
        />
      </FieldRow>

      <FieldRow label="Image Alt Description" id="abs-alt">
        <Input id="abs-alt" value={s.imageAlt || ''} onChange={(e) => upd('imageAlt', e.target.value)} />
      </FieldRow>
    </div>
  );
}
