import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';
import type { WhyUsItem } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { ImageUploaderField } from '../shared/ImageUploaderField';

export function HomeWhyUsEditor({ draft, set }: EditorProps) {
  const data = draft.homepage.whyUs;
  const updEnabled = (v: boolean) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, enabled: v } } }));
  const updItem = (i: number, k: keyof WhyUsItem, v: string | boolean) =>
    set((p) => {
      const arr = [...p.homepage.whyUs.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, items: arr } } };
    });
  const addWhyUs = () =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        whyUs: {
          ...p.homepage.whyUs,
          items: [...p.homepage.whyUs.items, { enabled: true, title: 'New Feature', icon: 'Star', body: '...' }],
        },
      },
    }));
  const rmWhyUs = (i: number) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        whyUs: { ...p.homepage.whyUs, items: p.homepage.whyUs.items.filter((_, idx) => idx !== i) },
      },
    }));

  return (
    <div className="space-y-6">
      <SectionToggle title="Why Us" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker
        value={data.backgroundColor}
        onChange={(v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, backgroundColor: v } } }))
        }
      />

      <SectionHeaderFields
        data={data}
        onChange={(k, v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, [k]: v } } }))
        }
      />

      <FieldRow label="Section Image" id="w-section-img">
        <ImageUploaderField
          id="w-section-img"
          value={data.imageUrl ?? ''}
          onChange={(url) =>
            set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, imageUrl: url } } }))
          }
          folder="whyus"
          placeholder="Upload or choose Why Us image..."
          disabled={!data.enabled}
        />
      </FieldRow>
      <Separator />

      {data.items.map((item, i) => (
        <div key={i} className="relative rounded-lg border border-border p-5 pt-10 bg-card">
          <div className="absolute top-2 left-4 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={item.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{item.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:bg-destructive/10"
              onClick={() => rmWhyUs(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: item.enabled ? 1 : 0.5 }}>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Title" id={`w-title-${i}`}>
                <Input id={`w-title-${i}`} value={item.title} onChange={(e) => updItem(i, 'title', e.target.value)} disabled={!item.enabled} />
              </FieldRow>
              <FieldRow label="Icon (Lucide name)" id={`w-icon-${i}`}>
                <Input
                  id={`w-icon-${i}`}
                  value={item.icon}
                  onChange={(e) => updItem(i, 'icon', e.target.value)}
                  placeholder="e.g. Shield, Globe"
                  disabled={!item.enabled}
                />
              </FieldRow>
            </div>
            <FieldRow label="Body text" id={`w-body-${i}`}>
              <textarea
                id={`w-body-${i}`}
                rows={2}
                value={item.body}
                onChange={(e) => updItem(i, 'body', e.target.value)}
                disabled={!item.enabled}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
              />
            </FieldRow>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addWhyUs}>
        <Plus className="h-4 w-4" /> Add Feature
      </Button>
    </div>
  );
}
