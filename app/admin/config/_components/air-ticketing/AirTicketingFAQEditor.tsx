import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';

export function AirTicketingFAQEditor({ draft, set }: EditorProps) {
  const atp = draft.airTicketingPage || defaultConfig.airTicketingPage!;
  const faq = atp.faq || defaultConfig.airTicketingPage!.faq!;
  const items = faq.items || [];

  const upd = (k: string, v: unknown) =>
    set((p) => {
      const current = p.airTicketingPage || defaultConfig.airTicketingPage!;
      return {
        ...p,
        airTicketingPage: {
          ...current,
          faq: { ...(current.faq || faq), [k]: v },
        },
      };
    });

  const updItem = (index: number, k: string, v: unknown) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [k]: v };
    upd('items', updated);
  };

  const addItem = () => {
    const newItem = {
      question: 'New Question',
      answer: 'Add your detailed answer here.',
      enabled: true,
    };
    upd('items', [...items, newItem]);
  };

  const removeItem = (index: number) => {
    upd('items', items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    const [temp] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, temp);
    upd('items', reordered);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="Enable Air Ticketing FAQ" enabled={faq.enabled !== false} onChange={(v) => upd('enabled', v)} />
      <FieldRow label="Eyebrow text" id="atfaq-eyebrow">
        <Input id="atfaq-eyebrow" value={faq.eyebrow || ''} placeholder="AIR TICKETING FAQ" onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>
      <FieldRow label="Section Title" id="atfaq-title">
        <Input id="atfaq-title" value={faq.title || ''} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>
      <FieldRow label="Section Subtitle" id="atfaq-sub">
        <textarea
          id="atfaq-sub"
          rows={2}
          value={faq.subtitle || ''}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">FAQ Questions ({items.length})</h4>
            <p className="text-xs text-muted-foreground">Add, edit, reorder, or toggle flight questions.</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={addItem}
            disabled={faq.enabled === false}
            className="text-xs h-8 gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Question
          </Button>
        </div>

        {items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border p-4 bg-card space-y-3 shadow-xs"
            style={{ opacity: item.enabled !== false ? 1 : 0.55 }}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={item.enabled !== false}
                  onCheckedChange={(val) => updItem(idx, 'enabled', val)}
                  disabled={faq.enabled === false}
                />
                <span className="font-semibold text-xs text-foreground">
                  Question #{idx + 1}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === 0 || faq.enabled === false}
                  onClick={() => moveItem(idx, -1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === items.length - 1 || faq.enabled === false}
                  onClick={() => moveItem(idx, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  disabled={faq.enabled === false}
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <FieldRow label="Question" id={`atfq-${idx}`}>
              <Input
                id={`atfq-${idx}`}
                value={item.question}
                onChange={(e) => updItem(idx, 'question', e.target.value)}
                disabled={faq.enabled === false}
              />
            </FieldRow>
            <FieldRow label="Answer" id={`atfa-${idx}`}>
              <textarea
                id={`atfa-${idx}`}
                rows={3}
                value={item.answer}
                onChange={(e) => updItem(idx, 'answer', e.target.value)}
                disabled={faq.enabled === false}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </FieldRow>
          </div>
        ))}
      </div>
    </div>
  );
}
