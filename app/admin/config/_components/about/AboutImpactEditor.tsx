import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';

export function AboutImpactEditor({ draft, set }: EditorProps) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const imp = about.impact;
  const upd = <K extends keyof typeof imp>(k: K, val: (typeof imp)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, impact: { ...current.impact, [k]: val } } };
    });

  return (
    <div className="space-y-8">
      <SectionToggle title="Impact & Partners Section" enabled={imp.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker
        value={imp.backgroundColor || '#0f172a'}
        onChange={(v) => upd('backgroundColor', v)}
        desc="Dark theme recommended for impact contrast (e.g. #0f172a)."
      />

      <div className="space-y-4 border-b pb-6">
        <h4 className="text-sm font-semibold">Left Column (Narrative & Stats)</h4>

        <FieldRow label="Section Title" id="abi-title">
          <Input id="abi-title" value={imp.title} onChange={(e) => upd('title', e.target.value)} />
        </FieldRow>

        <FieldRow label="Section Subtitle" id="abi-sub">
          <textarea
            id="abi-sub"
            rows={2}
            value={imp.subtitle}
            onChange={(e) => upd('subtitle', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </FieldRow>

        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Impact Metrics (4 Counters)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {imp.stats.map((st, idx) => (
              <div key={idx} className="border rounded-md p-3 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Metric #{idx + 1}</span>
                  <Switch
                    checked={st.enabled}
                    onCheckedChange={(chk) => {
                      const arr = [...imp.stats];
                      arr[idx] = { ...st, enabled: chk };
                      upd('stats', arr);
                    }}
                  />
                </div>
                <Input
                  value={st.value}
                  placeholder="1,200+"
                  onChange={(e) => {
                    const arr = [...imp.stats];
                    arr[idx] = { ...st, value: e.target.value };
                    upd('stats', arr);
                  }}
                  className="font-bold font-mono text-sm"
                />
                <Input
                  value={st.label}
                  placeholder="BILLFISH TAGGED"
                  onChange={(e) => {
                    const arr = [...imp.stats];
                    arr[idx] = { ...st, label: e.target.value };
                    upd('stats', arr);
                  }}
                  className="text-xs uppercase"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Right Column (Global Partners Card)</h4>

        <FieldRow label="Card Title" id="abi-part-title">
          <Input
            id="abi-part-title"
            value={imp.partnersCard.title}
            onChange={(e) => upd('partnersCard', { ...imp.partnersCard, title: e.target.value })}
          />
        </FieldRow>

        <FieldRow label="Card Icon (Lucide)" id="abi-part-icon">
          <Input
            id="abi-part-icon"
            value={imp.partnersCard.icon || 'ShieldCheck'}
            onChange={(e) => upd('partnersCard', { ...imp.partnersCard, icon: e.target.value })}
          />
        </FieldRow>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Partner Badges (comma separated)</label>
          <Input
            value={imp.partnersCard.partners.join(', ')}
            placeholder="The Billfish Foundation, Kenya Wildlife Service..."
            onChange={(e) => {
              const partners = e.target.value
                .split(',')
                .map((p) => p.trim())
                .filter(Boolean);
              upd('partnersCard', { ...imp.partnersCard, partners });
            }}
          />
          <p className="text-xs text-muted-foreground">Separate partner names with commas.</p>
        </div>
      </div>
    </div>
  );
}
