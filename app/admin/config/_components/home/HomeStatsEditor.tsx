import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import type { StatItem } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';

export function HomeStatsEditor({ draft, set }: EditorProps) {
  const data = draft.homepage.stats;
  const updEnabled = (v: boolean) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, enabled: v } } }));
  const updStat = (i: number, k: keyof StatItem, v: string | boolean) =>
    set((p) => {
      const arr = [...p.homepage.stats.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, items: arr } } };
    });
  const addStat = () =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        stats: {
          ...p.homepage.stats,
          items: [...p.homepage.stats.items, { enabled: true, value: 'New', label: 'Item' }],
        },
      },
    }));
  const rmStat = (i: number) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        stats: { ...p.homepage.stats, items: p.homepage.stats.items.filter((_, idx) => idx !== i) },
      },
    }));

  return (
    <div className="space-y-4">
      <SectionToggle title="Stats Bar" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker
        value={data.backgroundColor}
        onChange={(v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, backgroundColor: v } } }))
        }
      />

      <SectionHeaderFields
        data={data}
        onChange={(k, v) =>
          set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, [k]: v } } }))
        }
      />

      {data.items.map((s, i) => (
        <div key={i} className="relative rounded-lg border border-border p-4 pt-8 bg-card">
          <div className="absolute top-2 left-3 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={s.enabled} onCheckedChange={(v) => updStat(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{s.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:bg-destructive/10"
              onClick={() => rmStat(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <FieldRow label="Value" id={`stat-val-${i}`}>
              <Input
                id={`stat-val-${i}`}
                value={s.value}
                onChange={(e) => updStat(i, 'value', e.target.value)}
                disabled={!s.enabled}
              />
            </FieldRow>
            <FieldRow label="Label" id={`stat-lbl-${i}`}>
              <Input
                id={`stat-lbl-${i}`}
                value={s.label}
                onChange={(e) => updStat(i, 'label', e.target.value)}
                disabled={!s.enabled}
              />
            </FieldRow>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addStat}>
        <Plus className="h-4 w-4" /> Add Stat
      </Button>
    </div>
  );
}
