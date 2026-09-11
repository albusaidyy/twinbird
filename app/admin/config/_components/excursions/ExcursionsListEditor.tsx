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
import type { ExcursionItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { ImageUploaderField } from '../shared/ImageUploaderField';
import { TourDeleteConfirmDialog } from '../shared/TourDeleteConfirmDialog';
import { isExcursionMatch } from '@/lib/excursion-utils';

export function ExcursionsListEditor({ draft, set }: EditorProps) {
  const currentExcursionsPage = draft.excursionsPage || defaultConfig.excursionsPage!;
  const data = currentExcursionsPage.tours || defaultConfig.excursionsPage!.tours;
  const excursionsList: ExcursionItem[] = data.items || [];
  const [deletePrompt, setDeletePrompt] = useState<{ type: 'soft' | 'permanent'; excursion: ExcursionItem; index: number } | null>(null);

  const updEnabled = (v: boolean) => set((p) => {
    const current = p.excursionsPage || defaultConfig.excursionsPage!;
    const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
    return { ...p, excursionsPage: { ...current, tours: { ...currentTours, enabled: v } } };
  });

  const updExcursion = (i: number, k: keyof ExcursionItem, v: string | number | boolean | string[] | undefined) =>
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      const items = [...(currentTours.items || defaultConfig.excursionsPage!.tours.items)];

      const currentItem = items[i];
      if (!currentItem) return p;

      items[i] = { ...currentItem, [k]: v };

      return {
        ...p,
        excursionsPage: { ...current, tours: { ...currentTours, items } },
      };
    });

  const addExcursion = () => {
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      const items = [...(currentTours.items || [])];

      const newId = `exc_${Date.now()}`;
      const newExcursion: ExcursionItem = {
        id: newId,
        title: 'New Coastal Excursion',
        slug: 'new-coastal-excursion',
        badge: 'Day Adventure',
        duration: 'Full Day · 8 Hours',
        rating: 4.9,
        price: 'From $95 / person',
        href: `/excursions/${newId}`,
        imageUrl: '/images/hero/hero.jpg',
        description: 'Experience an unforgettable coastal day trip and marine exploration.',
        overview: 'Join our experienced local skippers and guides for an enriching day trip packed with scenic beauty, wildlife encounters, and cultural immersion.',
        location: 'Coast of Kenya',
        schedule: 'Daily Departures · 7:30 AM',
        groupType: 'Families · Couples · Small Groups',
        included: [
          'Professional guide & boat captain',
          'Snorkeling & safety equipment',
          'Marine park conservation fees',
          'Fresh seafood lunch & refreshments',
        ],
        notIncluded: [
          'Hotel pickup & return transfers',
          'Crew tips and gratuities',
          'Personal swimwear and towels',
        ],
        whyChoose: [
          'Experienced licensed marine guides',
          'Modern equipment & strict safety standards',
          'Authentic local seafood and hospitality',
        ],
        knowBeforeYouGo: [
          'Bring biodegradable reef-safe sunscreen',
          'Wear comfortable swimwear and deck shoes',
          'Underwater cameras or dry bags recommended',
        ],
        gallery: ['/images/hero/hero.jpg', '/images/hero/hero.jpg'],
        enabled: true,
        showTitle: true,
        showBadge: true,
        showDuration: true,
        showRating: true,
        showPrice: true,
        showLocation: true,
        showSchedule: true,
        showGroupType: true,
        showIncluded: true,
        showNotIncluded: true,
        showWhyChoose: true,
        showKnowBeforeYouGo: true,
      };

      return {
        ...p,
        excursionsPage: {
          ...current,
          tours: {
            ...currentTours,
            items: [...items, newExcursion],
          },
        },
      };
    });
  };

  const softDeleteExcursion = (targetExcursion: ExcursionItem, targetIndex: number) =>
    set((p) => {
      const current = p.excursionsPage || currentExcursionsPage;
      const currentTours = current.tours || data;
      const items = [...(currentTours.items || [])];

      const markSoftDeleted = (t: ExcursionItem, idx: number) =>
        isExcursionMatch(t, targetExcursion, idx, targetIndex)
          ? { ...t, deleted: true, enabled: false, deletedAt: new Date().toISOString() }
          : t;

      return {
        ...p,
        excursionsPage: { ...current, tours: { ...currentTours, items: items.map(markSoftDeleted) } },
      };
    });

  const restoreExcursion = (targetExcursion: ExcursionItem, targetIndex: number) =>
    set((p) => {
      const current = p.excursionsPage || currentExcursionsPage;
      const currentTours = current.tours || data;
      const items = [...(currentTours.items || [])];

      const markRestored = (t: ExcursionItem, idx: number) =>
        isExcursionMatch(t, targetExcursion, idx, targetIndex)
          ? { ...t, deleted: false, enabled: true, deletedAt: undefined }
          : t;

      return {
        ...p,
        excursionsPage: { ...current, tours: { ...currentTours, items: items.map(markRestored) } },
      };
    });

  const permanentDeleteExcursion = (targetExcursion: ExcursionItem, targetIndex: number) =>
    set((p) => {
      const current = p.excursionsPage || currentExcursionsPage;
      const currentTours = current.tours || data;
      const items = [...(currentTours.items || [])];

      const notTarget = (t: ExcursionItem, idx: number) => !isExcursionMatch(t, targetExcursion, idx, targetIndex);

      return {
        ...p,
        excursionsPage: { ...current, tours: { ...currentTours, items: items.filter(notTarget) } },
      };
    });

  const moveExcursion = (i: number, dir: -1 | 1) =>
    set((p) => {
      const current = p.excursionsPage || currentExcursionsPage;
      const currentTours = current.tours || data;
      const items = [...(currentTours.items || [])];
      const target = i + dir;
      if (target < 0 || target >= items.length) return p;

      const temp = items[i];
      items[i] = items[target];
      items[target] = temp;

      return {
        ...p,
        excursionsPage: {
          ...current,
          tours: {
            ...currentTours,
            items,
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
          tourTitle={deletePrompt.excursion.title}
          onConfirm={() => {
            if (deletePrompt.type === 'soft') {
              softDeleteExcursion(deletePrompt.excursion, deletePrompt.index);
            } else {
              permanentDeleteExcursion(deletePrompt.excursion, deletePrompt.index);
            }
            setDeletePrompt(null);
          }}
          onCancel={() => setDeletePrompt(null)}
        />
      )}

      <SectionToggle title="Excursions Listing Section" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => {
        const current = p.excursionsPage || defaultConfig.excursionsPage!;
        return { ...p, excursionsPage: { ...current, tours: { ...current.tours, backgroundColor: v } } };
      })} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => {
          const current = p.excursionsPage || defaultConfig.excursionsPage!;
          return { ...p, excursionsPage: { ...current, tours: { ...current.tours, [k]: v } } };
        })} 
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Excursion Packages ({excursionsList.length})</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExcursion}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Add Excursion Package
          </Button>
        </div>

        {excursionsList.map((t, i) => {
          const isDeleted = Boolean(t.deleted);
          return (
            <div
              key={t.id || `expl-${i}`}
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
                      <Switch checked={t.enabled} onCheckedChange={(v) => updExcursion(i, 'enabled', v)} />
                      <span className="text-xs font-semibold text-muted-foreground">
                        Excursion #{i + 1} {!t.enabled && '(Hidden)'}
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
                        onClick={() => moveExcursion(i, -1)}
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === excursionsList.length - 1}
                        onClick={() => moveExcursion(i, 1)}
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletePrompt({ type: 'soft', excursion: t, index: i })}
                        title="Soft delete excursion"
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
                        onClick={() => restoreExcursion(t, i)}
                        title="Restore excursion"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setDeletePrompt({ type: 'permanent', excursion: t, index: i })}
                        title="Permanently delete excursion"
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
                      onCheckedChange={(v) => updExcursion(i, 'showTitle', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Title On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Title" id={`exp-title-${i}`}>
                        <Input
                          id={`exp-title-${i}`}
                          value={t.title}
                          onChange={(e) => updExcursion(i, 'title', e.target.value)}
                          disabled={!t.enabled || isDeleted}
                          className={isDeleted ? 'line-through text-muted-foreground' : ''}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showBadge !== false}
                      onCheckedChange={(v) => updExcursion(i, 'showBadge', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Badge On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Badge" id={`exp-badge-${i}`}>
                        <Input
                          id={`exp-badge-${i}`}
                          value={t.badge || ''}
                          onChange={(e) => updExcursion(i, 'badge', e.target.value)}
                          disabled={!t.enabled || isDeleted}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showDuration !== false}
                      onCheckedChange={(v) => updExcursion(i, 'showDuration', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Duration On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Duration" id={`exp-dur-${i}`}>
                        <Input
                          id={`exp-dur-${i}`}
                          value={t.duration || ''}
                          onChange={(e) => updExcursion(i, 'duration', e.target.value)}
                          disabled={!t.enabled || isDeleted}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showRating !== false}
                      onCheckedChange={(v) => updExcursion(i, 'showRating', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Rating On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Rating (0–5)" id={`exp-rating-${i}`}>
                        <Input
                          id={`exp-rating-${i}`}
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={t.rating}
                          onChange={(e) => updExcursion(i, 'rating', parseFloat(e.target.value) || 0)}
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
                      onCheckedChange={(v) => updExcursion(i, 'showPrice', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Pricing On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Price Text" id={`exp-price-${i}`}>
                        <Input
                          id={`exp-price-${i}`}
                          value={t.price || ''}
                          placeholder="Contact for pricing"
                          onChange={(e) => updExcursion(i, 'price', e.target.value)}
                          disabled={!t.enabled || isDeleted}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <FieldRow label="Custom URL / Slug" id={`exp-href-${i}`}>
                    <Input
                      id={`exp-href-${i}`}
                      value={t.href || ''}
                      placeholder="/excursions/..."
                      onChange={(e) => updExcursion(i, 'href', e.target.value)}
                      disabled={!t.enabled || isDeleted}
                    />
                  </FieldRow>
                </div>

                <FieldRow label="Cover Photo" id={`exp-img-${i}`}>
                  <ImageUploaderField
                    id={`exp-img-${i}`}
                    value={t.imageUrl}
                    onChange={(url) => updExcursion(i, 'imageUrl', url)}
                    folder="tours"
                    placeholder="Cover photo..."
                    disabled={!t.enabled || isDeleted}
                  />
                </FieldRow>

                <FieldRow label="Card Short Description" id={`exp-desc-${i}`}>
                  <textarea
                    id={`exp-desc-${i}`}
                    rows={2}
                    value={t.description}
                    onChange={(e) => updExcursion(i, 'description', e.target.value)}
                    disabled={!t.enabled || isDeleted}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none disabled:opacity-75"
                  />
                </FieldRow>

                {/* Single Excursion Page Details Accordion */}
                <details open={!isDeleted} className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-4">
                  <summary className="cursor-pointer text-xs font-semibold text-foreground flex items-center justify-between select-none">
                    <span className="flex items-center gap-1.5 text-primary font-bold">
                      <Compass className="h-3.5 w-3.5" /> Single Excursion Page Details (Overview, Included, Location, Info, Carousel)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">▼ Collapse / Expand</span>
                  </summary>
                  
                  <div className="space-y-4 pt-3 border-t border-border/60">
                    {/* Hero Background & Carousel Photos */}
                    <div className="rounded-lg border border-border p-4 bg-background space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Single Excursion Hero & Carousel Photos</h5>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Configure the hero background color, backdrop image, and the interactive photo carousel for this single excursion detail page.
                        </p>
                      </div>

                      <BackgroundColorPicker
                        label="Hero Background Color"
                        desc="Custom hero background color when no hero image is set or behind the overlay."
                        value={t.heroBackgroundColor || '#0f766e'}
                        onChange={(v) => updExcursion(i, 'heroBackgroundColor', v)}
                      />

                      <FieldRow label="Hero Background Image (Behind Title)" id={`exp-hero-img-${i}`}>
                        <ImageUploaderField
                          id={`exp-hero-img-${i}`}
                          value={t.heroImageUrl || ''}
                          onChange={(url) => updExcursion(i, 'heroImageUrl', url)}
                          folder="hero"
                          placeholder="Select hero background image (Optional)..."
                          disabled={!t.enabled || isDeleted}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Optional hero backdrop image with dark ambient gradient overlay.</p>
                      </FieldRow>

                      <BackgroundColorPicker
                        label="Carousel Indicator Color"
                        desc="Pick a custom color for the active carousel dot indicators."
                        value={t.indicatorColor || '#0ea5e9'}
                        onChange={(v) => updExcursion(i, 'indicatorColor', v)}
                      />

                      <div className="space-y-3 pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold">Carousel Photos</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                              const currentGallery = t.gallery && t.gallery.length > 0 ? t.gallery : [baseImg, baseImg];
                              updExcursion(i, 'gallery', [...currentGallery, '/images/hero/hero.jpg']);
                            }}
                            disabled={!t.enabled || isDeleted}
                            className="gap-1.5 h-7 text-xs"
                          >
                            <Plus className="h-3 w-3" /> Add Carousel Photo
                          </Button>
                        </div>

                        <div className="space-y-2.5">
                          {(t.gallery && t.gallery.length > 0 ? t.gallery : [t.imageUrl || '/images/hero/hero.jpg', t.imageUrl || '/images/hero/hero.jpg']).map((imgUrl, gIdx) => {
                            const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                            const currentGallery = t.gallery && t.gallery.length > 0 ? t.gallery : [baseImg, baseImg];
                            const updGalleryImg = (newUrl: string) => {
                              const updated = [...currentGallery];
                              updated[gIdx] = newUrl;
                              updExcursion(i, 'gallery', updated);
                            };
                            const removeGalleryImg = () => {
                              const updated = currentGallery.filter((_, idx) => idx !== gIdx);
                              const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                              updExcursion(i, 'gallery', updated.length > 0 ? updated : [baseImg, baseImg]);
                            };
                            const moveGalleryImg = (dir: 'up' | 'down') => {
                              const target = dir === 'up' ? gIdx - 1 : gIdx + 1;
                              if (target < 0 || target >= currentGallery.length) return;
                              const updated = [...currentGallery];
                              const temp = updated[gIdx];
                              updated[gIdx] = updated[target];
                              updated[target] = temp;
                              updExcursion(i, 'gallery', updated);
                            };

                            return (
                              <div key={gIdx} className="flex items-center gap-2 rounded-lg border border-border p-2.5 bg-card shadow-xs">
                                <span className="text-xs font-mono font-medium text-muted-foreground w-6 text-center">{gIdx + 1}</span>
                                <div className="flex-1">
                                  <ImageUploaderField
                                    id={`exp-gal-${i}-${gIdx}`}
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
                        <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Quick Info Strip Bar</h5>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Configure the quick metadata pills displayed in the strip bar right below the single excursion hero carousel.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showDuration !== false}
                            onCheckedChange={(v) => updExcursion(i, 'showDuration', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Duration / Hours On/Off in Strip Bar"
                          />
                          <div className="flex-1">
                            <FieldRow label="Hours / Duration" id={`exp-dur-strip-${i}`}>
                              <Input
                                id={`exp-dur-strip-${i}`}
                                value={t.duration || ''}
                                placeholder="e.g. Guided 6 - 8 hours Tour"
                                onChange={(e) => updExcursion(i, 'duration', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showDuration === false}
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showLocation !== false}
                            onCheckedChange={(v) => updExcursion(i, 'showLocation', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Location Strip Text On/Off"
                          />
                          <div className="flex-1">
                            <FieldRow label="Location Strip Text" id={`exp-loc-${i}`}>
                              <Input
                                id={`exp-loc-${i}`}
                                value={t.location || ''}
                                placeholder="e.g. Watamu Marine Park, Kilifi"
                                onChange={(e) => updExcursion(i, 'location', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showLocation === false}
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showSchedule !== false}
                            onCheckedChange={(v) => updExcursion(i, 'showSchedule', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Schedule Strip Text On/Off"
                          />
                          <div className="flex-1">
                            <FieldRow label="Schedule / Season Text" id={`exp-sched-${i}`}>
                              <Input
                                id={`exp-sched-${i}`}
                                value={t.schedule || ''}
                                placeholder="e.g. Morning Slots (Nov to Mar)"
                                onChange={(e) => updExcursion(i, 'schedule', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showSchedule === false}
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showGroupType !== false}
                            onCheckedChange={(v) => updExcursion(i, 'showGroupType', v)}
                            disabled={!t.enabled || isDeleted}
                            className="mt-8"
                            title="Toggle Group Suitability Text On/Off"
                          />
                          <div className="flex-1">
                            <FieldRow label="Group Suitability Text" id={`exp-grp-${i}`}>
                              <Input
                                id={`exp-grp-${i}`}
                                value={t.groupType || ''}
                                placeholder="e.g. Families · Private · Groups"
                                onChange={(e) => updExcursion(i, 'groupType', e.target.value)}
                                disabled={!t.enabled || isDeleted || t.showGroupType === false}
                              />
                            </FieldRow>
                          </div>
                        </div>
                      </div>
                    </div>

                    <FieldRow label="Full Excursion Overview (Main Article)" id={`exp-over-${i}`}>
                      <textarea
                        id={`exp-over-${i}`}
                        rows={3}
                        value={t.overview || ''}
                        placeholder="Full detailed narrative description for the single excursion page..."
                        onChange={(e) => updExcursion(i, 'overview', e.target.value)}
                        disabled={!t.enabled || isDeleted}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                      />
                    </FieldRow>

                    <div className="flex gap-2.5 items-start">
                      <Switch
                        checked={t.showIncluded !== false}
                        onCheckedChange={(v) => updExcursion(i, 'showIncluded', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle What's Included On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="What's Included (1 item per line)" id={`exp-inc-${i}`}>
                          <textarea
                            id={`exp-inc-${i}`}
                            rows={3}
                            value={(t.included || []).join('\n')}
                            placeholder="Professional guide&#10;Marine park entry permits&#10;Fresh lunch & drinks"
                            onChange={(e) =>
                              updExcursion(
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
                        onCheckedChange={(v) => updExcursion(i, 'showNotIncluded', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle What's Not Included On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="What's Not Included (1 item per line)" id={`exp-notinc-${i}`}>
                          <textarea
                            id={`exp-notinc-${i}`}
                            rows={3}
                            value={(t.notIncluded || []).join('\n')}
                            placeholder="Guide gratuities and tips&#10;Hotel pickup & return transfers&#10;Personal swimwear & towels"
                            onChange={(e) =>
                              updExcursion(
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
                        onCheckedChange={(v) => updExcursion(i, 'showWhyChoose', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle Why Choose This Excursion On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="Why Choose This Excursion (1 item per line)" id={`exp-why-${i}`}>
                          <textarea
                            id={`exp-why-${i}`}
                            rows={3}
                            value={(t.whyChoose || []).join('\n')}
                            placeholder="Licensed local marine skippers&#10;Modern snorkeling & safety equipment&#10;Authentic Swahili seafood lunch"
                            onChange={(e) =>
                              updExcursion(
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
                        onCheckedChange={(v) => updExcursion(i, 'showKnowBeforeYouGo', v)}
                        disabled={!t.enabled || isDeleted}
                        className="mt-8"
                        title="Toggle Know Before You Go On/Off"
                      />
                      <div className="flex-1">
                        <FieldRow label="Know Before You Go (1 item per line)" id={`exp-know-${i}`}>
                          <textarea
                            id={`exp-know-${i}`}
                            rows={3}
                            value={(t.knowBeforeYouGo || []).join('\n')}
                            placeholder="Departure: 7:30 AM from Jetty&#10;Duration: Approx. 6 - 8 hours&#10;What to bring: Sunscreen, towel, camera"
                            onChange={(e) =>
                              updExcursion(
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
                        Single Excursion SEO & Meta
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldRow label="Meta Title (Optional)" id={`exp-mtitle-${i}`}>
                          <Input
                            id={`exp-mtitle-${i}`}
                            value={t.metaTitle || ''}
                            placeholder={t.title ? `${t.title} | Excursions Kenya` : 'e.g. Wasini Dolphin Dhow Cruise | Excursions Kenya'}
                            onChange={(e) => updExcursion(i, 'metaTitle', e.target.value)}
                            disabled={!t.enabled || isDeleted}
                          />
                        </FieldRow>
                        <FieldRow label="Meta Description (Optional)" id={`exp-mdesc-${i}`}>
                          <textarea
                            id={`exp-mdesc-${i}`}
                            rows={2}
                            value={t.metaDescription || ''}
                            placeholder="Overrides default meta description for this single excursion page..."
                            onChange={(e) => updExcursion(i, 'metaDescription', e.target.value)}
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
