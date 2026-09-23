import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { AppConfig, DynamicFormField, FormFieldType } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';

export function ContactDetailsEditor({ draft, set }: EditorProps) {
  const c = draft.contactPage?.contact || defaultConfig.contactPage.contact;
  const f = draft.contactPage?.form || defaultConfig.contactPage.form;

  const updC = <K extends keyof AppConfig['contactPage']['contact']>(k: K, v: AppConfig['contactPage']['contact'][K]) =>
    set((p) => ({ ...p, contactPage: { ...p.contactPage, contact: { ...p.contactPage.contact, [k]: v } } }));

  const updF = <K extends keyof AppConfig['contactPage']['form']>(k: K, v: AppConfig['contactPage']['form'][K]) =>
    set((p) => ({ ...p, contactPage: { ...p.contactPage, form: { ...p.contactPage.form, [k]: v } } }));

  return (
    <div className="space-y-10">
      {/* SECTION: LEFT COLUMN (DETAILS) */}
      <div className="space-y-5">
        <div className="border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Left Column (Contact Details)</h3>
          <p className="text-sm text-muted-foreground">This controls the main section background and the contact information on the left.</p>
        </div>

        <SectionToggle title="Show Contact Details" enabled={c.enabled !== false} onChange={(v) => updC('enabled', v)} />
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Main Section Background Color</label>
          <BackgroundColorPicker value={c.backgroundColor || '#f5f5f0'} onChange={(v) => updC('backgroundColor', v)} />
        </div>
        
        <FieldRow label="Location" id="cd-loc">
          <textarea
            id="cd-loc"
            rows={3}
            value={c.location}
            onChange={(e) => updC('location', e.target.value)}
            className="w-full flex min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </FieldRow>
        <FieldRow label="Location Maps Link" id="cd-locl">
          <Input id="cd-locl" value={c.locationLink} onChange={(e) => updC('locationLink', e.target.value)} />
        </FieldRow>
        <FieldRow label="Phone" id="cd-phone">
          <Input id="cd-phone" value={c.phone} onChange={(e) => updC('phone', e.target.value)} />
        </FieldRow>
        <FieldRow label="Email" id="cd-email">
          <Input id="cd-email" value={c.email} onChange={(e) => updC('email', e.target.value)} />
        </FieldRow>
        <FieldRow label="WhatsApp" id="cd-wa">
          <Input id="cd-wa" value={c.whatsapp} onChange={(e) => updC('whatsapp', e.target.value)} />
        </FieldRow>
      </div>

      {/* SECTION: RIGHT COLUMN (FORM) */}
      <div className="space-y-5">
        <div className="border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Right Column (Form Card)</h3>
          <p className="text-sm text-muted-foreground">This controls the message form card displayed on the right.</p>
        </div>

        <SectionToggle title="Show Contact Form" enabled={f.enabled !== false} onChange={(v) => updF('enabled', v)} />
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Form Card Background Color</label>
          <BackgroundColorPicker value={f.backgroundColor || '#ffffff'} onChange={(v) => updF('backgroundColor', v)} />
        </div>

        <FieldRow label="Form Title" id="cf-title">
          <Input id="cf-title" value={f.title} onChange={(e) => updF('title', e.target.value)} />
        </FieldRow>
        <FieldRow label="Form Subtitle" id="cf-sub">
          <Input id="cf-sub" value={f.subtitle || ''} placeholder="We usually respond within 2-4 hours." onChange={(e) => updF('subtitle', e.target.value)} />
        </FieldRow>
        <FieldRow label="Submit Button Text" id="cf-btn">
          <Input id="cf-btn" value={f.buttonText} onChange={(e) => updF('buttonText', e.target.value)} />
        </FieldRow>

        <Separator />

        {/* Dynamic Contact Form Fields */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Dynamic Contact Form Fields</h4>
              <p className="text-xs text-muted-foreground">
                Customize, reorder, add dropdowns, checkboxes, date/time pickers, or text fields.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newField: DynamicFormField = {
                  id: `cf_${Date.now()}`,
                  label: 'New Field',
                  type: 'text',
                  placeholder: 'Enter details...',
                  required: false,
                  halfWidth: false,
                  enabled: true,
                };
                const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                updF('fields', [...currentFields, newField]);
              }}
              disabled={f.enabled === false}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {(f.fields || defaultConfig.contactPage.form.fields || []).map((field, idx) => {
              const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
              const updCField = (key: keyof DynamicFormField, val: unknown) => {
                const updated = [...currentFields];
                updated[idx] = { ...updated[idx], [key]: val };
                updF('fields', updated);
              };

              const removeCField = () => {
                updF('fields', currentFields.filter((_, i) => i !== idx));
              };

              const moveCField = (direction: 'up' | 'down') => {
                const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (targetIdx < 0 || targetIdx >= currentFields.length) return;
                const reordered = [...currentFields];
                const temp = reordered[idx];
                reordered[idx] = reordered[targetIdx];
                reordered[targetIdx] = temp;
                updF('fields', reordered);
              };

              return (
                <div
                  key={field.id || idx}
                  className="relative rounded-xl border border-border p-4 bg-card shadow-xs space-y-3"
                  style={{ opacity: field.enabled !== false ? 1 : 0.55 }}
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.enabled !== false}
                        onCheckedChange={(v) => updCField('enabled', v)}
                        disabled={f.enabled === false}
                      />
                      <span className="text-xs font-semibold text-foreground">
                        {field.label || `Field ${idx + 1}`}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                        {field.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={idx === 0 || f.enabled === false}
                        onClick={() => moveCField('up')}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={idx === currentFields.length - 1 || f.enabled === false}
                        onClick={() => moveCField('down')}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                        disabled={f.enabled === false}
                        onClick={removeCField}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Field Label" id={`cf-lbl-${idx}`}>
                      <Input
                        id={`cf-lbl-${idx}`}
                        value={field.label}
                        onChange={(e) => updCField('label', e.target.value)}
                        disabled={f.enabled === false}
                      />
                    </FieldRow>

                    <FieldRow label="Field Type" id={`cf-typ-${idx}`}>
                      <select
                        id={`cf-typ-${idx}`}
                        value={field.type}
                        onChange={(e) => updCField('type', e.target.value as FormFieldType)}
                        disabled={f.enabled === false}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="text">Text (Single Line)</option>
                        <option value="email">Email Address</option>
                        <option value="tel">Phone Number</option>
                        <option value="number">Number</option>
                        <option value="date">Date Picker</option>
                        <option value="time">Time Picker</option>
                        <option value="datetime-local">Date & Time Picker</option>
                        <option value="select">Dropdown (Select Menu)</option>
                        <option value="checkbox">Checkbox Toggle</option>
                        <option value="textarea">Textarea (Multi-Line)</option>
                      </select>
                    </FieldRow>
                  </div>

                  {field.type !== 'checkbox' && (
                    <FieldRow label="Placeholder Text" id={`cf-plc-${idx}`}>
                      <Input
                        id={`cf-plc-${idx}`}
                        value={field.placeholder || ''}
                        placeholder="e.g. Enter details..."
                        onChange={(e) => updCField('placeholder', e.target.value)}
                        disabled={f.enabled === false}
                      />
                    </FieldRow>
                  )}

                  {field.type === 'select' && (
                    <FieldRow label="Dropdown Options (1 per line)" id={`cf-opt-${idx}`}>
                      <textarea
                        id={`cf-opt-${idx}`}
                        rows={3}
                        value={(field.options || []).join('\n')}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        onChange={(e) =>
                          updCField(
                            'options',
                            e.target.value.split('\n')
                          )
                        }
                        disabled={f.enabled === false}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none font-mono"
                      />
                    </FieldRow>
                  )}

                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`cf-req-${idx}`}
                        checked={Boolean(field.required)}
                        onCheckedChange={(v) => updCField('required', v)}
                        disabled={f.enabled === false}
                      />
                      <Label htmlFor={`cf-req-${idx}`} className="text-xs cursor-pointer">
                        Required field
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id={`cf-half-${idx}`}
                        checked={Boolean(field.halfWidth)}
                        onCheckedChange={(v) => updCField('halfWidth', v)}
                        disabled={f.enabled === false}
                      />
                      <Label htmlFor={`cf-half-${idx}`} className="text-xs cursor-pointer">
                        Half Width (2-Column Grid)
                      </Label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Buttons at the bottom for Contact Form */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newField: DynamicFormField = {
                  id: `cf_${Date.now()}`,
                  label: 'New Field',
                  type: 'text',
                  placeholder: 'Enter details...',
                  required: false,
                  halfWidth: false,
                  enabled: true,
                };
                const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                updF('fields', [...currentFields, newField]);
              }}
              disabled={f.enabled === false}
              className="w-full sm:flex-1 h-10 border-dashed gap-2 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" /> Add Custom Field
            </Button>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newField: DynamicFormField = {
                    id: `cf_select_${Date.now()}`,
                    label: 'Subject / Category',
                    type: 'select',
                    options: ['General Inquiry', 'Safaris', 'Feedback'],
                    required: false,
                    halfWidth: true,
                    enabled: true,
                  };
                  const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                  updF('fields', [...currentFields, newField]);
                }}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Dropdown
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newField: DynamicFormField = {
                    id: `cf_check_${Date.now()}`,
                    label: 'Subscribe to newsletter',
                    type: 'checkbox',
                    required: false,
                    halfWidth: false,
                    enabled: true,
                  };
                  const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                  updF('fields', [...currentFields, newField]);
                }}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Checkbox
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
