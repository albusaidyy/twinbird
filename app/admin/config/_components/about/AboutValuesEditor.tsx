import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { AboutValueItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';

export function AboutValuesEditor({ draft, set }: EditorProps) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const v = about.values;
  const upd = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, values: { ...current.values, [k]: val } } };
    });

  const addItem = () => {
    const newItem: AboutValueItem = {
      enabled: true,
      icon: 'Star',
      title: 'New Value',
      description: 'Describe this core value and how it guides your voyages.',
    };
    upd('items', [...v.items, newItem]);
  };

  const removeItem = (idx: number) => {
    upd('items', v.items.filter((_, i) => i !== idx));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= v.items.length) return;
    const arr = [...v.items];
    const [temp] = arr.splice(idx, 1);
    arr.splice(target, 0, temp);
    upd('items', arr);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="Core Values Section" enabled={v.enabled} onChange={(val) => upd('enabled', val)} />
      <BackgroundColorPicker value={v.backgroundColor} onChange={(val) => upd('backgroundColor', val)} />

      <FieldRow label="Eyebrow text" id="abv-eyebrow">
        <Input id="abv-eyebrow" value={v.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Title" id="abv-title">
        <Input id="abv-title" value={v.title || ''} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Subtitle" id="abv-sub">
        <textarea
          id="abv-sub"
          rows={2}
          value={v.subtitle || ''}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Value Cards ({v.items.length})</h4>
          <Button size="sm" variant="outline" onClick={addItem} className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" /> Add Card
          </Button>
        </div>

        {v.items.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(checked) => {
                    const arr = [...v.items];
                    arr[idx] = { ...item, enabled: checked };
                    upd('items', arr);
                  }}
                />
                <span className="text-sm font-semibold">Card #{idx + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0} onClick={() => moveItem(idx, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === v.items.length - 1} onClick={() => moveItem(idx, 1)}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldRow label="Lucide Icon Name" id={`abv-icon-${idx}`}>
                <Input
                  id={`abv-icon-${idx}`}
                  value={item.icon}
                  placeholder="Anchor, Compass, Users, Star..."
                  onChange={(e) => {
                    const arr = [...v.items];
                    arr[idx] = { ...item, icon: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
              <FieldRow label="Title" id={`abv-title-${idx}`}>
                <Input
                  id={`abv-title-${idx}`}
                  value={item.title}
                  onChange={(e) => {
                    const arr = [...v.items];
                    arr[idx] = { ...item, title: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
            </div>

            <FieldRow label="Description" id={`abv-desc-${idx}`}>
              <textarea
                id={`abv-desc-${idx}`}
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const arr = [...v.items];
                  arr[idx] = { ...item, description: e.target.value };
                  upd('items', arr);
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </FieldRow>
          </div>
        ))}
      </div>
    </div>
  );
}
