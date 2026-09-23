import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type {
  ExcursionBookingFormConfig,
  DynamicFormField,
  FormFieldType,
} from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';

export function ExcursionsBookingEditor({ draft, set }: EditorProps) {
  const currentExcursionsPage = draft.excursionsPage || defaultConfig.excursionsPage!;
  const f = currentExcursionsPage.bookingForm || defaultConfig.excursionsPage!.bookingForm!;
  const fields: DynamicFormField[] = f.fields || defaultConfig.excursionsPage!.bookingForm!.fields || [];

  const updF = <K extends keyof ExcursionBookingFormConfig>(
    k: K,
    v: ExcursionBookingFormConfig[K]
  ) =>
    set((p) => {
      const current = p.excursionsPage || defaultConfig.excursionsPage!;
      return {
        ...p,
        excursionsPage: {
          ...current,
          bookingForm: {
            ...(current.bookingForm || defaultConfig.excursionsPage!.bookingForm!),
            [k]: v,
          },
        },
      };
    });

  const updField = (
    index: number,
    key: keyof DynamicFormField,
    val: unknown
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: val };
    updF('fields', updated);
  };

  const addField = () => {
    const newField: DynamicFormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter details...',
      required: false,
      halfWidth: false,
      enabled: true,
    };
    updF('fields', [...fields, newField]);
  };

  const addFieldWithType = (type: FormFieldType, label = 'New Field') => {
    const newField: DynamicFormField = {
      id: `field_${Date.now()}`,
      label,
      type,
      placeholder: type === 'select' || type === 'checkbox' ? '' : 'Enter details...',
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
      required: false,
      halfWidth: type === 'date' || type === 'time' || type === 'text' || type === 'tel',
      enabled: true,
    };
    updF('fields', [...fields, newField]);
  };

  const removeField = (index: number) => {
    updF('fields', fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const reordered = [...fields];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    updF('fields', reordered);
  };

  return (
    <div className="space-y-6">
      <SectionToggle
        title="Enable Reservation Form on Excursion Pages"
        enabled={f.enabled !== false}
        onChange={(v) => updF('enabled', v)}
      />

      <div className="space-y-4">
        <FieldRow label="Form Title" id="ebf-title">
          <Input
            id="ebf-title"
            value={f.title || ''}
            placeholder="Reserve This Excursion"
            onChange={(e) => updF('title', e.target.value)}
            disabled={f.enabled === false}
          />
        </FieldRow>

        <FieldRow label="Form Subtitle" id="ebf-sub">
          <Input
            id="ebf-sub"
            value={f.subtitle || ''}
            placeholder="Book your spot for an incredible day trip."
            onChange={(e) => updF('subtitle', e.target.value)}
            disabled={f.enabled === false}
          />
        </FieldRow>

        <FieldRow label="Submit Button Label" id="ebf-btn">
          <Input
            id="ebf-btn"
            value={f.buttonText || ''}
            placeholder="Submit Reservation"
            onChange={(e) => updF('buttonText', e.target.value)}
            disabled={f.enabled === false}
          />
        </FieldRow>

        <Separator />

        {/* Dynamic Form Fields Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Dynamic Reservation Form Fields</h4>
              <p className="text-xs text-muted-foreground">
                Customize, reorder, add dropdowns, checkboxes, date/time pickers, or text fields.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addField}
              disabled={f.enabled === false}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={field.id || idx}
                className="relative rounded-xl border border-border p-4 bg-card shadow-xs space-y-3"
                style={{ opacity: field.enabled !== false ? 1 : 0.55 }}
              >
                {/* Field Top Bar: Controls */}
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.enabled !== false}
                      onCheckedChange={(v) => updField(idx, 'enabled', v)}
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
                      onClick={() => moveField(idx, 'up')}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === fields.length - 1 || f.enabled === false}
                      onClick={() => moveField(idx, 'down')}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      disabled={f.enabled === false}
                      onClick={() => removeField(idx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Field Configuration Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FieldRow label="Field Label" id={`ef-lbl-${idx}`}>
                    <Input
                      id={`ef-lbl-${idx}`}
                      value={field.label}
                      onChange={(e) => updField(idx, 'label', e.target.value)}
                      disabled={f.enabled === false}
                    />
                  </FieldRow>

                  <FieldRow label="Field Type" id={`ef-typ-${idx}`}>
                    <select
                      id={`ef-typ-${idx}`}
                      value={field.type}
                      onChange={(e) => updField(idx, 'type', e.target.value as FormFieldType)}
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

                {/* Placeholder (Not applicable for checkbox) */}
                {field.type !== 'checkbox' && (
                  <FieldRow label="Placeholder Text" id={`ef-plc-${idx}`}>
                    <Input
                      id={`ef-plc-${idx}`}
                      value={field.placeholder || ''}
                      placeholder="e.g. Enter details..."
                      onChange={(e) => updField(idx, 'placeholder', e.target.value)}
                      disabled={f.enabled === false}
                    />
                  </FieldRow>
                )}

                {/* Dropdown Options (For Select Type) */}
                {field.type === 'select' && (
                  <FieldRow label="Dropdown Options (1 per line)" id={`ef-opt-${idx}`}>
                    <textarea
                      id={`ef-opt-${idx}`}
                      rows={3}
                      value={(field.options || []).join('\n')}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      onChange={(e) =>
                        updField(
                          idx,
                          'options',
                          e.target.value.split('\n')
                        )
                      }
                      disabled={f.enabled === false}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none font-mono"
                    />
                  </FieldRow>
                )}

                {/* Toggles: Required & Half Width */}
                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`ef-req-${idx}`}
                      checked={Boolean(field.required)}
                      onCheckedChange={(v) => updField(idx, 'required', v)}
                      disabled={f.enabled === false}
                    />
                    <Label htmlFor={`ef-req-${idx}`} className="text-xs cursor-pointer">
                      Required field
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id={`ef-half-${idx}`}
                      checked={Boolean(field.halfWidth)}
                      onCheckedChange={(v) => updField(idx, 'halfWidth', v)}
                      disabled={f.enabled === false}
                    />
                    <Label htmlFor={`ef-half-${idx}`} className="text-xs cursor-pointer">
                      Half Width (2-Column Grid)
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Field at the Bottom */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => addField()}
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
                onClick={() => addFieldWithType('date', 'Preferred Date')}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Date
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addFieldWithType('time', 'Departure Time')}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Time
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addFieldWithType('select', 'Select Excursion')}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Dropdown
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addFieldWithType('checkbox', 'Checkbox Option')}
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
