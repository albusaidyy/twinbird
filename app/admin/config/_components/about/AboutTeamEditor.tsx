import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { AboutTeamMember } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { ImageUploaderField } from '../shared/ImageUploaderField';

export function AboutTeamEditor({ draft, set }: EditorProps) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const t = about.team;
  const upd = <K extends keyof typeof t>(k: K, val: (typeof t)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, team: { ...current.team, [k]: val } } };
    });

  const addMember = () => {
    const newMember: AboutTeamMember = {
      enabled: true,
      name: 'Captain Alex M.',
      role: 'First Mate & Guide',
      quote: '"The sea has a story to tell every day."',
      imageUrl: '/images/hero/hero.jpg',
    };
    upd('items', [...t.items, newMember]);
  };

  const removeMember = (idx: number) => {
    upd('items', t.items.filter((_, i) => i !== idx));
  };

  const moveMember = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= t.items.length) return;
    const arr = [...t.items];
    const [temp] = arr.splice(idx, 1);
    arr.splice(target, 0, temp);
    upd('items', arr);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="The Crew / Storytellers Section" enabled={t.enabled} onChange={(val) => upd('enabled', val)} />
      <BackgroundColorPicker value={t.backgroundColor} onChange={(val) => upd('backgroundColor', val)} />

      <FieldRow label="Eyebrow text" id="abt-eyebrow">
        <Input id="abt-eyebrow" value={t.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Title" id="abt-title">
        <Input id="abt-title" value={t.title || ''} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Subtitle" id="abt-sub">
        <textarea
          id="abt-sub"
          rows={2}
          value={t.subtitle || ''}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Crew Members ({t.items.length})</h4>
          <Button size="sm" variant="outline" onClick={addMember} className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" /> Add Member
          </Button>
        </div>

        {t.items.map((member, idx) => (
          <div key={idx} className="border rounded-lg p-4 bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={member.enabled}
                  onCheckedChange={(checked) => {
                    const arr = [...t.items];
                    arr[idx] = { ...member, enabled: checked };
                    upd('items', arr);
                  }}
                />
                <span className="text-sm font-semibold">{member.name || `Member #${idx + 1}`}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0} onClick={() => moveMember(idx, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === t.items.length - 1} onClick={() => moveMember(idx, 1)}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeMember(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldRow label="Name" id={`abt-name-${idx}`}>
                <Input
                  id={`abt-name-${idx}`}
                  value={member.name}
                  onChange={(e) => {
                    const arr = [...t.items];
                    arr[idx] = { ...member, name: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
              <FieldRow label="Role / Badge" id={`abt-role-${idx}`}>
                <Input
                  id={`abt-role-${idx}`}
                  value={member.role}
                  placeholder="Head Skipper, Marine Biologist..."
                  onChange={(e) => {
                    const arr = [...t.items];
                    arr[idx] = { ...member, role: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
            </div>

            <FieldRow label="Quote / Philosophy" id={`abt-quote-${idx}`}>
              <Input
                id={`abt-quote-${idx}`}
                value={member.quote}
                onChange={(e) => {
                  const arr = [...t.items];
                  arr[idx] = { ...member, quote: e.target.value };
                  upd('items', arr);
                }}
              />
            </FieldRow>

            <FieldRow label="Portrait Image" id={`abt-img-${idx}`}>
              <ImageUploaderField
                id={`abt-img-${idx}`}
                value={member.imageUrl}
                onChange={(url) => {
                  const arr = [...t.items];
                  arr[idx] = { ...member, imageUrl: url };
                  upd('items', arr);
                }}
                folder="team"
                placeholder="Upload or select portrait..."
              />
            </FieldRow>
          </div>
        ))}
      </div>
    </div>
  );
}
