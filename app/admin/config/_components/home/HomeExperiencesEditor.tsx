'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import type { ExperienceItem } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { defaultConfig, defaultExperienceItems } from '@/config/default-config';
import { getIcon } from '@/lib/icons';

const ICON_SUGGESTIONS = [
  'Trees',
  'Compass',
  'Car',
  'Bus',
  'Ship',
  'Plane',
  'Navigation',
  'Luggage',
  'Sparkles',
  'Shield',
  'Star',
  'Award',
  'TreePine',
  'Fish',
  'HeartHandshake',
];

const QUICK_ROUTES = [
  { label: 'Air Ticketing', href: '/air-ticketing' },
  { label: 'Safaris', href: '/safaris' },
  { label: 'Excursions', href: '/excursions' },
  { label: 'Transfers', href: '/transfers' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
];

export function HomeExperiencesEditor({ draft, set }: EditorProps) {
  const experiences = draft.homepage.experiences || defaultConfig.homepage.experiences || {
    enabled: true,
    backgroundColor: '#fbf9f5',
    eyebrow: 'WHAT WE OFFER',
    title: 'Our experiences',
    subtitle: 'Tailored journeys designed to connect you deeply with the spirit of the wild.',
    items: defaultExperienceItems,
  };

  const items = experiences.items || [];

  const updEnabled = (v: boolean) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        experiences: {
          ...(p.homepage.experiences || experiences),
          enabled: v,
        },
      },
    }));

  const updBg = (v: string) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        experiences: {
          ...(p.homepage.experiences || experiences),
          backgroundColor: v,
        },
      },
    }));

  const updHeader = (k: 'eyebrow' | 'title' | 'subtitle', v: string) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        experiences: {
          ...(p.homepage.experiences || experiences),
          [k]: v,
        },
      },
    }));

  const updItem = (i: number, k: keyof ExperienceItem, v: string | boolean) =>
    set((p) => {
      const curr = p.homepage.experiences || experiences;
      const arr = [...(curr.items || [])];
      arr[i] = { ...arr[i], [k]: v };
      return {
        ...p,
        homepage: {
          ...p.homepage,
          experiences: { ...curr, items: arr },
        },
      };
    });

  const moveItem = (i: number, direction: 'up' | 'down') =>
    set((p) => {
      const curr = p.homepage.experiences || experiences;
      const arr = [...(curr.items || [])];
      const targetIdx = direction === 'up' ? i - 1 : i + 1;
      if (targetIdx < 0 || targetIdx >= arr.length) return p;
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;
      return {
        ...p,
        homepage: {
          ...p.homepage,
          experiences: { ...curr, items: arr },
        },
      };
    });

  const addItem = () =>
    set((p) => {
      const curr = p.homepage.experiences || experiences;
      const newItem: ExperienceItem = {
        id: `exp-${Date.now()}`,
        icon: 'Sparkles',
        title: 'New Offering',
        description: 'Describe the core journey or service offered to travelers.',
        ctaLabel: 'Learn More',
        ctaHref: '/safaris',
        enabled: true,
      };
      return {
        ...p,
        homepage: {
          ...p.homepage,
          experiences: {
            ...curr,
            items: [...(curr.items || []), newItem],
          },
        },
      };
    });

  const rmItem = (i: number) =>
    set((p) => {
      const curr = p.homepage.experiences || experiences;
      return {
        ...p,
        homepage: {
          ...p.homepage,
          experiences: {
            ...curr,
            items: (curr.items || []).filter((_, idx) => idx !== i),
          },
        },
      };
    });

  return (
    <div className="space-y-6">
      <SectionToggle
        title="Experiences Section"
        enabled={experiences.enabled}
        onChange={updEnabled}
      />

      <BackgroundColorPicker
        value={experiences.backgroundColor || '#fbf9f5'}
        onChange={updBg}
      />

      <SectionHeaderFields
        data={experiences}
        onChange={(k, v) => updHeader(k, v)}
      />

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Experience Offerings ({items.length})
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Card offerings linking directly to your core routes (Safaris, Excursions, Transfers).
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addItem}
          className="gap-1 text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Add Offering
        </Button>
      </div>

      {items.map((item, i) => {
        const IconComponent = getIcon(item.icon || 'Compass');
        return (
          <div
            key={item.id || `exp-editor-${i}`}
            className="relative rounded-xl border border-border p-5 pt-12 bg-card space-y-4"
          >
            {/* Top Toolbar */}
            <div className="absolute top-3 left-4 right-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Switch
                  checked={item.enabled !== false}
                  onCheckedChange={(v) => updItem(i, 'enabled', v)}
                />
                <span className="text-xs text-muted-foreground font-medium">
                  {item.enabled !== false ? 'Shown' : 'Hidden'}
                </span>
                <span className="text-xs font-semibold text-foreground/70 bg-muted px-2 py-0.5 rounded-md">
                  Offering #{i + 1}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  disabled={i === 0}
                  onClick={() => moveItem(i, 'up')}
                  title="Move Up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  disabled={i === items.length - 1}
                  onClick={() => moveItem(i, 'down')}
                  title="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  onClick={() => rmItem(i)}
                  title="Delete Offering"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div
              className="space-y-4 transition-opacity"
              style={{ opacity: item.enabled !== false ? 1 : 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow label="Title" id={`exp-title-${i}`}>
                  <Input
                    id={`exp-title-${i}`}
                    value={item.title}
                    onChange={(e) => updItem(i, 'title', e.target.value)}
                    placeholder="e.g. Tailored Safaris"
                    disabled={item.enabled === false}
                  />
                </FieldRow>

                <div>
                  <FieldRow label="Icon (Lucide Name)" id={`exp-icon-${i}`}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <Input
                        id={`exp-icon-${i}`}
                        value={item.icon}
                        onChange={(e) => updItem(i, 'icon', e.target.value)}
                        placeholder="e.g. Trees, Compass, Car"
                        disabled={item.enabled === false}
                      />
                    </div>
                  </FieldRow>
                  {/* Icon Suggestions */}
                  <div className="flex flex-wrap gap-1 mt-1.5 pl-11">
                    {ICON_SUGGESTIONS.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => updItem(i, 'icon', iconName)}
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                          item.icon === iconName
                            ? 'bg-primary text-primary-foreground border-primary font-medium'
                            : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {iconName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <FieldRow label="Description" id={`exp-desc-${i}`}>
                <textarea
                  id={`exp-desc-${i}`}
                  rows={2}
                  value={item.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updItem(i, 'description', e.target.value)}
                  placeholder="Private and group expeditions through Kenya's most legendary parks..."
                  disabled={item.enabled === false}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                />
              </FieldRow>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <FieldRow label="Button / CTA Label" id={`exp-cta-label-${i}`}>
                  <Input
                    id={`exp-cta-label-${i}`}
                    value={item.ctaLabel}
                    onChange={(e) => updItem(i, 'ctaLabel', e.target.value)}
                    placeholder="e.g. Explore Tours"
                    disabled={item.enabled === false}
                  />
                </FieldRow>

                <div>
                  <FieldRow label="Destination URL (Href)" id={`exp-cta-href-${i}`}>
                    <Input
                      id={`exp-cta-href-${i}`}
                      value={item.ctaHref}
                      onChange={(e) => updItem(i, 'ctaHref', e.target.value)}
                      placeholder="/safaris"
                      disabled={item.enabled === false}
                    />
                  </FieldRow>
                  {/* Quick Route Presets */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {QUICK_ROUTES.map((route) => (
                      <button
                        key={route.href}
                        type="button"
                        onClick={() => updItem(i, 'ctaHref', route.href)}
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                          item.ctaHref === route.href
                            ? 'bg-primary text-primary-foreground border-primary font-medium'
                            : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {route.label} ({route.href})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm">
          No experience offerings added yet. Click &quot;Add Offering&quot; above to create one.
        </div>
      )}
    </div>
  );
}
