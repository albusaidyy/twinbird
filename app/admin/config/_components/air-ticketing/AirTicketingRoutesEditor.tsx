import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown, Globe, MapPin } from 'lucide-react';
import type { AirTicketingRoute } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';

export function AirTicketingRoutesEditor({ draft, set }: EditorProps) {
  const atp = draft.airTicketingPage || defaultConfig.airTicketingPage!;
  const rs = atp.routesSection || { enabled: true, title: 'Flight Routes & Connections', subtitle: '', note: '', routes: [] };
  const routes = rs.routes || [];

  const [activeTab, setActiveTab] = useState<'local' | 'international'>('local');

  const upd = (k: string, v: unknown) =>
    set((p) => {
      const current = p.airTicketingPage || defaultConfig.airTicketingPage!;
      return {
        ...p,
        airTicketingPage: {
          ...current,
          routesSection: { ...current.routesSection, [k]: v },
        },
      };
    });

  const updRouteByRef = (targetRoute: AirTicketingRoute, k: string, v: unknown) => {
    const globalIdx = routes.indexOf(targetRoute);
    if (globalIdx === -1) return;
    const updated = [...routes];
    updated[globalIdx] = { ...updated[globalIdx], [k]: v };
    upd('routes', updated);
  };

  const addRoute = (category: 'local' | 'international') => {
    const newRoute: AirTicketingRoute = {
      id: `flight-${Date.now()}`,
      from: category === 'local' ? 'Nairobi Wilson (WIL)' : 'Nairobi (NBO)',
      to: category === 'local' ? 'Maasai Mara (MRE)' : 'Zanzibar (ZNZ)',
      duration: category === 'local' ? '~45 min' : '~1 hr 15 min',
      price: category === 'local' ? '$180' : '$195',
      priceLabel: 'per person',
      airline: category === 'local' ? 'Safarilink / AirKenya' : 'Kenya Airways',
      category,
      popular: false,
      enabled: true,
    };
    upd('routes', [...routes, newRoute]);
  };

  const removeRouteByRef = (targetRoute: AirTicketingRoute) => {
    upd('routes', routes.filter((r) => r !== targetRoute && r.id !== targetRoute.id));
  };

  const moveRouteInCategory = (category: 'local' | 'international', indexInCategory: number, direction: -1 | 1) => {
    const catRoutes = routes.filter((r) => (r.category || 'local') === category);
    const targetCatIdx = indexInCategory + direction;
    if (targetCatIdx < 0 || targetCatIdx >= catRoutes.length) return;

    const currentItem = catRoutes[indexInCategory];
    const targetItem = catRoutes[targetCatIdx];

    const currentGlobalIdx = routes.indexOf(currentItem);
    const targetGlobalIdx = routes.indexOf(targetItem);

    if (currentGlobalIdx === -1 || targetGlobalIdx === -1) return;

    const reordered = [...routes];
    reordered[currentGlobalIdx] = targetItem;
    reordered[targetGlobalIdx] = currentItem;
    upd('routes', reordered);
  };

  const localRoutes = routes.filter((r) => (r.category || 'local') === 'local');
  const internationalRoutes = routes.filter((r) => r.category === 'international');

  return (
    <div className="space-y-6">
      <SectionToggle title="Enable Flight Routes Section" enabled={rs.enabled !== false} onChange={(v) => upd('enabled', v)} />
      
      {/* Global Section Titles */}
      <div className="space-y-3">
        <FieldRow label="Main Section Title" id="atr-title">
          <Input id="atr-title" value={rs.title || ''} onChange={(e) => upd('title', e.target.value)} disabled={rs.enabled === false} />
        </FieldRow>
        <FieldRow label="Main Section Subtitle" id="atr-sub">
          <Input id="atr-sub" value={rs.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} disabled={rs.enabled === false} />
        </FieldRow>
        <FieldRow label="Footer Note" id="atr-note">
          <Input id="atr-note" value={rs.note || ''} onChange={(e) => upd('note', e.target.value)} disabled={rs.enabled === false} />
        </FieldRow>
      </div>

      <Separator />

      {/* Prominent Separated Category Tabs */}
      <div className="flex items-center gap-2 bg-muted p-1.5 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('local')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'local'
              ? 'bg-background text-amber-700 dark:text-amber-400 shadow-xs ring-1 ring-amber-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Local & Domestic Routes ({localRoutes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('international')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'international'
              ? 'bg-background text-blue-700 dark:text-blue-400 shadow-xs ring-1 ring-blue-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>International & Regional Routes ({internationalRoutes.length})</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* TAB 1: LOCAL & DOMESTIC ROUTES                             */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'local' && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <div className="bg-amber-500/5 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5" />
              <span>Local & Domestic Column Headers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow label="Column Title" id="atr-ltitle">
                <Input
                  id="atr-ltitle"
                  value={rs.localTitle || ''}
                  placeholder="Local & Domestic Flights"
                  onChange={(e) => upd('localTitle', e.target.value)}
                  disabled={rs.enabled === false}
                />
              </FieldRow>
              <FieldRow label="Column Subtitle" id="atr-lsub">
                <Input
                  id="atr-lsub"
                  value={rs.localSubtitle || ''}
                  placeholder="Scenic safari bush flights and coastal shuttles"
                  onChange={(e) => upd('localSubtitle', e.target.value)}
                  disabled={rs.enabled === false}
                />
              </FieldRow>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Local Flight Routes ({localRoutes.length})</h4>
              <p className="text-xs text-muted-foreground">Domestic coastal shuttles & safari bush airstrip connections.</p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => addRoute('local')}
              disabled={rs.enabled === false}
              className="text-xs h-8 gap-1 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add Local Route
            </Button>
          </div>

          <div className="space-y-3">
            {localRoutes.map((r, catIdx) => (
              <div
                key={r.id || catIdx}
                className="rounded-xl border p-4 bg-card space-y-3 shadow-xs"
                style={{ opacity: r.enabled !== false ? 1 : 0.55 }}
              >
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Switch
                      checked={r.enabled !== false}
                      onCheckedChange={(v) => updRouteByRef(r, 'enabled', v)}
                      disabled={rs.enabled === false}
                    />
                    <span className="font-semibold text-xs text-foreground">
                      #{catIdx + 1}: {r.from} → {r.to}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      Local / Bush
                    </span>
                    {r.popular && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={catIdx === 0 || rs.enabled === false}
                      onClick={() => moveRouteInCategory('local', catIdx, -1)}
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={catIdx === localRoutes.length - 1 || rs.enabled === false}
                      onClick={() => moveRouteInCategory('local', catIdx, 1)}
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRouteByRef(r)}
                      disabled={rs.enabled === false}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      title="Delete route"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <FieldRow label="Departure (From)" id={`lrf-${catIdx}`}>
                    <Input id={`lrf-${catIdx}`} value={r.from} onChange={(e) => updRouteByRef(r, 'from', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Destination (To)" id={`lrt-${catIdx}`}>
                    <Input id={`lrt-${catIdx}`} value={r.to} onChange={(e) => updRouteByRef(r, 'to', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Flight Duration" id={`lrd-${catIdx}`}>
                    <Input id={`lrd-${catIdx}`} value={r.duration} onChange={(e) => updRouteByRef(r, 'duration', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Carrier / Airline" id={`lra-${catIdx}`}>
                    <Input id={`lra-${catIdx}`} value={r.airline || ''} placeholder="e.g. Safarilink / AirKenya" onChange={(e) => updRouteByRef(r, 'airline', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Price (e.g. $180)" id={`lrp-${catIdx}`}>
                    <Input id={`lrp-${catIdx}`} value={r.price || ''} onChange={(e) => updRouteByRef(r, 'price', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Price Label" id={`lrpl-${catIdx}`}>
                    <Input id={`lrpl-${catIdx}`} value={r.priceLabel || ''} onChange={(e) => updRouteByRef(r, 'priceLabel', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={Boolean(r.popular)} onCheckedChange={(v) => updRouteByRef(r, 'popular', v)} id={`lrp-pop-${catIdx}`} disabled={rs.enabled === false} />
                    <Label htmlFor={`lrp-pop-${catIdx}`} className="text-xs cursor-pointer font-medium">Badge as Popular Route</Label>
                  </div>
                </div>
              </div>
            ))}

            {localRoutes.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-xs">
                No local routes configured. Click &quot;+ Add Local Route&quot; above to add one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* TAB 2: INTERNATIONAL & REGIONAL ROUTES                     */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'international' && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <div className="bg-blue-500/5 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5" />
              <span>International & Regional Column Headers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow label="Column Title" id="atr-ititle">
                <Input
                  id="atr-ititle"
                  value={rs.internationalTitle || ''}
                  placeholder="International & Regional Flights"
                  onChange={(e) => upd('internationalTitle', e.target.value)}
                  disabled={rs.enabled === false}
                />
              </FieldRow>
              <FieldRow label="Column Subtitle" id="atr-isub">
                <Input
                  id="atr-isub"
                  value={rs.internationalSubtitle || ''}
                  placeholder="Seamless cross-border hops & global connections"
                  onChange={(e) => upd('internationalSubtitle', e.target.value)}
                  disabled={rs.enabled === false}
                />
              </FieldRow>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">International Flight Routes ({internationalRoutes.length})</h4>
              <p className="text-xs text-muted-foreground">Cross-border hops, regional safari corridors & global routes.</p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => addRoute('international')}
              disabled={rs.enabled === false}
              className="text-xs h-8 gap-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add International Route
            </Button>
          </div>

          <div className="space-y-3">
            {internationalRoutes.map((r, catIdx) => (
              <div
                key={r.id || catIdx}
                className="rounded-xl border p-4 bg-card space-y-3 shadow-xs"
                style={{ opacity: r.enabled !== false ? 1 : 0.55 }}
              >
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Switch
                      checked={r.enabled !== false}
                      onCheckedChange={(v) => updRouteByRef(r, 'enabled', v)}
                      disabled={rs.enabled === false}
                    />
                    <span className="font-semibold text-xs text-foreground">
                      #{catIdx + 1}: {r.from} → {r.to}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                      International
                    </span>
                    {r.popular && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={catIdx === 0 || rs.enabled === false}
                      onClick={() => moveRouteInCategory('international', catIdx, -1)}
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={catIdx === internationalRoutes.length - 1 || rs.enabled === false}
                      onClick={() => moveRouteInCategory('international', catIdx, 1)}
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRouteByRef(r)}
                      disabled={rs.enabled === false}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      title="Delete route"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <FieldRow label="Departure (From)" id={`irf-${catIdx}`}>
                    <Input id={`irf-${catIdx}`} value={r.from} onChange={(e) => updRouteByRef(r, 'from', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Destination (To)" id={`irt-${catIdx}`}>
                    <Input id={`irt-${catIdx}`} value={r.to} onChange={(e) => updRouteByRef(r, 'to', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Flight Duration" id={`ird-${catIdx}`}>
                    <Input id={`ird-${catIdx}`} value={r.duration} onChange={(e) => updRouteByRef(r, 'duration', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Carrier / Airline" id={`ira-${catIdx}`}>
                    <Input id={`ira-${catIdx}`} value={r.airline || ''} placeholder="e.g. Kenya Airways / British Airways" onChange={(e) => updRouteByRef(r, 'airline', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Price (e.g. $195)" id={`irp-${catIdx}`}>
                    <Input id={`irp-${catIdx}`} value={r.price || ''} onChange={(e) => updRouteByRef(r, 'price', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <FieldRow label="Price Label" id={`irpl-${catIdx}`}>
                    <Input id={`irpl-${catIdx}`} value={r.priceLabel || ''} onChange={(e) => updRouteByRef(r, 'priceLabel', e.target.value)} disabled={rs.enabled === false} />
                  </FieldRow>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={Boolean(r.popular)} onCheckedChange={(v) => updRouteByRef(r, 'popular', v)} id={`irp-pop-${catIdx}`} disabled={rs.enabled === false} />
                    <Label htmlFor={`irp-pop-${catIdx}`} className="text-xs cursor-pointer font-medium">Badge as Popular Route</Label>
                  </div>
                </div>
              </div>
            ))}

            {internationalRoutes.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-xs">
                No international routes configured. Click &quot;+ Add International Route&quot; above to add one.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
