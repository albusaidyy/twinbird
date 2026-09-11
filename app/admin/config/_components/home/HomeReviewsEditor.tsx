import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import type { ReviewItem } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';

export function HomeReviewsEditor({ draft, set }: EditorProps) {
  const data = draft.homepage.reviews;
  const updEnabled = (v: boolean) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, enabled: v } } }));
  const updReview = (i: number, k: keyof ReviewItem, v: string | boolean) =>
    set((p) => {
      const arr = [...p.homepage.reviews.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, items: arr } } };
    });
  const addReview = () =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        reviews: {
          ...p.homepage.reviews,
          items: [...p.homepage.reviews.items, { enabled: true, name: 'New Guest', location: 'Earth', quote: 'Great!' }],
        },
      },
    }));
  const rmReview = (i: number) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        reviews: { ...p.homepage.reviews, items: p.homepage.reviews.items.filter((_, idx) => idx !== i) },
      },
    }));

  return (
    <div className="space-y-6">
      <SectionToggle title="Reviews" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker
        value={data.backgroundColor}
        onChange={(v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, backgroundColor: v } } }))
        }
      />

      <SectionHeaderFields
        data={data}
        onChange={(k, v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, [k]: v } } }))
        }
      />

      {data.items.map((r, i) => (
        <div key={i} className="relative rounded-lg border border-border p-5 pt-10 bg-card">
          <div className="absolute top-2 left-4 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={r.enabled} onCheckedChange={(v) => updReview(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{r.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:bg-destructive/10"
              onClick={() => rmReview(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: r.enabled ? 1 : 0.5 }}>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Name" id={`r-name-${i}`}>
                <Input id={`r-name-${i}`} value={r.name} onChange={(e) => updReview(i, 'name', e.target.value)} disabled={!r.enabled} />
              </FieldRow>
              <FieldRow label="Location" id={`r-loc-${i}`}>
                <Input id={`r-loc-${i}`} value={r.location} onChange={(e) => updReview(i, 'location', e.target.value)} disabled={!r.enabled} />
              </FieldRow>
            </div>
            <FieldRow label="Quote" id={`r-quote-${i}`}>
              <textarea
                id={`r-quote-${i}`}
                rows={3}
                value={r.quote}
                onChange={(e) => updReview(i, 'quote', e.target.value)}
                disabled={!r.enabled}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
              />
            </FieldRow>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addReview}>
        <Plus className="h-4 w-4" /> Add Review
      </Button>
    </div>
  );
}
