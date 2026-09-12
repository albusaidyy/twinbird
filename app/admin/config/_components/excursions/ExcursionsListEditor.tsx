import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Compass,
  Plus,
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";
import type { ExcursionItem, ExcursionScheduleItem } from "@/types/app-config";
import { defaultConfig, defaultExcursionItems, defaultExcursionSchedule } from "@/config/default-config";
import type { EditorProps } from "../shared/types";
import { FieldRow } from "../shared/FieldRow";
import { SectionToggle } from "../shared/SectionToggle";
import { BackgroundColorPicker } from "../shared/BackgroundColorPicker";
import { SectionHeaderFields } from "../shared/SectionHeaderFields";
import { ImageUploaderField } from "../shared/ImageUploaderField";
import { TourDeleteConfirmDialog } from "../shared/TourDeleteConfirmDialog";
import { isExcursionMatch } from "@/lib/excursion-utils";

export function ExcursionsListEditor({ draft, set }: EditorProps) {
  const fallbackExcursions = defaultConfig.homepage.excursions || {
    enabled: true,
    backgroundColor: "#ffffff",
    eyebrow: "DAY EXPEDITIONS & EXCURSIONS",
    title: "Handcrafted Day Excursions",
    subtitle:
      "Immerse yourself in Kenya’s marine sanctuaries, coastal coral gardens, and ancient forests on guided day journeys back before evening.",
    items: defaultExcursionItems,
  };

  const currentExcursionsPage =
    draft.excursionsPage || defaultConfig.excursionsPage!;
  const data =
    currentExcursionsPage.tours || defaultConfig.excursionsPage!.tours;
  const excursionsList: ExcursionItem[] = data.items || [];
  const [deletePrompt, setDeletePrompt] = useState<{
    type: "soft" | "permanent";
    excursion: ExcursionItem;
    index: number;
  } | null>(null);

  const updEnabled = (v: boolean) =>
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      return {
        ...p,
        excursionsPage: {
          ...current,
          tours: { ...currentTours, enabled: v },
        },
      };
    });

  const updExcursion = (
    i: number,
    k: keyof ExcursionItem,
    v:
      | string
      | number
      | boolean
      | string[]
      | ExcursionScheduleItem[]
      | undefined,
  ) =>
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      const hpItems = [
        ...(p.homepage?.excursions?.items || fallbackExcursions.items),
      ];
      const epItems = [
        ...(currentTours.items || defaultConfig.excursionsPage!.tours.items),
      ];

      const currentItem = epItems[i];
      if (!currentItem) return p;

      epItems[i] = { ...currentItem, [k]: v } as ExcursionItem;

      const hpIdx = hpItems.findIndex((t, idx) =>
        isExcursionMatch(t, currentItem, idx, i),
      );
      if (hpIdx !== -1) {
        hpItems[hpIdx] = { ...hpItems[hpIdx], [k]: v } as ExcursionItem;
      } else if (hpItems[i]) {
        hpItems[i] = { ...hpItems[i], [k]: v } as ExcursionItem;
      }

      return {
        ...p,
        homepage: {
          ...p.homepage,
          excursions: {
            ...(p.homepage?.excursions || fallbackExcursions),
            items: hpItems,
          },
        },
        excursionsPage: {
          ...current,
          tours: { ...currentTours, items: epItems },
        },
      };
    });

  const addExcursion = () => {
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      const hpItems = [
        ...(p.homepage?.excursions?.items || fallbackExcursions.items),
      ];
      const epItems = [
        ...(currentTours.items || defaultConfig.excursionsPage!.tours.items),
      ];

      const newId = `exc_${Date.now()}`;
      const newExcursion: ExcursionItem = {
        id: newId,
        title: "New Coastal Excursion",
        slug: "new-coastal-excursion",
        badge: "Day Adventure",
        duration: "Full Day · 8 Hours",
        rating: 4.9,
        price: "From $95 / person",
        href: `/excursions/${newId}`,
        imageUrl: "/images/hero/hero.jpg",
        description:
          "Experience an unforgettable coastal day trip and marine exploration.",
        overview:
          "Join our experienced local skippers and guides for an enriching day trip packed with scenic beauty, wildlife encounters, and cultural immersion.",
        location: "Coast of Kenya",
        schedule: "Daily Departures · 7:30 AM",
        groupType: "Families · Couples · Small Groups",
        included: [
          "Professional guide & boat captain",
          "Snorkeling & safety equipment",
          "Marine park conservation fees",
          "Fresh seafood lunch & refreshments",
        ],
        notIncluded: [
          "Hotel pickup & return transfers",
          "Crew tips and gratuities",
          "Personal swimwear and towels",
        ],
        whyChoose: [
          "Experienced licensed marine guides",
          "Modern equipment & strict safety standards",
          "Authentic local seafood and hospitality",
        ],
        knowBeforeYouGo: [
          "Bring biodegradable reef-safe sunscreen",
          "Wear comfortable swimwear and deck shoes",
          "Underwater cameras or dry bags recommended",
        ],
        scheduleItems: defaultExcursionSchedule,
        gallery: ["/images/hero/hero.jpg", "/images/hero/hero.jpg"],
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
        homepage: {
          ...p.homepage,
          excursions: {
            ...(p.homepage?.excursions || fallbackExcursions),
            items: [...hpItems, newExcursion],
          },
        },
        excursionsPage: {
          ...current,
          tours: { ...currentTours, items: [...epItems, newExcursion] },
        },
      };
    });
  };

  const moveExcursion = (index: number, direction: -1 | 1) => {
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      const targetIndex = index + direction;
      const epItems = [
        ...(currentTours.items || defaultConfig.excursionsPage!.tours.items),
      ];

      if (targetIndex < 0 || targetIndex >= epItems.length) return p;

      const [moved] = epItems.splice(index, 1);
      epItems.splice(targetIndex, 0, moved);

      return {
        ...p,
        excursionsPage: {
          ...current,
          tours: { ...currentTours, items: epItems },
        },
      };
    });
  };

  const confirmDelete = () => {
    if (!deletePrompt) return;
    const { type, excursion, index } = deletePrompt;

    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      const epItems = [
        ...(currentTours.items || defaultConfig.excursionsPage!.tours.items),
      ];
      const hpItems = [
        ...(p.homepage?.excursions?.items || fallbackExcursions.items),
      ];

      if (type === "soft") {
        epItems[index] = { ...epItems[index], deleted: true };
        const hpIdx = hpItems.findIndex((t, idx) =>
          isExcursionMatch(t, excursion, idx, index),
        );
        if (hpIdx !== -1) {
          hpItems[hpIdx] = { ...hpItems[hpIdx], deleted: true };
        }
      } else {
        epItems.splice(index, 1);
        const hpIdx = hpItems.findIndex((t, idx) =>
          isExcursionMatch(t, excursion, idx, index),
        );
        if (hpIdx !== -1) {
          hpItems.splice(hpIdx, 1);
        }
      }

      return {
        ...p,
        homepage: {
          ...p.homepage,
          excursions: {
            ...(p.homepage?.excursions || fallbackExcursions),
            items: hpItems,
          },
        },
        excursionsPage: {
          ...current,
          tours: { ...currentTours, items: epItems },
        },
      };
    });

    setDeletePrompt(null);
  };

  const restoreExcursion = (excursion: ExcursionItem, index: number) => {
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      const currentTours = current.tours || defaultConfig.excursionsPage!.tours;
      const epItems = [
        ...(currentTours.items || defaultConfig.excursionsPage!.tours.items),
      ];
      const hpItems = [
        ...(p.homepage?.excursions?.items || fallbackExcursions.items),
      ];

      epItems[index] = { ...epItems[index], deleted: false };
      const hpIdx = hpItems.findIndex((t, idx) =>
        isExcursionMatch(t, excursion, idx, index),
      );
      if (hpIdx !== -1) {
        hpItems[hpIdx] = { ...hpItems[hpIdx], deleted: false };
      }

      return {
        ...p,
        homepage: {
          ...p.homepage,
          excursions: {
            ...(p.homepage?.excursions || fallbackExcursions),
            items: hpItems,
          },
        },
        excursionsPage: {
          ...current,
          tours: { ...currentTours, items: epItems },
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      <TourDeleteConfirmDialog
        isOpen={!!deletePrompt}
        type={deletePrompt?.type || "soft"}
        tourTitle={deletePrompt?.excursion.title || "Excursion"}
        onConfirm={confirmDelete}
        onCancel={() => setDeletePrompt(null)}
      />

      <SectionToggle
        title="Excursions Listing Section"
        enabled={data.enabled !== false}
        onChange={updEnabled}
      />

      <BackgroundColorPicker
        value={data.backgroundColor || "#faf7f2"}
        onChange={(v) =>
          set((p) => {
            const current = p.excursionsPage || defaultConfig.excursionsPage!;
            const currentTours =
              current.tours || defaultConfig.excursionsPage!.tours;
            return {
              ...p,
              excursionsPage: {
                ...current,
                tours: { ...currentTours, backgroundColor: v },
              },
            };
          })
        }
      />

      <SectionHeaderFields
        data={data}
        onChange={(k, v) =>
          set((p) => {
            const current = p.excursionsPage || defaultConfig.excursionsPage!;
            const currentTours =
              current.tours || defaultConfig.excursionsPage!.tours;
            return {
              ...p,
              excursionsPage: {
                ...current,
                tours: { ...currentTours, [k]: v },
              },
            };
          })
        }
      />

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          Excursions Inventory ({excursionsList.length})
        </h4>
        <Button
          type="button"
          size="sm"
          onClick={addExcursion}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Excursion
        </Button>
      </div>

      <div className="space-y-4">
        {excursionsList.map((t, i) => {
          const isDeleted = t.deleted;
          const scheduleList =
            t.scheduleItems && t.scheduleItems.length > 0
              ? t.scheduleItems
              : defaultExcursionSchedule;

          return (
            <div
              key={t.id || i}
              className={`rounded-xl border p-4 transition-all ${
                isDeleted
                  ? "border-destructive/30 bg-destructive/5 opacity-75"
                  : !t.enabled
                    ? "border-border/60 bg-muted/20 opacity-70"
                    : "border-border bg-card shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={t.enabled !== false && !isDeleted}
                    onCheckedChange={(v) => updExcursion(i, "enabled", v)}
                    disabled={isDeleted}
                    title="Enable / Disable Excursion"
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isDeleted
                        ? "line-through text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {t.title || `Excursion #${i + 1}`}
                  </span>
                  {isDeleted && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-destructive/15 text-destructive px-2 py-0.5 rounded-full">
                      Deleted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
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
                        onClick={() =>
                          setDeletePrompt({
                            type: "soft",
                            excursion: t,
                            index: i,
                          })
                        }
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
                        onClick={() =>
                          setDeletePrompt({
                            type: "permanent",
                            excursion: t,
                            index: i,
                          })
                        }
                        title="Permanently delete excursion"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Forever
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="space-y-4 opacity-100 transition-opacity"
                style={{ opacity: isDeleted ? 0.6 : t.enabled ? 1 : 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showTitle !== false}
                      onCheckedChange={(v) => updExcursion(i, "showTitle", v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Title On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Title" id={`exp-title-${i}`}>
                        <Input
                          id={`exp-title-${i}`}
                          value={t.title}
                          onChange={(e) =>
                            updExcursion(i, "title", e.target.value)
                          }
                          disabled={!t.enabled || isDeleted}
                          className={
                            isDeleted
                              ? "line-through text-muted-foreground"
                              : ""
                          }
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showBadge !== false}
                      onCheckedChange={(v) => updExcursion(i, "showBadge", v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Badge On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Badge" id={`exp-badge-${i}`}>
                        <Input
                          id={`exp-badge-${i}`}
                          value={t.badge || ""}
                          onChange={(e) =>
                            updExcursion(i, "badge", e.target.value)
                          }
                          disabled={!t.enabled || isDeleted}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showDuration !== false}
                      onCheckedChange={(v) =>
                        updExcursion(i, "showDuration", v)
                      }
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Duration On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Duration" id={`exp-dur-${i}`}>
                        <Input
                          id={`exp-dur-${i}`}
                          value={t.duration || ""}
                          onChange={(e) =>
                            updExcursion(i, "duration", e.target.value)
                          }
                          disabled={!t.enabled || isDeleted}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showRating !== false}
                      onCheckedChange={(v) => updExcursion(i, "showRating", v)}
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
                          onChange={(e) =>
                            updExcursion(
                              i,
                              "rating",
                              parseFloat(e.target.value) || 0,
                            )
                          }
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
                      onCheckedChange={(v) => updExcursion(i, "showPrice", v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Pricing On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Price Text" id={`exp-price-${i}`}>
                        <Input
                          id={`exp-price-${i}`}
                          value={t.price || ""}
                          placeholder="Contact for pricing"
                          onChange={(e) =>
                            updExcursion(i, "price", e.target.value)
                          }
                          disabled={!t.enabled || isDeleted}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <FieldRow label="Custom URL / Slug" id={`exp-href-${i}`}>
                    <Input
                      id={`exp-href-${i}`}
                      value={t.href || ""}
                      placeholder="/excursions/..."
                      onChange={(e) => updExcursion(i, "href", e.target.value)}
                      disabled={!t.enabled || isDeleted}
                    />
                  </FieldRow>
                </div>

                <FieldRow label="Cover Photo" id={`exp-img-${i}`}>
                  <ImageUploaderField
                    id={`exp-img-${i}`}
                    value={t.imageUrl}
                    onChange={(url) => updExcursion(i, "imageUrl", url)}
                    folder="excursions"
                    placeholder="Cover photo..."
                    disabled={!t.enabled || isDeleted}
                  />
                </FieldRow>

                <FieldRow label="Card Short Description" id={`exp-desc-${i}`}>
                  <textarea
                    id={`exp-desc-${i}`}
                    rows={3}
                    value={t.description}
                    onChange={(e) =>
                      updExcursion(i, "description", e.target.value)
                    }
                    disabled={!t.enabled || isDeleted}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none disabled:opacity-75"
                  />
                </FieldRow>

                {/* Single Excursion Page Details Accordion */}
                <details
                  open={!isDeleted}
                  className="rounded-xl border-2 border-sky-500/40 bg-sky-500/5 dark:bg-sky-950/20 dark:border-sky-500/35 p-3.5 sm:p-5 space-y-4 shadow-xs"
                >
                  <summary className="cursor-pointer text-xs font-semibold flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-2 select-none p-2.5 sm:p-3 rounded-lg bg-sky-600/10 hover:bg-sky-600/15 dark:bg-sky-500/20 text-sky-950 dark:text-sky-100 border border-sky-500/30 transition-colors shadow-xs">
                    <div className="flex items-center gap-2.5 font-bold min-w-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 text-white shadow-xs shrink-0">
                        <Compass className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold leading-tight">
                        Single Excursion Page Content &amp; Details
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-600/15 dark:bg-sky-400/20 text-sky-800 dark:text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-500/25 shrink-0 self-start sm:self-auto">
                      Single Page Config
                    </span>
                  </summary>

                  <div className="space-y-4 pt-1">
                    {/* 1. Single Excursion Hero & Carousel Photos */}
                    <div className="rounded-lg border border-sky-500/20 p-4 bg-background shadow-xs space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                          1. Single Excursion Hero &amp; Carousel Photos
                        </h5>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Configure the hero background color, backdrop image, and the interactive photo carousel for this single excursion detail page.
                        </p>
                      </div>

                      <BackgroundColorPicker
                        label="Hero Background Color"
                        desc="Custom hero background color when no hero image is set or behind the overlay."
                        value={t.heroBackgroundColor || '#0f766e'}
                        onChange={(v) =>
                          updExcursion(i, 'heroBackgroundColor', v)
                        }
                      />

                      <FieldRow
                        label="Hero Background Image (Behind Title)"
                        id={`exp-hero-img-${i}`}
                      >
                        <ImageUploaderField
                          id={`exp-hero-img-${i}`}
                          value={t.heroImageUrl || ''}
                          onChange={(url) =>
                            updExcursion(i, 'heroImageUrl', url)
                          }
                          folder="hero"
                          placeholder="Select hero background image (Optional)..."
                          disabled={!t.enabled || isDeleted}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Optional hero backdrop image with dark ambient gradient overlay.
                        </p>
                      </FieldRow>

                      <BackgroundColorPicker
                        label="Carousel Indicator Color"
                        desc="Pick a custom color for the active carousel dot indicators."
                        value={t.indicatorColor || '#f6ab03'}
                        onChange={(v) =>
                          updExcursion(i, 'indicatorColor', v)
                        }
                      />

                      <div className="space-y-3 pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold">
                            Carousel Photos (Auto-scrolling Gallery)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                              const currentGallery =
                                t.gallery && t.gallery.length > 0
                                  ? t.gallery
                                  : [baseImg, baseImg, baseImg];
                              updExcursion(i, 'gallery', [
                                ...currentGallery,
                                '/images/hero/hero.jpg',
                              ]);
                            }}
                            disabled={!t.enabled || isDeleted}
                            className="gap-1.5 h-7 text-xs"
                          >
                            <Plus className="h-3 w-3" /> Add Carousel Photo
                          </Button>
                        </div>

                        <div className="space-y-2.5">
                          {(t.gallery && t.gallery.length > 0
                            ? t.gallery
                            : [
                                t.imageUrl || '/images/hero/hero.jpg',
                                t.imageUrl || '/images/hero/hero.jpg',
                                t.imageUrl || '/images/hero/hero.jpg',
                              ]
                          ).map((imgUrl, gIdx) => {
                            const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                            const currentGallery =
                              t.gallery && t.gallery.length > 0
                                ? t.gallery
                                : [baseImg, baseImg, baseImg];
                            const updGalleryImg = (newUrl: string) => {
                              const updated = [...currentGallery];
                              updated[gIdx] = newUrl;
                              updExcursion(i, 'gallery', updated);
                            };
                            const removeGalleryImg = () => {
                              const updated = currentGallery.filter(
                                (_, idx) => idx !== gIdx
                              );
                              const fallbackImg = t.imageUrl || '/images/hero/hero.jpg';
                              updExcursion(
                                i,
                                'gallery',
                                updated.length > 0
                                  ? updated
                                  : [fallbackImg, fallbackImg, fallbackImg]
                              );
                            };
                            const moveGalleryImg = (dir: 'up' | 'down') => {
                              const target =
                                dir === 'up' ? gIdx - 1 : gIdx + 1;
                              if (
                                target < 0 ||
                                target >= currentGallery.length
                              )
                                return;
                              const updated = [...currentGallery];
                              const temp = updated[gIdx];
                              updated[gIdx] = updated[target];
                              updated[target] = temp;
                              updExcursion(i, 'gallery', updated);
                            };

                            return (
                              <div
                                key={gIdx}
                                className="rounded-lg border border-border p-3 bg-card shadow-xs space-y-2 min-w-0"
                              >
                                <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
                                  <span className="text-xs font-semibold text-muted-foreground">
                                    Carousel Photo #{gIdx + 1}
                                  </span>
                                  <div className="flex items-center gap-0.5">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      disabled={
                                        gIdx === 0 || !t.enabled || isDeleted
                                      }
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
                                      disabled={
                                        gIdx === currentGallery.length - 1 ||
                                        !t.enabled ||
                                        isDeleted
                                      }
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
                                      disabled={
                                        !t.enabled ||
                                        currentGallery.length <= 1 ||
                                        isDeleted
                                      }
                                      onClick={removeGalleryImg}
                                      title="Delete photo"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="w-full min-w-0">
                                  <ImageUploaderField
                                    id={`exp-gal-${i}-${gIdx}`}
                                    value={imgUrl}
                                    onChange={updGalleryImg}
                                    folder="excursions"
                                    placeholder="Choose carousel photo..."
                                    disabled={!t.enabled || isDeleted}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 2. Quick Info Strip Bar */}
                    <div className="rounded-lg border border-sky-500/20 p-4 bg-background shadow-xs space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                          2. Quick Info Strip Bar
                        </h5>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Configure the quick metadata pills displayed in the strip bar right below the single excursion hero carousel.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showDuration !== false}
                            onCheckedChange={(v) =>
                              updExcursion(i, 'showDuration', v)
                            }
                            disabled={!t.enabled || isDeleted}
                            className="mt-8 shrink-0"
                            title="Toggle Duration Strip Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
                            <FieldRow
                              label="Duration Strip Text"
                              id={`exp-dur-strip-${i}`}
                            >
                              <Input
                                id={`exp-dur-strip-${i}`}
                                value={t.duration || ''}
                                placeholder="e.g. Full Day · 8 Hours"
                                onChange={(e) =>
                                  updExcursion(i, 'duration', e.target.value)
                                }
                                disabled={
                                  !t.enabled ||
                                  isDeleted ||
                                  t.showDuration === false
                                }
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showLocation !== false}
                            onCheckedChange={(v) =>
                              updExcursion(i, 'showLocation', v)
                            }
                            disabled={!t.enabled || isDeleted}
                            className="mt-8 shrink-0"
                            title="Toggle Location Strip Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
                            <FieldRow
                              label="Location Strip Text"
                              id={`exp-loc-${i}`}
                            >
                              <Input
                                id={`exp-loc-${i}`}
                                value={t.location || ''}
                                placeholder="e.g. Watamu Marine Park, Kenya"
                                onChange={(e) =>
                                  updExcursion(i, 'location', e.target.value)
                                }
                                disabled={
                                  !t.enabled ||
                                  isDeleted ||
                                  t.showLocation === false
                                }
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showSchedule !== false}
                            onCheckedChange={(v) =>
                              updExcursion(i, 'showSchedule', v)
                            }
                            disabled={!t.enabled || isDeleted}
                            className="mt-8 shrink-0"
                            title="Toggle Schedule Strip Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
                            <FieldRow
                              label="Schedule / Season Text"
                              id={`exp-sched-${i}`}
                            >
                              <Input
                                id={`exp-sched-${i}`}
                                value={t.schedule || ''}
                                placeholder="e.g. Daily Departures · 7:30 AM"
                                onChange={(e) =>
                                  updExcursion(i, 'schedule', e.target.value)
                                }
                                disabled={
                                  !t.enabled ||
                                  isDeleted ||
                                  t.showSchedule === false
                                }
                              />
                            </FieldRow>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <Switch
                            checked={t.showGroupType !== false}
                            onCheckedChange={(v) =>
                              updExcursion(i, 'showGroupType', v)
                            }
                            disabled={!t.enabled || isDeleted}
                            className="mt-8 shrink-0"
                            title="Toggle Group Suitability Text On/Off"
                          />
                          <div className="flex-1 min-w-0">
                            <FieldRow
                              label="Group Suitability Text"
                              id={`exp-grp-${i}`}
                            >
                              <Input
                                id={`exp-grp-${i}`}
                                value={t.groupType || ''}
                                placeholder="e.g. Families · Couples · Small Groups"
                                onChange={(e) =>
                                  updExcursion(i, 'groupType', e.target.value)
                                }
                                disabled={
                                  !t.enabled ||
                                  isDeleted ||
                                  t.showGroupType === false
                                }
                              />
                            </FieldRow>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Day Schedule Timeline Steps (Preserved Exactly) */}
                    <div className="rounded-lg border border-sky-500/20 p-4 bg-background shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={
                              t.showScheduleItems !== false &&
                              t.showSchedule !== false
                            }
                            onCheckedChange={(v) => {
                              updExcursion(i, 'showScheduleItems', v);
                              updExcursion(i, 'showSchedule', v);
                            }}
                            disabled={!t.enabled || isDeleted}
                            className="shrink-0"
                            title="Toggle Day Schedule Timeline On/Off"
                          />
                          <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                            <span>3. Day Schedule Timeline Steps</span>
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!t.enabled || isDeleted}
                          onClick={() => {
                            const cur = [...scheduleList];
                            const newStep: ExcursionScheduleItem = {
                              time: '09:00 - 11:00',
                              title: 'New Schedule Stop',
                              description:
                                'Details for this excursion timeline stop...',
                            };
                            updExcursion(i, 'scheduleItems', [...cur, newStep]);
                          }}
                          className="h-7 text-xs gap-1 self-start sm:self-auto shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Step
                        </Button>
                      </div>

                      {scheduleList.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-2">
                          No timeline stops added yet. Click &quot;Add
                          Step&quot; above.
                        </p>
                      ) : (
                        scheduleList.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-lg border border-border/70 bg-card/60 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                Stop #{sIdx + 1}
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
                                    const cur = [...scheduleList];
                                    const temp = cur[sIdx];
                                    cur[sIdx] = cur[sIdx - 1];
                                    cur[sIdx - 1] = temp;
                                    updExcursion(i, 'scheduleItems', cur);
                                  }}
                                  title="Move stop up"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  disabled={
                                    sIdx === scheduleList.length - 1 ||
                                    !t.enabled ||
                                    isDeleted
                                  }
                                  onClick={() => {
                                    const cur = [...scheduleList];
                                    const temp = cur[sIdx];
                                    cur[sIdx] = cur[sIdx + 1];
                                    cur[sIdx + 1] = temp;
                                    updExcursion(i, 'scheduleItems', cur);
                                  }}
                                  title="Move stop down"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  disabled={!t.enabled || isDeleted}
                                  onClick={() => {
                                    const cur = [...scheduleList];
                                    cur.splice(sIdx, 1);
                                    updExcursion(i, 'scheduleItems', cur);
                                  }}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                  title="Delete stop"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-1">
                                <Input
                                  value={step.time || ''}
                                  placeholder="e.g. 08:00 - 09:30"
                                  onChange={(e) => {
                                    const cur = [...scheduleList];
                                    cur[sIdx] = {
                                      ...step,
                                      time: e.target.value,
                                    };
                                    updExcursion(i, 'scheduleItems', cur);
                                  }}
                                  disabled={!t.enabled || isDeleted}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <Input
                                  value={step.title || ''}
                                  placeholder="Stop Title, e.g. Morning Departure"
                                  onChange={(e) => {
                                    const cur = [...scheduleList];
                                    cur[sIdx] = {
                                      ...step,
                                      title: e.target.value,
                                    };
                                    updExcursion(i, 'scheduleItems', cur);
                                  }}
                                  disabled={!t.enabled || isDeleted}
                                  className="h-8 text-xs font-medium"
                                />
                              </div>
                            </div>

                            <textarea
                              rows={3}
                              value={step.description || ''}
                              placeholder="Description of activities, scenery, or lunch for this stop..."
                              onChange={(e) => {
                                const cur = [...scheduleList];
                                cur[sIdx] = {
                                  ...step,
                                  description: e.target.value,
                                };
                                updExcursion(i, 'scheduleItems', cur);
                              }}
                              disabled={!t.enabled || isDeleted}
                              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                            />
                          </div>
                        ))
                      )}
                    </div>

                    {/* 4. About & Inclusions Details */}
                    <div className="rounded-lg border border-sky-500/20 p-4 bg-background shadow-xs space-y-4">
                      <h5 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                        4. About &amp; Inclusions Details
                      </h5>

                      <FieldRow
                        label="Full Excursion Overview (Main Article)"
                        id={`exp-over-${i}`}
                      >
                        <textarea
                          id={`exp-over-${i}`}
                          rows={6}
                          value={t.overview || ''}
                          placeholder="Full detailed narrative description for the single excursion page..."
                          onChange={(e) =>
                            updExcursion(i, 'overview', e.target.value)
                          }
                          disabled={!t.enabled || isDeleted}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                        />
                      </FieldRow>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={t.showIncluded !== false}
                              onCheckedChange={(v) =>
                                updExcursion(i, 'showIncluded', v)
                              }
                              disabled={!t.enabled || isDeleted}
                              title="Toggle What's Included On/Off"
                            />
                            <Label className="text-xs font-semibold">
                              What&apos;s Included (1 item per line)
                            </Label>
                          </div>
                          <textarea
                            id={`exp-inc-${i}`}
                            rows={7}
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
                            disabled={
                              !t.enabled ||
                              isDeleted ||
                              t.showIncluded === false
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={t.showNotIncluded !== false}
                              onCheckedChange={(v) =>
                                updExcursion(i, 'showNotIncluded', v)
                              }
                              disabled={!t.enabled || isDeleted}
                              title="Toggle What's Not Included On/Off"
                            />
                            <Label className="text-xs font-semibold">
                              What&apos;s Not Included (1 item per line)
                            </Label>
                          </div>
                          <textarea
                            id={`exp-notinc-${i}`}
                            rows={7}
                            value={(t.notIncluded || []).join('\n')}
                            placeholder="Driver and excursion guide gratuities&#10;Personal shopping and souvenirs&#10;Personal travel insurance"
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
                            disabled={
                              !t.enabled ||
                              isDeleted ||
                              t.showNotIncluded === false
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={t.showWhyChoose !== false}
                              onCheckedChange={(v) =>
                                updExcursion(i, 'showWhyChoose', v)
                              }
                              disabled={!t.enabled || isDeleted}
                              title="Toggle Why Choose This Excursion On/Off"
                            />
                            <Label className="text-xs font-semibold">
                              Why Choose This Excursion (1 per line)
                            </Label>
                          </div>
                          <textarea
                            id={`exp-why-${i}`}
                            rows={6}
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
                            disabled={
                              !t.enabled ||
                              isDeleted ||
                              t.showWhyChoose === false
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={
                                t.showKnowBeforeYouGo !== false &&
                                t.showWhatToCarry !== false
                              }
                              onCheckedChange={(v) => {
                                updExcursion(i, 'showKnowBeforeYouGo', v);
                                updExcursion(i, 'showWhatToCarry', v);
                              }}
                              disabled={!t.enabled || isDeleted}
                              title="Toggle Know Before You Go On/Off"
                            />
                            <Label className="text-xs font-semibold">
                              Know Before You Go (1 per line)
                            </Label>
                          </div>
                          <textarea
                            id={`exp-know-${i}`}
                            rows={6}
                            value={(
                              t.knowBeforeYouGo ||
                              t.whatToCarry ||
                              []
                            ).join('\n')}
                            placeholder="Wear comfortable walking shoes&#10;Swimwear & beach towel&#10;Hat, sunglasses, and sunscreen&#10;Waterproof camera recommended"
                            onChange={(e) => {
                              const items = e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean);
                              updExcursion(i, 'knowBeforeYouGo', items);
                              updExcursion(i, 'whatToCarry', items);
                            }}
                            disabled={
                              !t.enabled ||
                              isDeleted ||
                              t.showKnowBeforeYouGo === false
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5. Single Excursion SEO & Meta */}
                    <div className="rounded-lg border border-sky-500/20 p-4 bg-background shadow-xs space-y-3">
                      <h5 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                        5. Single Excursion SEO &amp; Meta
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldRow
                          label="Meta Title (Optional)"
                          id={`exp-mtitle-${i}`}
                        >
                          <Input
                            id={`exp-mtitle-${i}`}
                            value={t.metaTitle || ''}
                            placeholder={
                              t.title
                                ? `${t.title} | Excursions Kenya`
                                : 'e.g. Wasini Dolphin Dhow Cruise | Excursions Kenya'
                            }
                            onChange={(e) =>
                              updExcursion(i, 'metaTitle', e.target.value)
                            }
                            disabled={!t.enabled || isDeleted}
                          />
                        </FieldRow>
                        <FieldRow
                          label="Meta Description (Optional)"
                          id={`exp-mdesc-${i}`}
                        >
                          <textarea
                            id={`exp-mdesc-${i}`}
                            rows={3}
                            value={t.metaDescription || ''}
                            placeholder="Overrides default meta description for this single excursion page..."
                            onChange={(e) =>
                              updExcursion(i, 'metaDescription', e.target.value)
                            }
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
