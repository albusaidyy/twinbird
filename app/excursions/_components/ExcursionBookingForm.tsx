'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import type { ExcursionItem, ExcursionBookingFormConfig, DynamicFormField } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';

export function ExcursionBookingForm({
  excursion,
  config,
  primaryColor,
  defaultAccessKey,
  className,
}: {
  excursion: ExcursionItem;
  config?: ExcursionBookingFormConfig;
  primaryColor: string;
  defaultAccessKey?: string;
  className?: string;
}) {
  const formConfig: ExcursionBookingFormConfig = config || defaultConfig.excursionsPage?.bookingForm || defaultConfig.toursPage?.bookingForm || {
    title: 'Reserve This Excursion',
    enabled: true,
    subtitle: 'Book your spot for an incredible day trip.',
    buttonText: 'Submit Reservation',
    fields: [],
  };

  const fields: DynamicFormField[] = (formConfig.fields && formConfig.fields.length > 0)
    ? formConfig.fields.filter((f) => f.enabled !== false)
    : (defaultConfig.excursionsPage?.bookingForm?.fields || defaultConfig.toursPage?.bookingForm?.fields || []);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state
  const [formData, setFormData] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    fields.forEach((f) => {
      if (f.type === 'checkbox') {
        init[f.id] = false;
      } else if (f.type === 'select' && f.options && f.options.length > 0) {
        init[f.id] = f.options[0];
      } else {
        init[f.id] = '';
      }
    });
    return init;
  });

  if (formConfig.enabled === false) {
    return null;
  }

  const accessKey = formConfig.accessKey || defaultAccessKey;

  const handleChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, string | boolean> = {
        excursion: excursion.title,
      };

      fields.forEach((f) => {
        const val = formData[f.id];
        payload[f.label || f.id] = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val || 'N/A');
      });

      const customerName = String(formData.fullName || formData.name || 'Valued Guest');

      if (accessKey && accessKey.trim() !== '') {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `Excursion Reservation: ${excursion.title} - ${customerName}`,
            from_name: customerName,
            ...payload,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Submission failed. Please try again.');
        }
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        className ||
        'rounded-3xl bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-xl border border-black/5 dark:border-white/10 sticky top-28'
      }
    >
      <div className="mb-6 border-b border-border/60 pb-4">
        <h3 className="font-serif text-2xl font-bold text-foreground">
          {formConfig.title || 'Reserve This Excursion'}
        </h3>
        {formConfig.subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {formConfig.subtitle}
          </p>
        )}
      </div>

      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-foreground">Reservation Request Received!</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Thank you for reaching out. Our coastal excursion desk will review your details for{' '}
            <span className="font-semibold text-foreground">{excursion.title}</span> and confirm availability shortly.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
          >
            Submit Another Inquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {fields.map((field) => {
              const spanClass = field.halfWidth ? 'sm:col-span-1' : 'sm:col-span-2';

              if (field.type === 'checkbox') {
                return (
                  <div key={field.id} className={`${spanClass} flex items-center gap-2.5 py-1.5`}>
                    <input
                      type="checkbox"
                      id={`dyn-exc-${field.id}`}
                      checked={Boolean(formData[field.id])}
                      onChange={(e) => handleChange(field.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 accent-primary focus:ring-primary cursor-pointer shrink-0"
                      style={{ accentColor: primaryColor }}
                    />
                    <Label htmlFor={`dyn-exc-${field.id}`} className="text-xs font-medium cursor-pointer text-foreground leading-snug">
                      {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                    </Label>
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={field.id} className={`${spanClass} flex flex-col justify-end space-y-1.5`}>
                    <Label htmlFor={`dyn-exc-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                      {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                    </Label>
                    <div className="relative">
                      <select
                        id={`dyn-exc-${field.id}`}
                        required={field.required}
                        value={String(formData[field.id] || '')}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer appearance-none pr-8"
                      >
                        {field.placeholder && <option value="">{field.placeholder}</option>}
                        {(field.options || []).map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                    </div>
                  </div>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field.id} className={`${spanClass} space-y-1.5`}>
                    <Label htmlFor={`dyn-exc-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                      {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                    </Label>
                    <textarea
                      id={`dyn-exc-${field.id}`}
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={String(formData[field.id] || '')}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>
                );
              }

              if (field.type === 'date') {
                return (
                  <div key={field.id} className={`${spanClass} flex flex-col justify-end space-y-1.5`}>
                    <Label htmlFor={`dyn-exc-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                      {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                    </Label>
                    <DatePicker
                      id={`dyn-exc-${field.id}`}
                      value={String(formData[field.id] || '')}
                      onChange={(val) => handleChange(field.id, val)}
                      primaryColor={primaryColor}
                      placeholder={field.placeholder || 'Select date'}
                      disabled={loading}
                      required={field.required}
                    />
                  </div>
                );
              }

              // Text, Email, Tel, Number, Time, Datetime-local inputs
              return (
                <div key={field.id} className={`${spanClass} flex flex-col justify-end space-y-1.5`}>
                  <Label htmlFor={`dyn-exc-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                    {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                  </Label>
                  <Input
                    id={`dyn-exc-${field.id}`}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder || ''}
                    value={String(formData[field.id] || '')}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              );
            })}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg mt-3"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending Request...
              </>
            ) : (
              formConfig.buttonText || 'Submit Reservation'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
