import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Compass, Sparkles, Link2, Link2Off, Trash2, Plus } from 'lucide-react';
import type { NavItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { slugifyNavRoute, NAV_PRESETS } from '../shared/admin-helpers';

export function NavigationEditor({ draft, set }: EditorProps) {
  const nav = draft.navigation || defaultConfig.navigation;
  const [autoSync, setAutoSync] = useState<Record<number, boolean>>({});

  const updItem = (i: number, k: keyof NavItem, v: string | boolean) =>
    set((p) => {
      const arr = [...(p.navigation || defaultConfig.navigation)];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, navigation: arr };
    });

  const handleLabelChange = (i: number, newLabel: string) => {
    const isSynced = autoSync[i] !== false;
    set((p) => {
      const arr = [...(p.navigation || defaultConfig.navigation)];
      if (isSynced) {
        arr[i] = { ...arr[i], label: newLabel, href: slugifyNavRoute(newLabel) };
      } else {
        arr[i] = { ...arr[i], label: newLabel };
      }
      return { ...p, navigation: arr };
    });
  };

  const handleHrefChange = (i: number, newHref: string) => {
    // When manually typed, unlock from auto-sync
    setAutoSync((prev) => ({ ...prev, [i]: false }));
    updItem(i, 'href', newHref);
  };

  const toggleAutoSync = (i: number, currentLabel: string) => {
    const willBeSynced = autoSync[i] === false;
    setAutoSync((prev) => ({ ...prev, [i]: willBeSynced }));
    if (willBeSynced) {
      updItem(i, 'href', slugifyNavRoute(currentLabel));
    }
  };

  const applyPreset = (i: number, presetHref: string) => {
    setAutoSync((prev) => ({ ...prev, [i]: false }));
    updItem(i, 'href', presetHref);
  };

  const addNavItem = () => {
    const newIdx = nav.length;
    setAutoSync((prev) => ({ ...prev, [newIdx]: true }));
    set((p) => {
      const current = p.navigation || defaultConfig.navigation;
      return {
        ...p,
        navigation: [
          ...current,
          { key: `custom-${Date.now()}`, label: 'New Link', href: '/new-link', icon: 'Link', enabled: true },
        ],
      };
    });
  };

  const rmNavItem = (i: number) =>
    set((p) => {
      const current = p.navigation || defaultConfig.navigation;
      return {
        ...p,
        navigation: current.filter((_, idx) => idx !== i),
      };
    });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" />
          Header Navigation Links
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Manage the navigation links in the top navbar. URLs automatically derive from link labels by default, or you can unlock and customize any route manually.
        </p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p>
          <strong>Dynamic Auto-Sync:</strong> Typing in <em>Label</em> automatically generates the route slug (e.g. &ldquo;Safaris&rdquo; &rarr; <code className="bg-muted px-1 rounded font-mono text-[11px]">/safaris</code> or custom slug). Click the <strong>🔗 Link Icon</strong> to toggle between auto-generation and custom manual URLs.
        </p>
      </div>

      <div className="space-y-3">
        {nav.map((item, idx) => {
          const isSynced = autoSync[idx] !== false;
          return (
            <div key={idx} className="rounded-lg border border-border p-4 bg-card space-y-3">
              <div className="flex items-start gap-4">
                <div className="pt-2">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(v) => updItem(idx, 'enabled', v)}
                    title={item.enabled ? 'Enabled' : 'Disabled'}
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldRow label="Label" id={`nav-label-${idx}`}>
                    <Input
                      id={`nav-label-${idx}`}
                      value={item.label}
                      onChange={(e) => handleLabelChange(idx, e.target.value)}
                      disabled={!item.enabled}
                      placeholder="e.g. Safaris"
                      className="text-xs font-medium"
                    />
                  </FieldRow>
                  <FieldRow label="URL / Route" id={`nav-href-${idx}`}>
                    <div className="relative flex items-center">
                      <Input
                        id={`nav-href-${idx}`}
                        value={item.href}
                        onChange={(e) => handleHrefChange(idx, e.target.value)}
                        disabled={!item.enabled}
                        placeholder="/safaris or https://..."
                        className="text-xs font-mono pr-20"
                      />
                      <div className="absolute right-1 flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAutoSync(idx, item.label)}
                          disabled={!item.enabled}
                          className={`h-7 px-2 text-[10px] gap-1 ${
                            isSynced
                              ? 'text-primary bg-primary/10 hover:bg-primary/20'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          title={isSynced ? 'Auto-syncing from Label (click to unlock)' : 'Custom URL (click to auto-sync)'}
                        >
                          {isSynced ? (
                            <>
                              <Link2 className="h-3 w-3" />
                              <span>Auto</span>
                            </>
                          ) : (
                            <>
                              <Link2Off className="h-3 w-3" />
                              <span>Custom</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </FieldRow>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0 mt-6"
                  onClick={() => rmNavItem(idx)}
                  title="Remove Link"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick page preset chips */}
              <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-[11px] text-muted-foreground flex-wrap">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground/70">Quick Presets:</span>
                {NAV_PRESETS.map((p) => (
                  <button
                    key={p.href}
                    type="button"
                    onClick={() => applyPreset(idx, p.href)}
                    disabled={!item.enabled}
                    className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                      item.href === p.href
                        ? 'bg-primary/15 border-primary/40 text-primary font-semibold'
                        : 'bg-muted/40 hover:bg-muted border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {p.label} <span className="font-mono text-[10px] opacity-70">({p.href})</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={addNavItem}>
        <Plus className="h-4 w-4" /> Add Nav Link
      </Button>
    </div>
  );
}
