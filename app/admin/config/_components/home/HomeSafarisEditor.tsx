"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Compass,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Star,
  Clock,
  Tag,
  CheckCircle2,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import type { TourItem } from "@/types/app-config";
import { defaultConfig } from "@/config/default-config";
import type { EditorProps } from "../shared/types";
import { PAGES } from "../shared/types";
import { SectionToggle } from "../shared/SectionToggle";
import { BackgroundColorPicker } from "../shared/BackgroundColorPicker";
import { SectionHeaderFields } from "../shared/SectionHeaderFields";
import { isTourMatch } from "../shared/admin-helpers";

export function HomeSafarisEditor({ draft, set }: EditorProps) {
  const data = draft.homepage.tours;
  const currentToursPage = draft.toursPage || defaultConfig.toursPage!;
  const masterTours =
    currentToursPage.tours?.items || defaultConfig.toursPage!.tours.items;
  const hpItems = draft.homepage.tours?.items || masterTours;

  const toursPageNavLabel =
    draft.navigation?.find(
      (l) => l.href === "/safaris" || l.href.startsWith("/safaris"),
    )?.label ||
    PAGES.find((p) => p.id === "tours")?.label ||
    "Safaris";

  const updEnabled = (v: boolean) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        tours: { ...p.homepage.tours, enabled: v },
      },
    }));

  const toggleFeaturedOnHome = (
    tour: TourItem,
    targetIndex: number,
    currentFeatured: boolean,
  ) =>
    set((p) => {
      const currentTp = p.toursPage || defaultConfig.toursPage!;
      const tpItems =
        currentTp.tours?.items || defaultConfig.toursPage!.tours.items;
      const currentHp = p.homepage?.tours?.items || tpItems;

      const nextHpItems = [...currentHp];
      const matchIdx = nextHpItems.findIndex((t, idx) =>
        isTourMatch(t, tour, idx, targetIndex),
      );

      if (matchIdx !== -1) {
        nextHpItems[matchIdx] = {
          ...nextHpItems[matchIdx],
          enabled: !currentFeatured,
        };
      } else {
        // Find in master and push with toggled enabled
        const masterItem =
          tpItems.find((t, idx) => isTourMatch(t, tour, idx, targetIndex)) ||
          tour;
        nextHpItems.push({ ...masterItem, enabled: !currentFeatured });
      }

      return {
        ...p,
        homepage: {
          ...p.homepage,
          tours: {
            ...(p.homepage?.tours || defaultConfig.homepage.tours),
            items: nextHpItems,
          },
        },
      };
    });

  const moveTourOnHome = (i: number, dir: -1 | 1) =>
    set((p) => {
      const currentHp = [...(p.homepage?.tours?.items || masterTours)];
      const target = i + dir;
      if (target < 0 || target >= currentHp.length) return p;

      const temp = currentHp[i];
      currentHp[i] = currentHp[target];
      currentHp[target] = temp;

      return {
        ...p,
        homepage: {
          ...p.homepage,
          tours: {
            ...(p.homepage?.tours || defaultConfig.homepage.tours),
            items: currentHp,
          },
        },
      };
    });

  // Build the list of packages to show in the showcase manager
  const displayList: Array<{
    tour: TourItem;
    isFeatured: boolean;
    masterIndex: number;
    homeIndex: number;
  }> = [];

  hpItems.forEach((hpTour, hpIdx) => {
    const masterIdx = masterTours.findIndex((m, idx) =>
      isTourMatch(m, hpTour, idx, hpIdx),
    );
    const masterTour = masterIdx !== -1 ? masterTours[masterIdx] : hpTour;
    const isFeatured = hpTour.enabled !== false && !masterTour.deleted;
    displayList.push({
      tour: {
        ...masterTour,
        ...hpTour,
        title: masterTour.title,
        price: masterTour.price,
        imageUrl: masterTour.imageUrl,
        duration: masterTour.duration,
        rating: masterTour.rating,
        badge: masterTour.badge,
      },
      isFeatured,
      masterIndex: masterIdx !== -1 ? masterIdx : hpIdx,
      homeIndex: hpIdx,
    });
  });

  // Include any master catalog items missing from hpItems
  masterTours.forEach((masterTour, mIdx) => {
    const alreadyListed = displayList.some((d) =>
      isTourMatch(d.tour, masterTour, d.masterIndex, mIdx),
    );
    if (!alreadyListed) {
      displayList.push({
        tour: masterTour,
        isFeatured: masterTour.enabled !== false && !masterTour.deleted,
        masterIndex: mIdx,
        homeIndex: displayList.length,
      });
    }
  });

  const featuredCount = displayList.filter(
    (d) => d.isFeatured && !d.tour.deleted,
  ).length;

  return (
    <div className="space-y-6">
      <SectionToggle
        title="Featured Safaris Section on Homepage"
        enabled={data.enabled}
        onChange={updEnabled}
      />
      <BackgroundColorPicker
        value={data.backgroundColor}
        onChange={(v) =>
          set((p) => ({
            ...p,
            homepage: {
              ...p.homepage,
              tours: { ...p.homepage.tours, backgroundColor: v },
            },
          }))
        }
      />

      <SectionHeaderFields
        data={data}
        onChange={(k, v) =>
          set((p) => ({
            ...p,
            homepage: {
              ...p.homepage,
              tours: { ...p.homepage.tours, [k]: v },
            },
          }))
        }
      />

      <div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4 text-xs text-muted-foreground">
        <Compass className="h-5 w-5 shrink-0 text-primary mt-0.5" />
        <div className="space-y-1.5 flex-1">
          <p className="font-semibold text-foreground text-sm">
            Curated Showcase (Pulls from Safaris Master Catalog)
          </p>
          <p>
            The packages below are pulled directly from your{" "}
            <strong>{toursPageNavLabel}</strong> catalog. Use the toggles to
            choose which safaris are featured on the homepage and adjust their
            display order.
          </p>
          <p className="text-[11px] text-primary font-medium flex items-center gap-1 mt-1">
            <ExternalLink className="h-3 w-3" /> To create new safari packages,
            edit pricing, or change day-by-day itineraries, open{" "}
            <strong>{toursPageNavLabel}</strong> in the left menu.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">
              Featured Safaris on Homepage
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
              {featuredCount} of {displayList.length} Active on Home
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {displayList.map((item, i) => {
            const t = item.tour;
            const isDeleted = Boolean(t.deleted);
            const isFeatured = item.isFeatured && !isDeleted;

            return (
              <div
                key={t.id || `ht-${i}`}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-3.5 rounded-lg border transition-all ${
                  isDeleted
                    ? "border-destructive/30 bg-destructive/5 opacity-60"
                    : isFeatured
                      ? "border-primary/30 bg-card shadow-xs"
                      : "border-border/60 bg-muted/20 opacity-75"
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border/80 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.imageUrl || "/images/hero/hero.jpg"}
                      alt={t.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/hero/hero.jpg";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-xs font-bold text-foreground truncate max-w-[280px] sm:max-w-[360px]">
                        {t.title || "Untitled Safari Package"}
                      </h5>
                      {t.badge && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded">
                          <Tag className="h-2.5 w-2.5" /> {t.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                      {t.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground/70" />{" "}
                          {t.duration}
                        </span>
                      )}
                      {t.price && (
                        <span className="font-semibold text-primary">
                          {t.price}
                        </span>
                      )}
                      {typeof t.rating === "number" && (
                        <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                          <Star className="h-3 w-3 fill-current" /> {t.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status, Reorder & Feature Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                  {/* Status Badge */}
                  <div>
                    {isDeleted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                        <AlertCircle className="h-3 w-3" /> Inactive in Catalog
                      </span>
                    ) : isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" /> Featured on Home
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        <EyeOff className="h-3 w-3" /> Hidden on Home
                      </span>
                    )}
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={i === 0 || isDeleted}
                      onClick={() => moveTourOnHome(item.homeIndex, -1)}
                      title="Move up in homepage order"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={i === displayList.length - 1 || isDeleted}
                      onClick={() => moveTourOnHome(item.homeIndex, 1)}
                      title="Move down in homepage order"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Feature Toggle Switch */}
                  <div className="flex items-center gap-2 pl-2 border-l border-border/60">
                    <Switch
                      checked={isFeatured}
                      disabled={isDeleted}
                      onCheckedChange={() =>
                        toggleFeaturedOnHome(t, item.masterIndex, isFeatured)
                      }
                      title={
                        isFeatured
                          ? "Click to hide from Home"
                          : "Click to feature on Home"
                      }
                    />
                    <span className="text-xs font-semibold text-foreground select-none hidden sm:inline">
                      {isFeatured ? "Featured" : "Hidden"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
