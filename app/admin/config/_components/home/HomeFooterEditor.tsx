import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';
import type { AppConfig, FooterLink, SocialLink } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';

function LinkListEditor({
  title,
  list,
  onChange,
}: {
  title: string;
  list: { enabled: boolean; items: FooterLink[] };
  onChange: (list: { enabled: boolean; items: FooterLink[] }) => void;
}) {
  const updEnabled = (v: boolean) => onChange({ ...list, enabled: v });
  const updItem = (i: number, k: keyof FooterLink, v: string | boolean) => {
    const newItems = [...list.items];
    newItems[i] = { ...newItems[i], [k]: v };
    onChange({ ...list, items: newItems });
  };
  const addItem = () => onChange({ ...list, items: [...list.items, { enabled: true, label: 'New Link', href: '#' }] });
  const rmItem = (i: number) => onChange({ ...list, items: list.items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <div className="flex items-center gap-2 mb-2">
        <Switch checked={list.enabled} onCheckedChange={updEnabled} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="space-y-3 opacity-100 transition-opacity" style={{ opacity: list.enabled ? 1 : 0.5 }}>
        {list.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center relative pr-8">
            <Switch checked={item.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} className="scale-75 origin-left" />
            <Input className="h-8 text-xs" value={item.label} onChange={(e) => updItem(i, 'label', e.target.value)} disabled={!item.enabled} placeholder="Label" />
            <Input className="h-8 text-xs" value={item.href} onChange={(e) => updItem(i, 'href', e.target.value)} disabled={!item.enabled} placeholder="URL" />
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive absolute right-0" onClick={() => rmItem(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8" onClick={addItem} disabled={!list.enabled}>
          <Plus className="h-3 w-3" /> Add Link
        </Button>
      </div>
    </div>
  );
}

function SocialListEditor({
  title,
  list,
  onChange,
}: {
  title: string;
  list: { enabled: boolean; items: SocialLink[] };
  onChange: (list: { enabled: boolean; items: SocialLink[] }) => void;
}) {
  const updEnabled = (v: boolean) => onChange({ ...list, enabled: v });
  const updItem = (i: number, k: keyof SocialLink, v: string | boolean) => {
    const newItems = [...list.items];
    newItems[i] = { ...newItems[i], [k]: v };
    onChange({ ...list, items: newItems });
  };
  const addItem = () => onChange({ ...list, items: [...list.items, { enabled: true, icon: 'Facebook', url: '#' }] });
  const rmItem = (i: number) => onChange({ ...list, items: list.items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <div className="flex items-center gap-2 mb-2">
        <Switch checked={list.enabled} onCheckedChange={updEnabled} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="space-y-3 opacity-100 transition-opacity" style={{ opacity: list.enabled ? 1 : 0.5 }}>
        {list.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center relative pr-8">
            <Switch checked={item.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} className="scale-75 origin-left" />
            <Input className="h-8 text-xs w-32" value={item.icon} onChange={(e) => updItem(i, 'icon', e.target.value)} disabled={!item.enabled} placeholder="Icon (Lucide)" />
            <Input className="h-8 text-xs" value={item.url} onChange={(e) => updItem(i, 'url', e.target.value)} disabled={!item.enabled} placeholder="URL" />
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive absolute right-0" onClick={() => rmItem(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8" onClick={addItem} disabled={!list.enabled}>
          <Plus className="h-3 w-3" /> Add Social
        </Button>
      </div>
    </div>
  );
}

export function HomeFooterEditor({ draft, set }: EditorProps) {
  const f = draft.homepage.footer;
  const upd = <K extends keyof AppConfig['homepage']['footer']>(k: K, v: AppConfig['homepage']['footer'][K]) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, footer: { ...p.homepage.footer, [k]: v } } }));

  return (
    <div className="space-y-6">
      <SectionToggle title="Footer" enabled={f.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={f.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <FieldRow label="Description (under logo)" id="f-desc">
        <textarea
          id="f-desc"
          rows={3}
          value={f.description}
          onChange={(e) => upd('description', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>
      
      <Separator />
      <h4 className="text-sm font-semibold">Contact Details</h4>
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Location" id="f-contact-loc">
          <Input id="f-contact-loc" value={f.contact.location} onChange={(e) => upd('contact', { ...f.contact, location: e.target.value })} />
        </FieldRow>
        <FieldRow label="Phone" id="f-contact-phone">
          <Input id="f-contact-phone" value={f.contact.phone} onChange={(e) => upd('contact', { ...f.contact, phone: e.target.value })} />
        </FieldRow>
        <FieldRow label="Email" id="f-contact-email">
          <Input id="f-contact-email" value={f.contact.email} onChange={(e) => upd('contact', { ...f.contact, email: e.target.value })} />
        </FieldRow>
        <FieldRow label="Working Days" id="f-contact-days">
          <Input id="f-contact-days" value={f.contact.workingDays} onChange={(e) => upd('contact', { ...f.contact, workingDays: e.target.value })} />
        </FieldRow>
        <FieldRow label="Working Hours" id="f-contact-hrs">
          <Input id="f-contact-hrs" value={f.contact.workingHours} onChange={(e) => upd('contact', { ...f.contact, workingHours: e.target.value })} />
        </FieldRow>
      </div>
      
      <Separator />
      <h4 className="text-sm font-semibold mb-4">Link Sections</h4>
      <div className="space-y-6">
        <LinkListEditor title="Quick Links" list={f.quickLinks} onChange={(v) => upd('quickLinks', v)} />
        <LinkListEditor title="Top Packages" list={f.topPackages} onChange={(v) => upd('topPackages', v)} />
        <LinkListEditor title="Bottom Links" list={f.bottomLinks} onChange={(v) => upd('bottomLinks', v)} />
        <SocialListEditor title="Socials" list={f.socials} onChange={(v) => upd('socials', v)} />
      </div>
    </div>
  );
}
