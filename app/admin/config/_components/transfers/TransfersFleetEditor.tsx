import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { TransferVehicle } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';

export function TransfersFleetEditor({ draft, set }: EditorProps) {
  const tp = draft.transfersPage || defaultConfig.transfersPage!;
  const vs = tp.vehiclesSection || { enabled: true, title: 'Our Modern Fleet', subtitle: '', vehicles: [] };
  const vehicles = vs.vehicles || [];

  const upd = (k: string, v: unknown) =>
    set((p) => {
      const current = p.transfersPage || defaultConfig.transfersPage!;
      return {
        ...p,
        transfersPage: {
          ...current,
          vehiclesSection: { ...(current.vehiclesSection || vs), [k]: v },
        },
      };
    });

  const updVehicle = (index: number, k: string, v: unknown) => {
    const updated = [...vehicles];
    updated[index] = { ...updated[index], [k]: v };
    upd('vehicles', updated);
  };

  const addVehicle = () => {
    const newVehicle: TransferVehicle = {
      id: `vehicle-${Date.now()}`,
      name: 'New Vehicle',
      category: 'Private Transfer',
      passengers: '1 - 4 Passengers',
      luggage: '3 Large Bags',
      description: 'Comfortable air-conditioned vehicle with professional chauffeur.',
      featured: false,
      enabled: true,
    };
    upd('vehicles', [...vehicles, newVehicle]);
  };

  const removeVehicle = (index: number) => {
    upd('vehicles', vehicles.filter((_, i) => i !== index));
  };

  const moveVehicle = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= vehicles.length) return;
    const reordered = [...vehicles];
    const [temp] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, temp);
    upd('vehicles', reordered);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="Enable Fleet Overview" enabled={vs.enabled !== false} onChange={(v) => upd('enabled', v)} />
      <FieldRow label="Section Title" id="trf-title">
        <Input id="trf-title" value={vs.title || ''} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>
      <FieldRow label="Subtitle" id="trf-sub">
        <Input id="trf-sub" value={vs.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Fleet Vehicles ({vehicles.length})</h4>
            <p className="text-xs text-muted-foreground">Add, configure, reorder, or toggle individual fleet vehicles.</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={addVehicle}
            disabled={vs.enabled === false}
            className="text-xs h-8 gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Vehicle
          </Button>
        </div>

        {vehicles.map((v, idx) => (
          <div
            key={v.id || idx}
            className="rounded-xl border p-4 bg-card space-y-4 shadow-xs"
            style={{ opacity: v.enabled !== false ? 1 : 0.55 }}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={v.enabled !== false}
                  onCheckedChange={(val) => updVehicle(idx, 'enabled', val)}
                  disabled={vs.enabled === false}
                />
                <span className="font-semibold text-xs text-foreground">
                  {v.name || `Vehicle #${idx + 1}`}
                </span>
                {v.featured && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === 0 || vs.enabled === false}
                  onClick={() => moveVehicle(idx, -1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === vehicles.length - 1 || vs.enabled === false}
                  onClick={() => moveVehicle(idx, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  disabled={vs.enabled === false}
                  onClick={() => removeVehicle(idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow label="Vehicle Name" id={`vn-${idx}`}>
                <Input
                  id={`vn-${idx}`}
                  value={v.name}
                  onChange={(e) => updVehicle(idx, 'name', e.target.value)}
                  disabled={vs.enabled === false}
                />
              </FieldRow>
              <FieldRow label="Category / Tier" id={`vc-${idx}`}>
                <Input
                  id={`vc-${idx}`}
                  value={v.category}
                  placeholder="e.g. Private Transfer, Family & Small Group"
                  onChange={(e) => updVehicle(idx, 'category', e.target.value)}
                  disabled={vs.enabled === false}
                />
              </FieldRow>
              <FieldRow label="Passengers Capacity" id={`vp-${idx}`}>
                <Input
                  id={`vp-${idx}`}
                  value={v.passengers}
                  placeholder="e.g. 1 - 3 Passengers"
                  onChange={(e) => updVehicle(idx, 'passengers', e.target.value)}
                  disabled={vs.enabled === false}
                />
              </FieldRow>
              <FieldRow label="Luggage Capacity" id={`vl-${idx}`}>
                <Input
                  id={`vl-${idx}`}
                  value={v.luggage}
                  placeholder="e.g. 2 Large + 2 Hand Luggage"
                  onChange={(e) => updVehicle(idx, 'luggage', e.target.value)}
                  disabled={vs.enabled === false}
                />
              </FieldRow>
            </div>

            <FieldRow label="Vehicle Description" id={`vd-${idx}`}>
              <textarea
                id={`vd-${idx}`}
                rows={2}
                value={v.description}
                onChange={(e) => updVehicle(idx, 'description', e.target.value)}
                disabled={vs.enabled === false}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </FieldRow>

            <div className="flex items-center gap-2 pt-1">
              <Switch
                id={`vf-${idx}`}
                checked={Boolean(v.featured)}
                onCheckedChange={(val) => updVehicle(idx, 'featured', val)}
                disabled={vs.enabled === false}
              />
              <Label htmlFor={`vf-${idx}`} className="text-xs cursor-pointer font-medium">
                Feature as &quot;Most Popular&quot;
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
