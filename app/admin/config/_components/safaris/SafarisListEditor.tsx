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
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';
import type { TourItem, SafariItineraryItem } from '@/types/app-config';
import { defaultConfig, defaultSafariItinerary } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { ImageUploaderField } from '../shared/ImageUploaderField';
import { TourDeleteConfirmDialog } from '../shared/TourDeleteConfirmDialog';
import { isTourMatch } from '../shared/admin-helpers';
import { MultilineArrayField } from '../shared/MultilineArrayField';
import { CarouselPhotosManager } from '../shared/CarouselPhotosManager';
import { slugifyTour } from '@/lib/tour-utils';

export function SafarisListEditor({ draft, set }: EditorProps) {
  const currentToursPage = draft.toursPage || defaultConfig.toursPage!;
  const data = currentToursPage.tours || defaultConfig.toursPage!.tours;
  const toursList = data.items || [];
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [deletePrompt, setDeletePrompt] = useState<{ type: 'soft' | 'permanent'; tour: TourItem; index: number } | null>(null);

  const safeActiveIndex = Math.min(Math.max(0, activeTourIndex), Math.max(0, toursList.length - 1));
  const activeTour = toursList[safeActiveIndex];

  const handleAddTour = () => {
    addTour();
    setActiveTourIndex(toursList.length);
  };

  const handleMoveTour = (fromIdx: number, dir: -1 | 1) => {
    const target = fromIdx + dir;
    if (target < 0 || target >= toursList.length) return;
    moveTour(fromIdx, dir);
    setActiveTourIndex(target);
  };

  const updEnabled = (v: boolean) => set((p) => {
    const current = p.toursPage || defaultConfig.toursPage!;
    const currentTours = current.tours || defaultConfig.toursPage!.tours;
    return { ...p, toursPage: { ...current, tours: { ...currentTours, enabled: v } } };
  });

  const updTour = (
    i: number,
    k: keyof TourItem,
    v: string | number | boolean | string[] | SafariItineraryItem[] | undefined
  ) =>
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

      const baseSlug = slugifyTour('New Safari Package');
      const existingSlugs = new Set(tpItems.map((item) => (item.slug || slugifyTour(item.title)).toLowerCase()));
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (existingSlugs.has(uniqueSlug)) {
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
      }

      const newTour: TourItem = {
        id: uniqueId,
        slug: uniqueSlug,
        href: `/safaris/${uniqueSlug}`,
        enabled: true,
        deleted: false,
        title: counter > 1 ? `New Safari Package ${counter}` : 'New Safari Package',
        badge: 'Popular',
        description: 'Experience premier wildlife safaris and Big Five game drives in Kenya...',
        duration: '3 Days / 2 Nights',
        rating: 5,
        imageUrl: '/images/hero/hero.jpg',
        location: 'Maasai Mara National Reserve',
        showLocation: true,
        schedule: 'Daily Departures (Year-Round)',
        showSchedule: true,
        itinerary: defaultSafariItinerary,
        showItinerary: true,
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
              setActiveTourIndex((prev) => Math.max(0, prev - 1));
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
        {/* Safari Packages Header & Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Safari Packages ({toursList.length})</h4>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Select a tab below to focus on that safari
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTour}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Add Safari Package
          </Button>
        </div>

        {/* Sticky Tab Navigation & Pager Bar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pb-2.5 pt-1 space-y-2.5 border-b border-border/40 shadow-xs">
          {/* Horizontal Tab Navigation Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {toursList.map((t, idx) => {
              const isSelected = idx === safeActiveIndex;
              const isDeleted = Boolean(t.deleted);
              const title = t.title
                ? t.title.length > 22
                  ? t.title.slice(0, 20) + '…'
                  : t.title
                : `Safari #${idx + 1}`;
              return (
                <button
                  key={t.id || `tab-${idx}`}
                  type="button"
                  onClick={() => setActiveTourIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'text-white border-transparent shadow-xs ring-1 ring-black/10'
                      : isDeleted
                      ? 'bg-destructive/10 text-destructive/80 border-dashed border-destructive/30 hover:bg-destructive/15'
                      : t.enabled === false
                      ? 'bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                      : 'bg-card text-foreground border-border hover:border-foreground/30 shadow-2xs'
                  }`}
                  style={isSelected ? { backgroundColor: draft.branding.primaryColor || '#1b4332' } : undefined}
                >
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      isSelected
                        ? 'bg-white'
                        : isDeleted
                        ? 'bg-destructive'
                        : t.enabled === false
                        ? 'bg-muted-foreground/50'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span>#{idx + 1} {title}</span>
                  {isDeleted && <span className="text-[10px] opacity-75">(Deleted)</span>}
                  {!isDeleted && t.enabled === false && <span className="text-[10px] opacity-75">(Hidden)</span>}
                </button>
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTour}
              className="h-8 gap-1 text-xs font-semibold whitespace-nowrap shrink-0 border-dashed hover:border-solid"
            >
              <Plus className="h-3.5 w-3.5" /> Add Package
            </Button>
          </div>

          {/* Active Tour Pager Bar */}
          {toursList.length > 0 && activeTour && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-2.5 rounded-lg border border-border/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-white text-xs font-bold shadow-xs shrink-0"
                  style={{ backgroundColor: draft.branding.primaryColor || '#1b4332' }}
                >
                  #{safeActiveIndex + 1}
                </span>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-foreground truncate">
                    {activeTour.title || `Safari #${safeActiveIndex + 1}`}
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    Package {safeActiveIndex + 1} of {toursList.length}
                    {activeTour.deleted
                      ? ' • Soft-deleted / Inactive'
                      : activeTour.enabled === false
                      ? ' • Hidden from listing'
                      : ' • Live on listing'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={safeActiveIndex === 0}
                  onClick={() => setActiveTourIndex(safeActiveIndex - 1)}
                  className="h-7 text-xs gap-1 px-2.5"
                  title="Previous Safari Package"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={safeActiveIndex >= toursList.length - 1}
                  onClick={() => setActiveTourIndex(safeActiveIndex + 1)}
                  className="h-7 text-xs gap-1 px-2.5"
                  title="Next Safari Package"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>

                <div className="h-4 w-px bg-border mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={safeActiveIndex === 0 || Boolean(activeTour.deleted)}
                  onClick={() => handleMoveTour(safeActiveIndex, -1)}
                  title="Move package left (earlier in order)"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={safeActiveIndex >= toursList.length - 1 || Boolean(activeTour.deleted)}
                  onClick={() => handleMoveTour(safeActiveIndex, 1)}
                  title="Move package right (later in order)"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tour Editor Content */}
        {toursList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-muted-foreground space-y-3">
            <Compass className="h-8 w-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium">No safari packages found.</p>
            <Button
              type="button"
              size="sm"
              onClick={handleAddTour}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add First Safari Package
            </Button>
          </div>
        ) : (() => {
          const i = safeActiveIndex;
          const t = activeTour;
          if (!t) return null;
          const isDeleted = Boolean(t.deleted);
          const itineraryList =
            t.itinerary && t.itinerary.length > 0
              ? t.itinerary
              : defaultSafariItinerary;
          return (
            <div
              key={t.id || `tpl-${i}`}
              className={`rounded-xl border transition-all ${
                isDeleted
                  ? 'border-dashed border-destructive/40 bg-muted/30 opacity-60'
                  : 'border-border bg-card shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between p-4 pb-3 border-b border-border/60">
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
              <div
                className="p-4 space-y-4 opacity-100 transition-opacity max-h-[calc(100vh-320px)] min-h-[460px] overflow-y-auto overscroll-contain scroll-smooth pr-3"
                style={{
                  opacity: isDeleted ? 0.6 : t.enabled ? 1 : 0.5,
                  scrollBehavior: 'smooth',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
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
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            updTour(i, 'title', newTitle);
                            // Only auto-fill the URL slug if it is a new item with default placeholder slug
                            const isNew = !t.slug || t.slug.startsWith('new-safari-package');
                            if (isNew) {
                              const newSlug = slugifyTour(newTitle);
                              updTour(i, 'slug', newSlug);
                              updTour(i, 'href', `/safaris/${newSlug}`);
                            }
                          }}
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

                  <FieldRow
                    label="URL Slug (Custom Link)"
                    id={`tp-slug-${i}`}
                    desc="Defines the unique web address: /safaris/[slug]"
                  >
                    <div className="flex items-center rounded-md border border-input bg-background shadow-xs overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                      <span className="px-2.5 py-1.5 text-xs text-muted-foreground bg-muted/50 border-r border-border shrink-0 select-none">
                        /safaris/
                      </span>
                      <Input
                        id={`tp-slug-${i}`}
                        value={
                          t.slug !== undefined
                            ? t.slug
                            : (t.href
                                ? t.href
                                    .replace(/^https?:\/\/[^/]+/i, '')
                                    .replace(/^\/?safaris\//i, '')
                                    .replace(/^\/+|\/+$/g, '')
                                : slugifyTour(t.title))
                        }
                        placeholder="e.g. 3-day-maasai-mara-safari"
                        onChange={(e) => {
                          const val = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9_-]/g, '');
                          updTour(i, 'slug', val);
                          updTour(i, 'href', val ? `/safaris/${val}` : '/safaris');
                        }}
                        disabled={!t.enabled || isDeleted}
                        className="border-0 shadow-none rounded-none focus-visible:ring-0 text-xs font-mono"
                      />
                    </div>
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
                    rows={3}
                    value={t.description}
                    onChange={(e) => updTour(i, 'description', e.target.value)}
                    disabled={!t.enabled || isDeleted}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none disabled:opacity-75"
                  />
                </FieldRow>

                {/* Single Tour Page Details Accordion */}
                <details
                  className="group rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 dark:border-emerald-500/35 p-3.5 sm:p-5 space-y-4 shadow-xs"
                >
                  <summary className="cursor-pointer text-xs font-semibold flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-2 select-none p-2.5 sm:p-3 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-100 border border-emerald-500/30 transition-colors shadow-xs list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-2.5 font-bold min-w-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white shadow-xs shrink-0">
                        <Compass className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold leading-tight">Single Safari Page Content &amp; Details</span>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                        Single Page Config
                      </span>
                      <ChevronDown className="h-4 w-4 text-emerald-800 dark:text-emerald-200 transition-transform duration-200 group-open:rotate-180" />
                    </div>
                  </summary>
                  
                  <div className="space-y-4 pt-1">
                    {/* Hero Background & Carousel Photos */}
                    <div className="rounded-lg border border-emerald-500/20 p-4 bg-background shadow-xs space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">1. Single Safari Hero &amp; Carousel Photos</h5>
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

                      <CarouselPhotosManager
                        id={`tp-carousel-${i}`}
                        images={t.gallery}
                        fallbackImage={t.imageUrl || '/images/hero/hero.jpg'}
                        onChange={(imgs) => updTour(i, 'gallery', imgs)}
                        folder="tours"
                        disabled={!t.enabled || isDeleted}
                        title="Hero Carousel Photos"
                        description="Configure the interactive photo carousel for this single safari detail page. Slide #1 serves as the cover photo."
                      />
                    </div>

                    {/* Quick Info Strip Bar (Hours, Location, Schedule, Group Suitability) */}
                    <div className="rounded-lg border border-emerald-500/20 p-4 bg-background shadow-xs space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">2. Quick Info Strip Bar</h5>
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
                            className="mt-8 shrink-0"
                            title="Toggle Duration Strip Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
                            <FieldRow label="Duration Strip Text" id={`tp-dur-strip-${i}`}>
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
                            className="mt-8 shrink-0"
                            title="Toggle Location Strip Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
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
                            className="mt-8 shrink-0"
                            title="Toggle Schedule Strip Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
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
                            className="mt-8 shrink-0"
                            title="Toggle Group Suitability Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
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

                    {/* 3. Day-by-Day Safari Itinerary */}
                    <div className="rounded-lg border border-emerald-500/20 p-4 bg-background shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={t.showItinerary !== false}
                            onCheckedChange={(v) =>
                              updTour(i, 'showItinerary', v)
                            }
                            disabled={!t.enabled || isDeleted}
                            className="shrink-0"
                            title="Toggle Day-by-Day Safari Itinerary On/Off"
                          />
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>3. Day-by-Day Safari Itinerary</span>
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!t.enabled || isDeleted}
                          onClick={() => {
                            const cur = [...itineraryList];
                            const newDay: SafariItineraryItem = {
                              day: `Day ${cur.length + 1}`,
                              title: 'New Safari Day',
                              description:
                                'Details of game drives, scenic transfers, meals, and lodge stay for this day...',
                            };
                            updTour(i, 'itinerary', [...cur, newDay]);
                          }}
                          className="h-7 text-xs gap-1 self-start sm:self-auto shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Day
                        </Button>
                      </div>

                      {itineraryList.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-2">
                          No itinerary days added yet. Click &quot;Add Day&quot; above.
                        </p>
                      ) : (
                        itineraryList.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-lg border border-border/70 bg-card/60 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                {step.day || `Day ${sIdx + 1}`}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  disabled={
                                    sIdx === 0 || !t.enabled || isDeleted
                                  }
                                  onClick={() => {
                                    const cur = [...itineraryList];
                                    const temp = cur[sIdx];
                                    cur[sIdx] = cur[sIdx - 1];
                                    cur[sIdx - 1] = temp;
                                    updTour(i, 'itinerary', cur);
                                  }}
                                  title="Move day up"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  disabled={
                                    sIdx === itineraryList.length - 1 ||
                                    !t.enabled ||
                                    isDeleted
                                  }
                                  onClick={() => {
                                    const cur = [...itineraryList];
                                    const temp = cur[sIdx];
                                    cur[sIdx] = cur[sIdx + 1];
                                    cur[sIdx + 1] = temp;
                                    updTour(i, 'itinerary', cur);
                                  }}
                                  title="Move day down"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  disabled={!t.enabled || isDeleted}
                                  onClick={() => {
                                    const cur = [...itineraryList];
                                    cur.splice(sIdx, 1);
                                    updTour(i, 'itinerary', cur);
                                  }}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                  title="Delete day"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-1">
                                <Input
                                  value={step.day || ''}
                                  placeholder="e.g. Day 1"
                                  onChange={(e) => {
                                    const cur = [...itineraryList];
                                    cur[sIdx] = {
                                      ...step,
                                      day: e.target.value,
                                    };
                                    updTour(i, 'itinerary', cur);
                                  }}
                                  disabled={!t.enabled || isDeleted}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <Input
                                  value={step.title || ''}
                                  placeholder="Day Title, e.g. Nairobi to Maasai Mara & Sunset Drive"
                                  onChange={(e) => {
                                    const cur = [...itineraryList];
                                    cur[sIdx] = {
                                      ...step,
                                      title: e.target.value,
                                    };
                                    updTour(i, 'itinerary', cur);
                                  }}
                                  disabled={!t.enabled || isDeleted}
                                  className="h-8 text-xs font-medium"
                                />
                              </div>
                            </div>

                            <textarea
                              rows={3}
                              value={step.description || ''}
                              placeholder="Details of game drives, scenic transfers, meals, and lodge stay for this day..."
                              onChange={(e) => {
                                const cur = [...itineraryList];
                                cur[sIdx] = {
                                  ...step,
                                  description: e.target.value,
                                };
                                updTour(i, 'itinerary', cur);
                              }}
                              disabled={!t.enabled || isDeleted}
                              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                            />
                          </div>
                        ))
                      )}
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 p-4 bg-background shadow-xs space-y-4">
                      <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">4. About &amp; Inclusions Details</h5>
                      
                      <FieldRow label="Full Tour Overview (Main Article)" id={`tp-over-${i}`}>
                        <textarea
                          id={`tp-over-${i}`}
                          rows={6}
                          value={t.overview || ''}
                          placeholder="Full detailed narrative description for the single tour page..."
                          onChange={(e) => updTour(i, 'overview', e.target.value)}
                          disabled={!t.enabled || isDeleted}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                        />
                      </FieldRow>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={t.showIncluded !== false}
                              onCheckedChange={(v) => updTour(i, 'showIncluded', v)}
                              disabled={!t.enabled || isDeleted}
                              title="Toggle What's Included On/Off"
                            />
                            <Label className="text-xs font-semibold">What&apos;s Included (1 item per line)</Label>
                          </div>
                          <MultilineArrayField
                            id={`tp-inc-${i}`}
                            rows={7}
                            value={t.included}
                            placeholder="Heavy tackle Penn & Shimano rods&#10;Live bait & lures&#10;Marine park entry permits&#10;Seafood lunch & drinks"
                            onChange={(items) => updTour(i, 'included', items)}
                            disabled={!t.enabled || isDeleted || t.showIncluded === false}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={t.showNotIncluded !== false}
                              onCheckedChange={(v) => updTour(i, 'showNotIncluded', v)}
                              disabled={!t.enabled || isDeleted}
                              title="Toggle What's Not Included On/Off"
                            />
                            <Label className="text-xs font-semibold">What&apos;s Not Included (1 item per line)</Label>
                          </div>
                          <MultilineArrayField
                            id={`tp-notinc-${i}`}
                            rows={7}
                            value={t.notIncluded}
                            placeholder="Crew gratuities and tips (optional)&#10;Hotel pickup & return transfers&#10;Personal swimwear & towels&#10;Alcoholic beverages"
                            onChange={(items) => updTour(i, 'notIncluded', items)}
                            disabled={!t.enabled || isDeleted || t.showNotIncluded === false}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={t.showWhyChoose !== false}
                              onCheckedChange={(v) => updTour(i, 'showWhyChoose', v)}
                              disabled={!t.enabled || isDeleted}
                              title="Toggle Why Choose This Safari On/Off"
                            />
                            <Label className="text-xs font-semibold">Why Choose This Safari (1 per line)</Label>
                          </div>
                          <MultilineArrayField
                            id={`tp-why-${i}`}
                            rows={6}
                            value={t.whyChoose}
                            placeholder="Twin-engine sportfisher with fighting chair&#10;IGFA certified captain with 20+ years experience&#10;Strict billfish conservation policy"
                            onChange={(items) => updTour(i, 'whyChoose', items)}
                            disabled={!t.enabled || isDeleted || t.showWhyChoose === false}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={t.showKnowBeforeYouGo !== false}
                              onCheckedChange={(v) => updTour(i, 'showKnowBeforeYouGo', v)}
                              disabled={!t.enabled || isDeleted}
                              title="Toggle Know Before You Go On/Off"
                            />
                            <Label className="text-xs font-semibold">Know Before You Go (1 per line)</Label>
                          </div>
                          <MultilineArrayField
                            id={`tp-know-${i}`}
                            rows={6}
                            value={t.knowBeforeYouGo}
                            placeholder="Departure: 6:00 AM from Watamu Marine Park Gate&#10;Duration: Approx. 8 hours&#10;What to bring: Polarized sunglasses, reef-safe sunscreen"
                            onChange={(items) => updTour(i, 'knowBeforeYouGo', items)}
                            disabled={!t.enabled || isDeleted || t.showKnowBeforeYouGo === false}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 p-4 bg-background shadow-xs space-y-3">
                      <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        5. Single Safari SEO &amp; Meta
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldRow label="Meta Title (Optional)" id={`tp-mtitle-${i}`}>
                          <Input
                            id={`tp-mtitle-${i}`}
                            value={t.metaTitle || ''}
                            placeholder={t.title ? `${t.title} | Twinbird Travel Agency` : 'e.g. Maasai Mara Big Five | Twinbird Travel Agency'}
                            onChange={(e) => updTour(i, 'metaTitle', e.target.value)}
                            disabled={!t.enabled || isDeleted}
                          />
                        </FieldRow>
                        <FieldRow label="Meta Description (Optional)" id={`tp-mdesc-${i}`}>
                          <textarea
                            id={`tp-mdesc-${i}`}
                            rows={3}
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
          })()}
      </div>
    </div>
  );
}
