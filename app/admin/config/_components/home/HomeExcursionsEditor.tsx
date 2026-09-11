'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import type { ExcursionItem } from '@/types/app-config';
import { defaultConfig, defaultExcursionItems } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { PAGES } from '../shared/types';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { isExcursionMatch } from '@/lib/excursion-utils';

export function HomeExcursionsEditor({ draft, set }: EditorProps) {
  const fallbackExcursions = defaultConfig.homepage.excursions || {
    enabled: true,
    backgroundColor: '#ffffff',
    eyebrow: 'DAY EXPEDITIONS & EXCURSIONS',
    title: 'Handcrafted Day Excursions',
    subtitle: 'Immerse yourself in Kenya’s marine sanctuaries, coastal coral gardens, and ancient forests on guided day journeys back before evening.',
    items: defaultExcursionItems,
  };

  const data = draft.homepage.excursions || fallbackExcursions;
  const currentExcursionsPage = draft.excursionsPage || defaultConfig.excursionsPage!;
  const masterExcursions = currentExcursionsPage.tours?.items || defaultExcursionItems;
  const hpItems = draft.homepage.excursions?.items || masterExcursions;

  const excursionsPageNavLabel =
    draft.navigation?.find((l) => l.href === '/excursions' || l.href.startsWith('/excursions'))?.label ||
    PAGES.find((p) => p.id === 'excursions')?.label ||
    'Excursions';

  const updEnabled = (v: boolean) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        excursions: {
          ...(p.homepage.excursions || fallbackExcursions),
          enabled: v,
        },
      },
    }));

  const toggleFeaturedOnHome = (excursion: ExcursionItem, targetIndex: number, currentFeatured: boolean) =>
    set((p) => {
      const currentEp = p.excursionsPage || defaultConfig.excursionsPage!;
      const epItems = currentEp.tours?.items || defaultExcursionItems;
      const currentHp = p.homepage?.excursions?.items || epItems;

      const nextHpItems = [...currentHp];
      const matchIdx = nextHpItems.findIndex((t, idx) => isExcursionMatch(t, excursion, idx, targetIndex));

      if (matchIdx !== -1) {
        nextHpItems[matchIdx] = { ...nextHpItems[matchIdx], enabled: !currentFeatured };
      } else {
        const masterItem = epItems.find((t, idx) => isExcursionMatch(t, excursion, idx, targetIndex)) || excursion;
        nextHpItems.push({ ...masterItem, enabled: !currentFeatured });
      }

      return {
        ...p,
        homepage: {
          ...p.homepage,
          excursions: {
            ...(p.homepage?.excursions || fallbackExcursions),
            items: nextHpItems,
          },
        },
      };
    });

  const moveExcursionOnHome = (i: number, dir: -1 | 1) =>
    set((p) => {
      const currentHp = [...(p.homepage?.excursions?.items || masterExcursions)];
      const target = i + dir;
      if (target < 0 || target >= currentHp.length) return p;

      const temp = currentHp[i];
      currentHp[i] = currentHp[target];
      currentHp[target] = temp;

      return {
        ...p,
        homepage: {
          ...p.homepage,
          excursions: {
            ...(p.homepage?.excursions || fallbackExcursions),
            items: currentHp,
          },
        },
      };
    });

  // Build the list of excursions to show in the showcase manager
  const displayList: Array<{ excursion: ExcursionItem; isFeatured: boolean; masterIndex: number; homeIndex: number }> = [];

  hpItems.forEach((hpExc, hpIdx) => {
    const masterIdx = masterExcursions.findIndex((m, idx) => isExcursionMatch(m, hpExc, idx, hpIdx));
    const masterExc = masterIdx !== -1 ? masterExcursions[masterIdx] : hpExc;
    const isFeatured = hpExc.enabled !== false && !masterExc.deleted;
    displayList.push({
      excursion: { ...masterExc, ...hpExc, title: masterExc.title, price: masterExc.price, imageUrl: masterExc.imageUrl, duration: masterExc.duration, rating: masterExc.rating, badge: masterExc.badge },
      isFeatured,
      masterIndex: masterIdx !== -1 ? masterIdx : hpIdx,
      homeIndex: hpIdx,
    });
  });

  masterExcursions.forEach((masterExc, mIdx) => {
    const alreadyListed = displayList.some((d) => isExcursionMatch(d.excursion, masterExc, d.masterIndex, mIdx));
    if (!alreadyListed) {
      displayList.push({
        excursion: masterExc,
        isFeatured: masterExc.enabled !== false && !masterExc.deleted,
        masterIndex: mIdx,
        homeIndex: displayList.length,
      });
    }
  });

  const featuredCount = displayList.filter((d) => d.isFeatured && !d.excursion.deleted).length;

  return (
    <div className="space-y-6">
      <SectionToggle title="Handcrafted Excursions Section on Homepage" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker
        value={data.backgroundColor}
        onChange={(v) =>
          set((p) => ({
            ...p,
            homepage: {
              ...p.homepage,
              excursions: {
                ...(p.homepage.excursions || fallbackExcursions),
                backgroundColor: v,
              },
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
              excursions: {
                ...(p.homepage.excursions || fallbackExcursions),
                [k]: v,
              },
            },
          }))
        }
      />

      <div className="flex items-start gap-3 rounded-lg border border-teal-500/25 bg-teal-500/5 p-4 text-xs text-muted-foreground">
        <Compass className="h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
        <div className="space-y-1.5 flex-1">
          <p className="font-semibold text-foreground text-sm">Curated Showcase (Pulls from Excursions Master Catalog)</p>
          <p>
            The day excursions below are pulled directly from your <strong>{excursionsPageNavLabel}</strong> catalog. Use the toggles to choose which excursions appear on the homepage and adjust their display order.
          </p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-1">
            <ExternalLink className="h-3 w-3" /> To create new day excursions, edit pricing, or change detail sections, open <strong>{excursionsPageNavLabel}</strong> in the left menu.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Handcrafted Excursions on Homepage</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold">
              {featuredCount} of {displayList.length} Active on Home
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {displayList.map((item, i) => {
            const e = item.excursion;
            const isDeleted = Boolean(e.deleted);
            const isFeatured = item.isFeatured && !isDeleted;

            return (
              <div
                key={e.id || `he-${i}`}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-3.5 rounded-lg border transition-all ${
                  isDeleted
                    ? 'border-destructive/30 bg-destructive/5 opacity-60'
                    : isFeatured
                    ? 'border-teal-500/30 bg-card shadow-xs'
                    : 'border-border/60 bg-muted/20 opacity-75'
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border/80 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={e.imageUrl || '/images/hero/hero.jpg'}
                      alt={e.title}
                      className="h-full w-full object-cover"
                      onError={(ev) => {
                        (ev.target as HTMLImageElement).src = '/images/hero/hero.jpg';
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-xs font-bold text-foreground truncate max-w-[280px] sm:max-w-[360px]">
                        {e.title || 'Untitled Excursion'}
                      </h5>
                      {e.badge && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                          <Tag className="h-2.5 w-2.5" /> {e.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                      {e.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground/70" /> {e.duration}
                        </span>
                      )}
                      {e.price && (
                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                          {e.price}
                        </span>
                      )}
                      {typeof e.rating === 'number' && (
                        <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                          <Star className="h-3 w-3 fill-current" /> {e.rating}
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
                      onClick={() => moveExcursionOnHome(item.homeIndex, -1)}
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
                      onClick={() => moveExcursionOnHome(item.homeIndex, 1)}
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
                      onCheckedChange={() => toggleFeaturedOnHome(e, item.masterIndex, isFeatured)}
                      title={isFeatured ? 'Click to hide from Home' : 'Click to feature on Home'}
                    />
                    <span className="text-xs font-semibold text-foreground select-none hidden sm:inline">
                      {isFeatured ? 'Featured' : 'Hidden'}
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
