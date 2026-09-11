import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { ImageUploaderField } from '../shared/ImageUploaderField';
import { TourDeleteConfirmDialog } from '../shared/TourDeleteConfirmDialog';
import { isTourMatch } from '../shared/admin-helpers';

export function ToursListEditor({ draft, set }: EditorProps) {
  const currentToursPage = draft.toursPage || defaultConfig.toursPage!;
  const data = currentToursPage.tours || defaultConfig.toursPage!.tours;
  const toursList = data.items || [];
  const [deletePrompt, setDeletePrompt] = useState<{ type: 'soft' | 'permanent'; tour: TourItem; index: number } | null>(null);

  const updEnabled = (v: boolean) => set((p) => {
    const current = p.toursPage || defaultConfig.toursPage!;
    const currentTours = current.tours || defaultConfig.toursPage!.tours;
    return { ...p, toursPage: { ...current, tours: { ...currentTours, enabled: v } } };
  });

  const updTour = (i: number, k: keyof TourItem, v: string | number | boolean | string[]) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const currentTours = currentToursPage.tours || defaultConfig.toursPage!.tours;
      const hpItems = [...(p.homepage?.tours?.items || defaultConfig.homepage.tours.items)];
      const tpItems = [...(currentTours.items || defaultConfig.toursPage!.tours.items)];

      const currentItem = tpItems[i];
      if (!currentItem) return p;

      tpItems[i] = { ...currentItem, [k]: v };

      const hpIdx = hpItems.findIndex((t, idx) => isTourMatch(t, currentItem, idx, i));
      if (hpIdx !== -1) {
        hpItems[hpIdx] = { ...hpItems[hpIdx], [k]: v };
      } else if (hpItems[i]) {
        hpItems[i] = { ...hpItems[i], [k]: v };
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
        homepage: { ...p.homepage, tours: { ...(p.homepage?.tours || defaultConfig.homepage.tours), items: newHpItems } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: newTpItems } },
      };
    });

  const softDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const currentTours = currentToursPage.tours || defaultConfig.toursPage!.tours;
      const hpItems = [...(p.homepage?.tours?.items || defaultConfig.homepage.tours.items)];
      const tpItems = [...(currentTours.items || defaultConfig.toursPage!.tours.items)];

      const markSoftDeleted = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: true, enabled: false, deletedAt: new Date().toISOString() }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markSoftDeleted) } },
        toursPage: { ...currentToursPage, tours: { ...currentTours, items: tpItems.map(markSoftDeleted) } },
      };
    });

  const restoreTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const currentTours = currentToursPage.tours || defaultConfig.toursPage!.tours;
      const hpItems = [...(p.homepage?.tours?.items || defaultConfig.homepage.tours.items)];
      const tpItems = [...(currentTours.items || defaultConfig.toursPage!.tours.items)];

      const markRestored = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: false, enabled: true, deletedAt: undefined }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markRestored) } },
        toursPage: { ...currentToursPage, tours: { ...currentTours, items: tpItems.map(markRestored) } },
      };
    });

  const permanentDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const currentTours = currentToursPage.tours || defaultConfig.toursPage!.tours;
      const hpItems = [...(p.homepage?.tours?.items || defaultConfig.homepage.tours.items)];
      const tpItems = [...(currentTours.items || defaultConfig.toursPage!.tours.items)];

      const notTarget = (t: TourItem, idx: number) => !isTourMatch(t, targetTour, idx, targetIndex);

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.filter(notTarget) } },
        toursPage: { ...currentToursPage, tours: { ...currentTours, items: tpItems.filter(notTarget) } },
      };
    });

  const moveTour = (i: number, dir: -1 | 1) =>
    set((p) => {
      const current = p.toursPage || defaultConfig.toursPage!;
      const currentTours = current.tours || defaultConfig.toursPage!.tours;
      const tpItems = [...(currentTours.items || defaultConfig.toursPage!.tours.items)];
      const target = i + dir;
      if (target < 0 || target >= tpItems.length) return p;

      const tempTp = tpItems[i];
      tpItems[i] = tpItems[target];
      tpItems[target] = tempTp;

      return {
        ...p,
        toursPage: {
          ...current,
          tours: {
            ...currentTours,
            items: tpItems,
          },
        },
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

      <SectionToggle title="Safaris Listing Section" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => {
        const current = p.toursPage || defaultConfig.toursPage!;
        return { ...p, toursPage: { ...current, tours: { ...current.tours, backgroundColor: v } } };
      })} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => {
          const current = p.toursPage || defaultConfig.toursPage!;
          return { ...p, toursPage: { ...current, tours: { ...current.tours, [k]: v } } };
        })} 
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Safari Packages ({toursList.length})</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTour}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Add Safari Package
          </Button>
        </div>

        {toursList.map((t, i) => {
          const isDeleted = Boolean(t.deleted);
          return (
            <div
              key={t.id || `tpl-${i}`}
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
                      title="Toggle Title On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Title" id={`tp-title-${i}`}>
                        <Input
                          id={`tp-title-${i}`}
                          value={t.title}
                          onChange={(e) => updTour(i, 'title', e.target.value)}
                          disabled={!t.enabled || isDeleted}
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
                      title="Toggle Badge On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Badge" id={`tp-badge-${i}`}>
                        <Input
                          id={`tp-badge-${i}`}
                          value={t.badge || ''}
                          onChange={(e) => updTour(i, 'badge', e.target.value)}
                          disabled={!t.enabled || isDeleted}
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
                      title="Toggle Duration On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Duration" id={`tp-dur-${i}`}>
                        <Input
                          id={`tp-dur-${i}`}
                          value={t.duration || ''}
                          onChange={(e) => updTour(i, 'duration', e.target.value)}
                          disabled={!t.enabled || isDeleted}
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
                      title="Toggle Rating On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Rating (0–5)" id={`tp-rating-${i}`}>
                        <Input
                          id={`tp-rating-${i}`}
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={t.rating}
                          onChange={(e) => updTour(i, 'rating', parseFloat(e.target.value) || 0)}
                          disabled={!t.enabled || isDeleted}
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
                      title="Toggle Pricing On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Price Text" id={`tp-price-${i}`}>
                        <Input
                          id={`tp-price-${i}`}
                          value={t.price || ''}
                          placeholder="Contact for pricing"
                          onChange={(e) => updTour(i, 'price', e.target.value)}
                          disabled={!t.enabled || isDeleted}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <FieldRow label="Custom URL" id={`tp-href-${i}`}>
                    <Input
                      id={`tp-href-${i}`}
                      value={t.href || ''}
                      placeholder="/tours/..."
                      onChange={(e) => updTour(i, 'href', e.target.value)}
                      disabled={!t.enabled || isDeleted}
                    />
                  </FieldRow>
                </div>

                <FieldRow label="Safari Card & Gallery Main Image" id={`tp-img-${i}`}>
                  <ImageUploaderField
                    id={`tp-img-${i}`}
                    value={t.imageUrl}
                    onChange={(url) => updTour(i, 'imageUrl', url)}
                    folder="tours"
                    placeholder="Cover photo..."
                    disabled={!t.enabled || isDeleted}
                  />
                </FieldRow>

                <FieldRow label="Card Short Description" id={`tp-desc-${i}`}>
                  <textarea
                    id={`tp-desc-${i}`}
                    rows={2}
                    value={t.description}
                    onChange={(e) => updTour(i, 'description', e.target.value)}
                    disabled={!t.enabled || isDeleted}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none disabled:opacity-75"
                  />
                </FieldRow>

                {/* Single Tour Page Details Accordion */}
                <details open={!isDeleted} className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-4">
                  <summary className="cursor-pointer text-xs font-semibold text-foreground flex items-center justify-between select-none">
                    <span className="flex items-center gap-1.5 text-primary font-bold">
                      <Compass className="h-3.5 w-3.5" /> Single Safari Page Details (Overview, Included, Location, Info, Carousel)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">▼ Collapse / Expand</span>
                  </summary>
                  
                  <div className="space-y-4 pt-3 border-t border-border/60">
                    {/* Hero Background & Carousel Photos */}
                    <div className="rounded-lg border border-border p-4 bg-background space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Single Safari Hero & Carousel Photos</h5>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Configure the hero background color, backdrop image, and the interactive photo carousel for this single safari detail page.
                        </p>
                      </div>

                      <BackgroundColorPicker
                        label="Hero Background Color"
                        desc="Custom hero background color when no hero image is set or behind the overlay."
                        value={t.heroBackgroundColor || '#1b4332'}
                        onChange={(v) => updTour(i, 'heroBackgroundColor', v)}
                      />

                      <FieldRow label="Hero Background Image (Behind Title)" id={`tp-hero-img-${i}`}>
                        <ImageUploaderField
                          id={`tp-hero-img-${i}`}
                          value={t.heroImageUrl || ''}
                          onChange={(url) => updTour(i, 'heroImageUrl', url)}
                          folder="hero"
                          placeholder="Select hero background image (Optional)..."
                          disabled={!t.enabled || isDeleted}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Optional hero backdrop image with dark ambient gradient overlay.</p>
                      </FieldRow>

                      <BackgroundColorPicker
                        label="Carousel Indicator Color"
                        desc="Pick a custom color for the active carousel dot indicators."
                        value={t.indicatorColor || '#d97706'}
                        onChange={(v) => updTour(i, 'indicatorColor', v)}
                      />

                      <div className="space-y-3 pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold">Carousel Photos (Like Catch Gallery)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                              const currentGallery = t.gallery && t.gallery.length > 0 ? t.gallery : [baseImg, baseImg, baseImg];
                              updTour(i, 'gallery', [...currentGallery, '/images/hero/hero.jpg']);
                            }}
                            disabled={!t.enabled || isDeleted}
                            className="gap-1.5 h-7 text-xs"
                          >
                            <Plus className="h-3 w-3" /> Add Carousel Photo
                          </Button>
                        </div>

                        <div className="space-y-2.5">
                          {(t.gallery && t.gallery.length > 0 ? t.gallery : [t.imageUrl || '/images/hero/hero.jpg', t.imageUrl || '/images/hero/hero.jpg', t.imageUrl || '/images/hero/hero.jpg']).map((imgUrl, gIdx) => {
                            const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                            const currentGallery = t.gallery && t.gallery.length > 0 ? t.gallery : [baseImg, baseImg, baseImg];
                            const updGalleryImg = (newUrl: string) => {
                              const updated = [...currentGallery];
                              updated[gIdx] = newUrl;
                              updTour(i, 'gallery', updated);
                            };
                            const removeGalleryImg = () => {
                              const updated = currentGallery.filter((_, idx) => idx !== gIdx);
                              const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                              updTour(i, 'gallery', updated.length > 0 ? updated : [baseImg, baseImg, baseImg]);
                            };
                            const moveGalleryImg = (dir: 'up' | 'down') => {
                              const target = dir === 'up' ? gIdx - 1 : gIdx + 1;
                              if (target < 0 || target >= currentGallery.length) return;
                              const updated = [...currentGallery];
                              const temp = updated[gIdx];
                              updated[gIdx] = updated[target];
                              updated[target] = temp;
                              updTour(i, 'gallery', updated);
                            };

                            return (
                              <div key={gIdx} className="flex items-center gap-2 rounded-lg border border-border p-2.5 bg-card shadow-xs">
                                <span className="text-xs font-mono font-medium text-muted-foreground w-6 text-center">{gIdx + 1}</span>
                                <div className="flex-1">
                                  <ImageUploaderField
                                    id={`tp-gal-${i}-${gIdx}`}
                                    value={imgUrl}
                                    onChange={updGalleryImg}
                                    folder="tours"
                                    placeholder="Choose carousel photo..."
                                    disabled={!t.enabled || isDeleted}
                                  />
                                </div>
                                <div className="flex items-center gap-0.5">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    disabled={gIdx === 0 || !t.enabled || isDeleted}
                                    onClick={() => moveGalleryImg('up')}
                                    title="Move up"
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    disabled={gIdx === currentGallery.length - 1 || !t.enabled || isDeleted}
                                    onClick={() => moveGalleryImg('down')}
                                    title="Move down"
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                    disabled={!t.enabled || currentGallery.length <= 1 || isDeleted}
                                    onClick={removeGalleryImg}
                                    title="Delete photo"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Quick Info Strip Bar (Hours, Location, Schedule, Group Suitability) */}
                    <div className="rounded-lg border border-border p-4 bg-background space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Quick Info Strip Bar (Hours, Location, Schedule, Group Suitability)</h5>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Configure the quick metadata pills displayed in the strip bar right below the single safari hero carousel.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showDuration !== false}
                            onCheckedChange={(v) => updTour(i, 'showDuration', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Duration / Hours On/Off in Strip Bar"
                          />
                          <div className="flex-1">
                            <FieldRow label="Hours / Duration" id={`tp-dur-strip-${i}`}>
                              <Input
                                id={`tp-dur-strip-${i}`}
                                value={t.duration || ''}
                                placeholder="e.g. Guided 6 - 8 hours Tour"
                                onChange={(e) => updTour(i, 'duration', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showDuration === false}
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showLocation !== false}
                            onCheckedChange={(v) => updTour(i, 'showLocation', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Location Strip Text On/Off"
                          />
                          <div className="flex-1">
                            <FieldRow label="Location Strip Text" id={`tp-loc-${i}`}>
                              <Input
                                id={`tp-loc-${i}`}
                                value={t.location || ''}
                                placeholder="e.g. Watamu Marine Park, Kilifi County"
                                onChange={(e) => updTour(i, 'location', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showLocation === false}
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showSchedule !== false}
                            onCheckedChange={(v) => updTour(i, 'showSchedule', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Schedule Strip Text On/Off"
                          />
                          <div className="flex-1">
                            <FieldRow label="Schedule / Season Text" id={`tp-sched-${i}`}>
                              <Input
                                id={`tp-sched-${i}`}
                                value={t.schedule || ''}
                                placeholder="e.g. Morning Slots (November To March)"
                                onChange={(e) => updTour(i, 'schedule', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showSchedule === false}
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showGroupType !== false}
                            onCheckedChange={(v) => updTour(i, 'showGroupType', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Group Suitability Text On/Off"
                          />
                          <div className="flex-1">
                            <FieldRow label="Group Suitability Text" id={`tp-grp-${i}`}>
                              <Input
                                id={`tp-grp-${i}`}
                                value={t.groupType || ''}
                                placeholder="e.g. Families · Private · Groups"
                                onChange={(e) => updTour(i, 'groupType', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showGroupType === false}
                              />
                            </FieldRow>
                          </div>
                        </div>
                      </div>
                    </div>

                    <FieldRow label="Full Tour Overview (Main Article)" id={`tp-over-${i}`}>
                      <textarea
                        id={`tp-over-${i}`}
                        rows={3}
                        value={t.overview || ''}
                        placeholder="Full detailed narrative description for the single tour page..."
                        onChange={(e) => updTour(i, 'overview', e.target.value)}
                        disabled={!t.enabled || isDeleted}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                      />
                    </FieldRow>

                    <div className="flex gap-2.5 items-start">
                      <Switch
                        checked={t.showIncluded !== false}
                        onCheckedChange={(v) => updTour(i, 'showIncluded', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle What's Included On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="What's Included (1 item per line)" id={`tp-inc-${i}`}>
                          <textarea
                            id={`tp-inc-${i}`}
                            rows={3}
                            value={(t.included || []).join('\n')}
                            placeholder="Heavy tackle Penn & Shimano rods&#10;Live bait & lures&#10;Marine park entry permits&#10;Seafood lunch & drinks"
                            onChange={(e) =>
                              updTour(
                                i,
                                'included',
                                e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              )
                            }
                            disabled={!t.enabled || isDeleted || t.showIncluded === false}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </FieldRow>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <Switch
                        checked={t.showNotIncluded !== false}
                        onCheckedChange={(v) => updTour(i, 'showNotIncluded', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle What's Not Included On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="What's Not Included (1 item per line)" id={`tp-notinc-${i}`}>
                          <textarea
                            id={`tp-notinc-${i}`}
                            rows={3}
                            value={(t.notIncluded || []).join('\n')}
                            placeholder="Crew gratuities and tips (optional)&#10;Hotel pickup & return transfers&#10;Personal swimwear & towels&#10;Alcoholic beverages"
                            onChange={(e) =>
                              updTour(
                                i,
                                'notIncluded',
                                e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              )
                            }
                            disabled={!t.enabled || isDeleted || t.showNotIncluded === false}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </FieldRow>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <Switch
                        checked={t.showWhyChoose !== false}
                        onCheckedChange={(v) => updTour(i, 'showWhyChoose', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle Why Choose This Tour On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="Why Choose This Tour (1 item per line)" id={`tp-why-${i}`}>
                          <textarea
                            id={`tp-why-${i}`}
                            rows={3}
                            value={(t.whyChoose || []).join('\n')}
                            placeholder="Twin-engine sportfisher with fighting chair&#10;IGFA certified captain with 20+ years experience&#10;Strict billfish conservation policy"
                            onChange={(e) =>
                              updTour(
                                i,
                                'whyChoose',
                                e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              )
                            }
                            disabled={!t.enabled || isDeleted || t.showWhyChoose === false}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </FieldRow>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <Switch
                        checked={t.showKnowBeforeYouGo !== false}
                        onCheckedChange={(v) => updTour(i, 'showKnowBeforeYouGo', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle Know Before You Go On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="Know Before You Go (1 item per line)" id={`tp-know-${i}`}>
                          <textarea
                            id={`tp-know-${i}`}
                            rows={3}
                            value={(t.knowBeforeYouGo || []).join('\n')}
                            placeholder="Departure: 6:00 AM from Watamu Marine Park Gate&#10;Duration: Approx. 8 hours&#10;What to bring: Polarized sunglasses, reef-safe sunscreen"
                            onChange={(e) =>
                              updTour(
                                i,
                                'knowBeforeYouGo',
                                e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              )
                            }
                            disabled={!t.enabled || isDeleted || t.showKnowBeforeYouGo === false}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </FieldRow>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 space-y-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Single Safari SEO & Meta
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldRow label="Meta Title (Optional)" id={`tp-mtitle-${i}`}>
                          <Input
                            id={`tp-mtitle-${i}`}
                            value={t.metaTitle || ''}
                            placeholder={t.title ? `${t.title} | Safari Tours Kenya` : 'e.g. Maasai Mara Big Five | Safari Tours Kenya'}
                            onChange={(e) => updTour(i, 'metaTitle', e.target.value)}
                            disabled={!t.enabled || isDeleted}
                          />
                        </FieldRow>
                        <FieldRow label="Meta Description (Optional)" id={`tp-mdesc-${i}`}>
                          <textarea
                            id={`tp-mdesc-${i}`}
                            rows={2}
                            value={t.metaDescription || ''}
                            placeholder="Overrides default meta description for this single safari page..."
                            onChange={(e) => updTour(i, 'metaDescription', e.target.value)}
                            disabled={!t.enabled || isDeleted}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                          />
                        </FieldRow>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
