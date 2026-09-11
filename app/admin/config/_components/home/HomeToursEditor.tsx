import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Compass,
  Plus,
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { TourItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { PAGES } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { ImageUploaderField } from '../shared/ImageUploaderField';
import { TourDeleteConfirmDialog } from '../shared/TourDeleteConfirmDialog';
import { isTourMatch } from '../shared/admin-helpers';

export function HomeToursEditor({ draft, set }: EditorProps) {
  const data = draft.homepage.tours;
  const toursList = draft.homepage.tours?.items || [];
  const [deletePrompt, setDeletePrompt] = useState<{ type: 'soft' | 'permanent'; tour: TourItem; index: number } | null>(null);

  const toursPageNavLabel = draft.navigation?.find((l) => l.href === '/tours' || l.href.startsWith('/tours'))?.label || PAGES.find((p) => p.id === 'tours')?.label || 'Safari Tours';
  const toursSectionLabel = PAGES.find((p) => p.id === 'tours')?.sections.find((s) => s.key === 'tours-page-list')?.label || draft.toursPage?.tours?.title || 'Safari Packages';

  const updEnabled = (v: boolean) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, enabled: v } } }));

  const updTour = (i: number, k: keyof TourItem, v: string | number | boolean | string[]) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const currentTours = currentToursPage.tours || defaultConfig.toursPage!.tours;
      const hpItems = [...(p.homepage?.tours?.items || defaultConfig.homepage.tours.items)];
      const tpItems = [...(currentTours.items || defaultConfig.toursPage!.tours.items)];

      const currentItem = hpItems[i];
      if (!currentItem) return p;

      hpItems[i] = { ...currentItem, [k]: v };

      const tpIdx = tpItems.findIndex((t, idx) => isTourMatch(t, currentItem, idx, i));
      if (tpIdx !== -1) {
        tpItems[tpIdx] = { ...tpItems[tpIdx], [k]: v };
      } else if (tpItems[i]) {
        tpItems[i] = { ...tpItems[i], [k]: v };
      }

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...(p.homepage?.tours || defaultConfig.homepage.tours), items: hpItems } },
        toursPage: { ...currentToursPage, tours: { ...currentTours, items: tpItems } },
      };
    });

  const addTour = () =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];
      const uniqueId = `safari-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newTour: TourItem = {
        id: uniqueId,
        enabled: true,
        deleted: false,
        title: 'New Safari Package',
        badge: 'Popular',
        description: 'Experience premier wildlife safaris and Big Five game drives in Kenya...',
        duration: '3 Days / 2 Nights',
        rating: 5,
        imageUrl: '/images/hero/hero.jpg',
        location: 'Maasai Mara National Reserve',
        showLocation: true,
        schedule: 'Daily Departures (Year-Round)',
        showSchedule: true,
        groupType: 'Families · Private 4x4 · Groups',
        showGroupType: true,
        price: 'Contact for pricing',
        overview: 'Experience premier African wildlife safaris and Big Five game drives in Kenya with customized 4x4 Land Cruisers and professional guides.',
        included: ['Custom 4x4 Safari Land Cruiser', 'Professional safari guide & tracker', 'Park conservation fees', 'Lodge accommodation & meals'],
        showIncluded: true,
        notIncluded: ['Driver-guide gratuities (optional)', 'Hot air balloon safari', 'Personal travel insurance'],
        showNotIncluded: true,
        whyChoose: ['Guaranteed window seats in 4x4 Land Cruisers', 'Silver & Gold certified safari guides', 'Ethical wildlife tracking & Big Five focus'],
        showWhyChoose: true,
        knowBeforeYouGo: ['Departure: Early morning hotel/airport pickup', 'What to bring: Neutral safari clothing, binoculars, sunscreen, warm jacket'],
        showKnowBeforeYouGo: true,
        showTitle: true,
        showBadge: true,
        showDuration: true,
        showRating: true,
        showPrice: true,
      };
      const newHpItems = [...hpItems, { ...newTour }];
      const newTpItems = [...tpItems, { ...newTour }];
      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: newHpItems } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: newTpItems } },
      };
    });

  const softDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const markSoftDeleted = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: true, enabled: false, deletedAt: new Date().toISOString() }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markSoftDeleted) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.map(markSoftDeleted) } },
      };
    });

  const restoreTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const markRestored = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: false, enabled: true, deletedAt: undefined }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markRestored) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.map(markRestored) } },
      };
    });

  const permanentDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const notTarget = (t: TourItem, idx: number) => !isTourMatch(t, targetTour, idx, targetIndex);

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.filter(notTarget) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.filter(notTarget) } },
      };
    });

  const moveTour = (i: number, dir: -1 | 1) =>
    set((p) => {
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const target = i + dir;
      if (target < 0 || target >= hpItems.length) return p;

      const tempHp = hpItems[i];
      hpItems[i] = hpItems[target];
      hpItems[target] = tempHp;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems } },
      };
    });

  return (
    <div className="space-y-6">
      {deletePrompt && (
        <TourDeleteConfirmDialog
          isOpen={true}
          type={deletePrompt.type}
          tourTitle={deletePrompt.tour.title}
          onConfirm={() => {
            if (deletePrompt.type === 'soft') {
              softDeleteTour(deletePrompt.tour, deletePrompt.index);
            } else {
              permanentDeleteTour(deletePrompt.tour, deletePrompt.index);
            }
            setDeletePrompt(null);
          }}
          onCancel={() => setDeletePrompt(null)}
        />
      )}

      <SectionToggle title="Featured Tours" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, backgroundColor: v } } }))} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, [k]: v } } }))} 
      />

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 p-3.5 text-xs text-muted-foreground">
        <Compass className="h-4 w-4 shrink-0 text-primary mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Connected to {toursPageNavLabel} Directory</p>
          <p>
            The safari packages listed below are automatically synced with your <strong>{toursPageNavLabel}</strong> directory (`/tours`) and individual safari pages (`/tours/[slug]`).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Safari Packages ({toursList.length})</h4>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={addTour}>
            <Plus className="h-3.5 w-3.5" /> Add Safari Package
          </Button>
        </div>

        {toursList.map((t, i) => {
          const isDeleted = Boolean(t.deleted);
          return (
            <div
              key={t.id || `tour-${i}`}
              className={`relative rounded-lg border p-5 pt-11 transition-all ${
                isDeleted
                  ? 'border-dashed border-destructive/40 bg-muted/30 opacity-60'
                  : 'border-border bg-card shadow-xs'
              }`}
            >
              <div className="absolute top-2.5 left-4 right-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {!isDeleted ? (
                    <>
                      <Switch checked={t.enabled} onCheckedChange={(v) => updTour(i, 'enabled', v)} />
                      <span className="text-xs font-semibold text-muted-foreground">
                        Safari #{i + 1} {!t.enabled && '(Hidden)'}
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                      <Trash2 className="h-3 w-3" /> Inactive / Soft-Deleted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {!isDeleted ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === 0}
                        onClick={() => moveTour(i, -1)}
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === toursList.length - 1}
                        onClick={() => moveTour(i, 1)}
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletePrompt({ type: 'soft', tour: t, index: i })}
                        title="Soft delete safari (move to inactive)"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => restoreTour(t, i)}
                        title="Restore safari"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setDeletePrompt({ type: 'permanent', tour: t, index: i })}
                        title="Permanently delete safari"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Forever
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: isDeleted ? 0.6 : t.enabled ? 1 : 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showTitle !== false}
                      onCheckedChange={(v) => updTour(i, 'showTitle', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Title On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Title" id={`t-title-${i}`}>
                        <Input
                          id={`t-title-${i}`}
                          value={t.title}
                          onChange={(e) => updTour(i, 'title', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showTitle === false}
                          className={isDeleted ? 'line-through text-muted-foreground' : ''}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showBadge !== false}
                      onCheckedChange={(v) => updTour(i, 'showBadge', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Badge On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Badge" id={`t-badge-${i}`}>
                        <Input
                          id={`t-badge-${i}`}
                          value={t.badge}
                          onChange={(e) => updTour(i, 'badge', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showBadge === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showDuration !== false}
                      onCheckedChange={(v) => updTour(i, 'showDuration', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Duration On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Duration (e.g. Guided 6 - 8 hours Tour)" id={`t-dur-${i}`}>
                        <Input
                          id={`t-dur-${i}`}
                          value={t.duration}
                          onChange={(e) => updTour(i, 'duration', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showDuration === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showRating !== false}
                      onCheckedChange={(v) => updTour(i, 'showRating', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Rating On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Rating (0–5)" id={`t-rating-${i}`}>
                        <Input
                          id={`t-rating-${i}`}
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={t.rating}
                          onChange={(e) => updTour(i, 'rating', parseFloat(e.target.value) || 0)}
                          disabled={!t.enabled || isDeleted || t.showRating === false}
                        />
                      </FieldRow>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showPrice !== false}
                      onCheckedChange={(v) => updTour(i, 'showPrice', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Pricing On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Price Text" id={`t-price-${i}`}>
                        <Input
                          id={`t-price-${i}`}
                          value={t.price || ''}
                          placeholder="Contact for pricing"
                          onChange={(e) => updTour(i, 'price', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showPrice === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <FieldRow label="Custom URL (Leave blank for auto /tours/[slug])" id={`t-href-${i}`}>
                    <Input id={`t-href-${i}`} value={t.href || ''} placeholder="/tours/..." onChange={(e) => updTour(i, 'href', e.target.value)} disabled={!t.enabled || isDeleted} />
                  </FieldRow>
                </div>
                <FieldRow label="Tour Image" id={`t-img-${i}`}>
                  <ImageUploaderField
                    id={`t-img-${i}`}
                    value={t.imageUrl}
                    onChange={(url) => updTour(i, 'imageUrl', url)}
                    folder="tours"
                    placeholder="Upload or choose tour image..."
                    disabled={!t.enabled || isDeleted}
                  />
                </FieldRow>
                <FieldRow label="Description" id={`t-desc-${i}`}>
                  <textarea id={`t-desc-${i}`} rows={2} value={t.description}
                    onChange={(e) => updTour(i, 'description', e.target.value)}
                    disabled={!t.enabled || isDeleted}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
                </FieldRow>

                <div className="rounded-md bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground border border-border/50">
                  Single safari deep page details (inclusions, itinerary, single-page carousel) are managed under <strong>{toursPageNavLabel} &rarr; {toursSectionLabel}</strong>.
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
