'use client';

import React, { useState, useRef } from 'react';
import { Clock, CheckCircle2, MessageCircle, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { TransferRoute, TransferBookingFormConfig, DynamicFormField } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';

interface TransfersBookingSectionProps {
  routes?: TransferRoute[];
  routesTitle?: string;
  routesSubtitle?: string;
  routesNote?: string;
  formConfig?: TransferBookingFormConfig;
  primaryColor?: string;
  accentColor?: string;
}

export function TransfersBookingSection({
  routes = [],
  routesTitle = 'Available Routes',
  routesSubtitle = 'Popular transfers across coastal airports, resorts, and towns',
  routesNote = "Don't see your route? Fill in your details in the form and we'll arrange it.",
  formConfig,
  primaryColor = '#1b4332',
  accentColor = '#d97706',
}: TransfersBookingSectionProps) {
  const fConfig: TransferBookingFormConfig = formConfig || defaultConfig.transfersPage!.bookingForm!;

  const fields: DynamicFormField[] = (fConfig.fields && fConfig.fields.length > 0)
    ? fConfig.fields.filter((f) => f.enabled !== false)
    : (defaultConfig.transfersPage!.bookingForm!.fields || []);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteName, setSelectedRouteName] = useState<string>('');

  // Initialize dynamic form state
  const [formData, setFormData] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    fields.forEach((f) => {
      if (f.type === 'checkbox') {
        init[f.id] = f.id === 'luggage' ? true : false;
      } else if (f.type === 'select' && f.options && f.options.length > 0) {
        init[f.id] = f.options[0];
      } else if (f.id === 'passengers') {
        init[f.id] = '2';
      } else {
        init[f.id] = '';
      }
    });
    return init;
  });

  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Handle "Book Now" click from the routes list
  const handleSelectRoute = (route: TransferRoute) => {
    const formatted = `${route.from} → ${route.to}`;
    setSelectedRouteName(formatted);

    // Find route field id or default to 'route'
    const routeField = fields.find(
      (f) => /route/i.test(f.id) || /route/i.test(f.label) || /destination/i.test(f.id) || /pickup/i.test(f.id)
    );
    const targetKey = routeField ? routeField.id : 'route';

    setFormData((prev) => ({ ...prev, [targetKey]: formatted }));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    toast.success(`Selected route: ${formatted}`);
  };



  // Dynamic Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, string | boolean> = {};

      if (selectedRouteName) {
        payload['Selected Route'] = selectedRouteName;
      }

      fields.forEach((f) => {
        const val = formData[f.id];
        payload[f.label || f.id] = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val || 'N/A');
      });

      // Also include any extra keys in formData that might not match fields explicitly
      Object.entries(formData).forEach(([k, v]) => {
        const matchedField = fields.find((f) => f.id === k);
        const label = matchedField ? (matchedField.label || matchedField.id) : k;
        if (payload[label] === undefined) {
          payload[label] = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : (v || 'N/A');
        }
      });

      const customerName = String(formData.fullName || formData.name || 'Valued Guest');
      const customerEmail = String(formData.email || formData.emailAddress || '');

      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      const formPayload = new FormData();
      if (accessKey) {
        formPayload.append('access_key', accessKey);
      }
      formPayload.append('subject', `Transfer Booking Request: ${customerName} (${selectedRouteName || 'Custom Route'})`);
      formPayload.append('from_name', customerName);
      if (customerEmail) {
        formPayload.append('email', customerEmail);
      }

      // Append each field individually for clean styled email view
      Object.entries(payload).forEach(([k, v]) => {
        formPayload.append(k, String(v));
      });

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formPayload,
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Submission failed. Please try again.');
      }

      setSubmitted(true);
      toast.success('Transfer request submitted successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp prefilled dynamic link
  const getWhatsAppLink = () => {
    const rawNumber = fConfig.whatsappNumber || '+254700000000';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const prefix = fConfig.whatsappText || 'Hello Twinbird Travel Agency! I would like to inquire about booking a transfer:';

    const lines = [prefix];
    if (selectedRouteName) {
      lines.push(`Selected Route: ${selectedRouteName}`);
    }

    fields.forEach((f) => {
      const val = formData[f.id];
      if (val !== undefined && val !== '' && val !== false) {
        const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val;
        lines.push(`${f.label}: ${displayVal}`);
      }
    });

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // Current selected route text for highlighting
  const currentSelectedRoute = String(
    selectedRouteName || formData.route || formData.selectedRoute || ''
  );

  return (
    <section id="booking-section" className="py-16 sm:py-24 bg-[#faf8f5] dark:bg-[#0c120e] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ────────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN: Available Routes                             */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest block mb-2"
                style={{ color: primaryColor }}
              >
                ROUTES & SCHEDULES
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
                {routesTitle}
              </h2>
              {routesSubtitle && (
                <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                  {routesSubtitle}
                </p>
              )}
            </div>

            {/* Routes Container */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-black/5 dark:border-white/10 divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {routes && routes.length > 0 ? (
                routes.map((route) => {
                  const isCurrent = currentSelectedRoute === `${route.from} → ${route.to}`;
                  return (
                    <div
                      key={route.id}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 px-4 rounded-2xl transition-all duration-200 ${
                        isCurrent
                          ? 'ring-1'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                      }`}
                      style={
                        isCurrent
                          ? {
                              backgroundColor: `${primaryColor}0d`,
                              borderColor: `${primaryColor}40`,
                            }
                          : undefined
                      }
                    >
                      {/* Timeline Route Pins */}
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center pt-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full ring-4"
                            style={{
                              backgroundColor: primaryColor,
                              boxShadow: `0 0 0 4px ${primaryColor}20`,
                            }}
                          />
                          <span className="w-0.5 h-6 bg-zinc-300 dark:bg-zinc-700 my-1 rounded" />
                          <span
                            className="h-2.5 w-2.5 rounded-full border-2 bg-white dark:bg-zinc-900"
                            style={{ borderColor: primaryColor }}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                              {route.from}
                            </span>
                            {route.popular && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                style={{
                                  backgroundColor: `${accentColor}20`,
                                  color: accentColor,
                                }}
                              >
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            to {route.to}
                          </div>
                        </div>
                      </div>

                      {/* Right Meta & CTA Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 pl-7 sm:pl-0">
                        {route.duration && (
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                            <Clock className="h-4 w-4 text-zinc-400" />
                            <span>{route.duration}</span>
                          </div>
                        )}

                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSelectRoute(route)}
                          className="rounded-full text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap px-4 sm:px-5"
                          style={{
                            backgroundColor: isCurrent ? primaryColor : accentColor,
                          }}
                        >
                          {isCurrent ? 'Selected' : 'Book Now'}
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="p-6 text-sm text-zinc-500 text-center">No routes listed.</p>
              )}
            </div>

            {/* Footnote */}
            {routesNote && (
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 px-2">
                <p>{routesNote}</p>
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN: Sticky "Book this transfer" Card Form        */}
          {/* ────────────────────────────────────────────────────────── */}
          <div ref={formRef} className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl border border-black/5 dark:border-white/10 relative">

              {/* Card Title */}
              <div className="mb-6 border-b border-border/60 pb-4">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest block mb-1"
                  style={{ color: primaryColor }}
                >
                  INSTANT RESERVATION
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  {fConfig.title || 'Book this transfer'}
                </h3>
                {fConfig.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {fConfig.subtitle}
                  </p>
                )}
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Transfer Request Received!</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Thank you for reaching out! Our coastal concierge team will review your transfer request and contact you shortly.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      const reset: Record<string, string | boolean> = {};
                      fields.forEach((f) => {
                        reset[f.id] = f.type === 'checkbox' ? (f.id === 'luggage' ? true : false) : '';
                      });
                      setFormData(reset);
                    }}
                  >
                    Submit Another Transfer Request
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

                  {/* Dynamic Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {fields.map((field) => {
                      const spanClass = field.halfWidth ? 'sm:col-span-1' : 'sm:col-span-2';

                      // 1. CHECKBOX TOGGLE FIELD (e.g. Travelling with luggage)
                      if (field.type === 'checkbox') {
                        return (
                          <div key={field.id} className={`${spanClass} flex items-center gap-2.5 py-1.5`}>
                            <input
                              type="checkbox"
                              id={`tr-dyn-${field.id}`}
                              checked={Boolean(formData[field.id])}
                              onChange={(e) => handleChange(field.id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 accent-primary focus:ring-primary cursor-pointer shrink-0"
                              style={{ accentColor: primaryColor }}
                            />
                            <Label htmlFor={`tr-dyn-${field.id}`} className="text-xs font-medium cursor-pointer text-foreground leading-snug">
                              {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                            </Label>
                          </div>
                        );
                      }

                      // 2. SELECT FIELD (e.g. Vehicle Type)
                      if (field.type === 'select') {
                        return (
                          <div key={field.id} className={`${spanClass} flex flex-col justify-end space-y-1.5`}>
                            <Label htmlFor={`tr-dyn-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                              {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                            </Label>
                            <div className="relative">
                              <select
                                id={`tr-dyn-${field.id}`}
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

                      // 3. TEXTAREA FIELD (e.g. Message)
                      if (field.type === 'textarea') {
                        return (
                          <div key={field.id} className={`${spanClass} space-y-1.5`}>
                            <Label htmlFor={`tr-dyn-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                              {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                            </Label>
                            <textarea
                              id={`tr-dyn-${field.id}`}
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
                            <Label htmlFor={`tr-dyn-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                              {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                            </Label>
                            <DatePicker
                              id={`tr-dyn-${field.id}`}
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

                      // 4. STANDARD INPUTS (text, email, tel, number, time, datetime-local)
                      return (
                        <div key={field.id} className={`${spanClass} flex flex-col justify-end space-y-1.5`}>
                          <Label htmlFor={`tr-dyn-${field.id}`} className="text-xs font-semibold text-foreground leading-snug">
                            {field.label}{field.required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
                          </Label>
                          <Input
                            id={`tr-dyn-${field.id}`}
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

                  {/* Primary CTA Submit Button */}
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
                      fConfig.buttonText || 'Request Transfer'
                    )}
                  </Button>

                  {/* WhatsApp Direct Prefilled Link */}
                  <div className="pt-2 text-center">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold hover:underline transition-all cursor-pointer"
                      style={{ color: primaryColor }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Or message us on WhatsApp</span>
                    </a>
                  </div>

                  {/* Trust Footer Notice */}
                  {fConfig.noticeText && (
                    <p className="text-[11px] text-muted-foreground text-center pt-1">
                      {fConfig.noticeText}
                    </p>
                  )}
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
