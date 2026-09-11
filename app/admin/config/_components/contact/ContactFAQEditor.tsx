import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { AppConfig } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';

export function ContactFAQEditor({ draft, set }: EditorProps) {
  const f = draft.contactPage?.faq || defaultConfig.contactPage.faq;
  const upd = <K extends keyof AppConfig['contactPage']['faq']>(k: K, v: AppConfig['contactPage']['faq'][K]) =>
    set((p) => ({ ...p, contactPage: { ...p.contactPage, faq: { ...p.contactPage.faq, [k]: v } } }));

  const addItem = () => {
    const newItem = {
      question: 'New Question',
      answer: 'Add your answer here.',
      enabled: true,
    };
    upd('items', [...f.items, newItem]);
  };

  const removeItem = (idx: number) => {
    upd('items', f.items.filter((_, i) => i !== idx));
  };

  const moveItem = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= f.items.length) return;
    const reordered = [...f.items];
    const [temp] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, temp);
    upd('items', reordered);
  };

  return (
    <div className="space-y-5">
      <SectionToggle title="FAQ Section" enabled={f.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={f.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <FieldRow label="Eyebrow text" id="cf-eyebrow">
        <Input id="cf-eyebrow" value={f.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>
      <FieldRow label="Title" id="cf-title">
        <Input id="cf-title" value={f.title} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>
      <FieldRow label="Subtitle" id="cf-subtitle">
        <textarea
          id="cf-subtitle"
          rows={3}
          value={f.subtitle}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">FAQ Items ({f.items.length})</h4>
          <Button
            type="button"
            size="sm"
            onClick={addItem}
            disabled={!f.enabled}
            className="text-xs h-8 gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Question
          </Button>
        </div>
        {f.items.map((item, idx) => (
          <div key={idx} className="border rounded-xl p-4 relative bg-card shadow-xs space-y-3" style={{ opacity: item.enabled ? 1 : 0.55 }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={item.enabled} 
                  onCheckedChange={(v) => {
                    const arr = [...f.items];
                    arr[idx] = { ...item, enabled: v };
                    upd('items', arr);
                  }} 
                  disabled={!f.enabled}
                />
                <span className="text-xs font-semibold">Question #{idx + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === 0 || !f.enabled}
                  onClick={() => moveItem(idx, -1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === f.items.length - 1 || !f.enabled}
                  onClick={() => moveItem(idx, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  disabled={!f.enabled}
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <FieldRow label="Question" id={`cf-q-${idx}`}>
                <Input 
                  id={`cf-q-${idx}`}
                  value={item.question} 
                  onChange={(e) => {
                    const arr = [...f.items];
                    arr[idx] = { ...item, question: e.target.value };
                    upd('items', arr);
                  }} 
                  placeholder="Question"
                  disabled={!item.enabled || !f.enabled}
                  className="h-9 text-xs font-semibold"
                />
              </FieldRow>
              <FieldRow label="Answer" id={`cf-a-${idx}`}>
                <textarea
                  id={`cf-a-${idx}`}
                  value={item.answer}
                  onChange={(e) => {
                    const arr = [...f.items];
                    arr[idx] = { ...item, answer: e.target.value };
                    upd('items', arr);
                  }} 
                  placeholder="Answer"
                  disabled={!item.enabled || !f.enabled}
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                />
              </FieldRow>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
