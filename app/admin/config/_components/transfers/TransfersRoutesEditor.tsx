import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';

export function TransfersRoutesEditor({ draft, set }: EditorProps) {
  const tp = draft.transfersPage || defaultConfig.transfersPage!;
  const rs = tp.routesSection;
  const routes = rs.routes || [];

  const upd = (k: string, v: unknown) =>
    set((p) => {
      const current = p.transfersPage || defaultConfig.transfersPage!;
      return {
        ...p,
        transfersPage: {
          ...current,
          routesSection: { ...current.routesSection, [k]: v },
        },
      };
    });

  const updRoute = (index: number, k: string, v: unknown) => {
    const updated = [...routes];
    updated[index] = { ...updated[index], [k]: v };
    upd('routes', updated);
  };

  const addRoute = () => {
    const newRoute = {
      id: `route-${Date.now()}`,
      from: 'Mombasa Airport (MBA)',
      to: 'Watamu',
      duration: '~2 hrs',
      price: '$65',
      priceLabel: 'per vehicle',
      popular: false,
      enabled: true,
    };
    upd('routes', [...routes, newRoute]);
  };

  const removeRoute = (index: number) => {
    upd('routes', routes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="Enable Routes Section" enabled={rs.enabled !== false} onChange={(v) => upd('enabled', v)} />
      <FieldRow label="Section Title" id="trr-title">
        <Input id="trr-title" value={rs.title || ''} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>
      <FieldRow label="Section Subtitle" id="trr-sub">
        <Input id="trr-sub" value={rs.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} />
      </FieldRow>
      <FieldRow label="Footer Note" id="trr-note">
        <Input id="trr-note" value={rs.note || ''} onChange={(e) => upd('note', e.target.value)} />
      </FieldRow>

      <Separator />

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Available Route Items ({routes.length})</h4>
        <Button type="button" size="sm" onClick={addRoute} className="text-xs h-8 gap-1">
          <Plus className="h-3.5 w-3.5" /> Add Route
        </Button>
      </div>

      <div className="space-y-3">
        {routes.map((r, idx) => (
          <div key={r.id || idx} className="rounded-xl border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-xs">Route #{idx + 1}</span>
              <div className="flex items-center gap-2">
                <Switch checked={r.enabled !== false} onCheckedChange={(v) => updRoute(idx, 'enabled', v)} />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeRoute(idx)} className="h-7 w-7 p-0 text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow label="Origin (From)" id={`rf-${idx}`}>
                <Input id={`rf-${idx}`} value={r.from} onChange={(e) => updRoute(idx, 'from', e.target.value)} />
              </FieldRow>
              <FieldRow label="Destination (To)" id={`rt-${idx}`}>
                <Input id={`rt-${idx}`} value={r.to} onChange={(e) => updRoute(idx, 'to', e.target.value)} />
              </FieldRow>
              <FieldRow label="Estimated Duration" id={`rd-${idx}`}>
                <Input id={`rd-${idx}`} value={r.duration} onChange={(e) => updRoute(idx, 'duration', e.target.value)} />
              </FieldRow>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={Boolean(r.popular)} onCheckedChange={(v) => updRoute(idx, 'popular', v)} id={`rp-${idx}`} />
                <Label htmlFor={`rp-${idx}`} className="text-xs cursor-pointer">Badge as Popular</Label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
