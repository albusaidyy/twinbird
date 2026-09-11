import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import type { GalleryItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { ImageUploaderField } from '../shared/ImageUploaderField';

export function HomeGalleryEditor({ draft, set }: EditorProps) {
  const data = draft.homepage.gallery || defaultConfig.homepage.gallery;
  const updEnabled = (v: boolean) =>
    set((p) => ({
      ...p,
      homepage: { ...p.homepage, gallery: { ...(p.homepage.gallery || defaultConfig.homepage.gallery), enabled: v } },
    }));
  const updItem = (i: number, k: keyof GalleryItem, v: string | boolean) =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      const arr = [...currentGallery.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, items: arr } } };
    });
  const addItem = () =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      return {
        ...p,
        homepage: {
          ...p.homepage,
          gallery: {
            ...currentGallery,
            items: [...currentGallery.items, { enabled: true, caption: 'New Image', imageUrl: '/images/hero/hero.jpg' }],
          },
        },
      };
    });
  const rmItem = (i: number) =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      return {
        ...p,
        homepage: {
          ...p.homepage,
          gallery: { ...currentGallery, items: currentGallery.items.filter((_, idx) => idx !== i) },
        },
      };
    });
  const moveItem = (i: number, dir: -1 | 1) =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      const target = i + dir;
      if (target < 0 || target >= currentGallery.items.length) return p;
      const arr = [...currentGallery.items];
      const temp = arr[i];
      arr[i] = arr[target];
      arr[target] = temp;
      return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, items: arr } } };
    });

  return (
    <div className="space-y-6">
      <SectionToggle title="Catch Gallery" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker
        value={data.backgroundColor}
        onChange={(v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, gallery: { ...p.homepage.gallery, backgroundColor: v } } }))
        }
      />
      <BackgroundColorPicker
        label="Indicator Color"
        desc="Pick a custom color for the carousel indicator dots and buttons."
        value={data.indicatorColor}
        onChange={(v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, gallery: { ...p.homepage.gallery, indicatorColor: v } } }))
        }
      />

      <SectionHeaderFields
        data={data}
        onChange={(k, v) =>
          set((p) => {
            const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
            return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, [k]: v } } };
          })
        }
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Gallery Photos ({data.items.length})</h4>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={addItem}>
            <Plus className="h-3.5 w-3.5" /> Add Image
          </Button>
        </div>

        {data.items.map((img, i) => (
          <div key={i} className="relative rounded-lg border border-border p-5 pt-11 bg-card shadow-xs">
            <div className="absolute top-2.5 left-4 right-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Switch checked={img.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} />
                <span className="text-xs font-semibold text-muted-foreground">
                  Photo #{i + 1} {!img.enabled && '(Hidden)'}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={i === 0}
                  onClick={() => moveItem(i, -1)}
                  title="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={i === data.items.length - 1}
                  onClick={() => moveItem(i, 1)}
                  title="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  onClick={() => rmItem(i)}
                  title="Delete photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: img.enabled ? 1 : 0.5 }}>
              <FieldRow label="Gallery Photo" id={`g-img-${i}`}>
                <ImageUploaderField
                  id={`g-img-${i}`}
                  value={img.imageUrl}
                  onChange={(url) => updItem(i, 'imageUrl', url)}
                  folder="gallery"
                  placeholder="Upload or choose gallery photo..."
                  disabled={!img.enabled}
                />
              </FieldRow>
              <FieldRow label="Caption" id={`g-cap-${i}`}>
                <Input id={`g-cap-${i}`} value={img.caption} onChange={(e) => updItem(i, 'caption', e.target.value)} disabled={!img.enabled} />
              </FieldRow>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
