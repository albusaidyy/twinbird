'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Plane, CheckCircle2, MessageCircle, Loader2, AlertCircle, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { AirTicketingBookingFormConfig, DynamicFormField } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';

interface AirTicketingBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoute?: string;
  defaultDeparture?: string;
  defaultDestination?: string;
  formConfig?: AirTicketingBookingFormConfig;
  primaryColor?: string;
  accentColor?: string;
  defaultAccessKey?: string;
}

export function AirTicketingBookingDialog({
  isOpen,
  onClose,
  selectedRoute = '',
  defaultDeparture = '',
  defaultDestination = '',
  formConfig,
  primaryColor = '#111827',
  defaultAccessKey,
}: AirTicketingBookingDialogProps) {
  const [mounted, setMounted] = useState(false);
  const fConfig: AirTicketingBookingFormConfig = formConfig || defaultConfig.airTicketingPage!.bookingForm!;

  const fields: DynamicFormField[] = useMemo(() => {
    return (fConfig.fields && fConfig.fields.length > 0)
      ? fConfig.fields.filter((f) => f.enabled !== false)
      : (defaultConfig.airTicketingPage!.bookingForm!.fields || []);
  }, [fConfig.fields]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize dynamic form state
  const [formData, setFormData] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    fields.forEach((f) => {
      if (f.type === 'checkbox') {
        init[f.id] = false;
      } else if (f.type === 'select' && f.options && f.options.length > 0) {
        init[f.id] = f.options[0];
      } else if (f.id === 'adults') {
        init[f.id] = '1';
      } else if (f.id === 'children') {
        init[f.id] = '0';
      } else {
        init[f.id] = '';
      }
    });
    return init;
  });

  // Track previous isOpen state to reset form safely on open during render
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevRoute, setPrevRoute] = useState(selectedRoute);

  if (prevIsOpen !== isOpen || prevRoute !== selectedRoute) {
    setPrevIsOpen(isOpen);
    setPrevRoute(selectedRoute);
    if (isOpen) {
      setSubmitted(false);
      setError(null);
      if (defaultDeparture || defaultDestination || selectedRoute) {
        setFormData((prev) => {
          const next = { ...prev };
          const depField = fields.find((f) => /depart/i.test(f.id) || /origin/i.test(f.id) || /from/i.test(f.id));
          const destField = fields.find((f) => /dest/i.test(f.id) || /arriv/i.test(f.id) || /to/i.test(f.id));
          const routeField = fields.find((f) => /route/i.test(f.id) || /flight/i.test(f.id));

          if (depField && defaultDeparture) next[depField.id] = defaultDeparture;
          if (destField && defaultDestination) next[destField.id] = defaultDestination;
          if (routeField && selectedRoute) next[routeField.id] = selectedRoute;
          return next;
        });
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const accessKey = fConfig.accessKey || defaultAccessKey || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, string | boolean> = {};

      if (selectedRoute) {
        payload['Selected Flight Route'] = selectedRoute;
      }

      fields.forEach((f) => {
        const val = formData[f.id];
        payload[f.label || f.id] = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val || 'N/A');
      });

      const customerName = String(formData.fullName || formData.name || 'Valued Passenger');

      if (accessKey && accessKey.trim() !== '') {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `Flight Ticket Inquiry: ${customerName} (${selectedRoute || 'Custom Route'})`,
            from_name: customerName,
            ...payload,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Submission failed. Please try again.');
        }
      } else {
        // Mock delay
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setSubmitted(true);
      toast.success('Flight inquiry received successfully!');
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
    const prefix = fConfig.whatsappText || 'Hello Twinbird Travel Agency! I would like to inquire about booking a flight:';

    const lines = [prefix];
    if (selectedRoute) lines.push(`• Route: ${selectedRoute}`);
    if (formData.tripType) lines.push(`• Trip Type: ${formData.tripType}`);
    if (formData.departureAirport) lines.push(`• From: ${formData.departureAirport}`);
    if (formData.destinationAirport) lines.push(`• To: ${formData.destinationAirport}`);
    if (formData.departureDate) lines.push(`• Departure: ${formData.departureDate}`);
    if (formData.returnDate) lines.push(`• Return: ${formData.returnDate}`);
    if (formData.adults) lines.push(`• Adults: ${formData.adults}`);
    if (formData.children && formData.children !== '0') lines.push(`• Children: ${formData.children}`);
    if (formData.cabinClass) lines.push(`• Class: ${formData.cabinClass}`);
    if (formData.specialRequests) lines.push(`• Notes: ${formData.specialRequests}`);

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Sticky Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <Plane className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-zinc-900 dark:text-white truncate">
                {fConfig.title || 'Book / Inquire Flight Tickets'}
              </h3>
              {selectedRoute ? (
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold truncate flex items-center gap-1 mt-0.5">
                  <span>Selected Route:</span>
                  <span className="underline">{selectedRoute}</span>
                </p>
              ) : (
                fConfig.subtitle && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {fConfig.subtitle}
                  </p>
                )
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body with smooth scrolling */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white">
                Flight Inquiry Received!
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Thank you for your flight request. Our air ticketing desk will review live seat availability, compare the best carrier fares, and confirm your itinerary promptly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="text-xs w-full sm:w-auto"
                >
                  Done
                </Button>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  Follow up on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-3.5 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Dynamic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {fields.map((field) => {
                  const isHalf = field.halfWidth ?? (field.type === 'date' || field.type === 'time' || field.type === 'number');
                  const colSpanClass = isHalf ? 'col-span-1' : 'col-span-1 sm:col-span-2';

                  if (field.type === 'checkbox') {
                    return (
                      <div key={field.id} className={`${colSpanClass} flex items-center gap-2.5 pt-1`}>
                        <input
                          type="checkbox"
                          id={`dlg-${field.id}`}
                          checked={Boolean(formData[field.id])}
                          onChange={(e) => handleChange(field.id, e.target.checked)}
                          className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <Label htmlFor={`dlg-${field.id}`} className="text-xs cursor-pointer text-zinc-700 dark:text-zinc-300 select-none">
                          {field.label}
                        </Label>
                      </div>
                    );
                  }

                  if (field.type === 'select') {
                    const options = field.options || [];
                    return (
                      <div key={field.id} className={`${colSpanClass} space-y-1`}>
                        <Label htmlFor={`dlg-${field.id}`} className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="relative">
                          <select
                            id={`dlg-${field.id}`}
                            value={String(formData[field.id] || '')}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            required={field.required}
                            className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 px-3 text-xs text-zinc-900 dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 appearance-none cursor-pointer"
                          >
                            {options.map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-zinc-400" />
                        </div>
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.id} className={`${colSpanClass} space-y-1`}>
                        <Label htmlFor={`dlg-${field.id}`} className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <textarea
                          id={`dlg-${field.id}`}
                          rows={2}
                          value={String(formData[field.id] || '')}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                        />
                      </div>
                    );
                  }

                  if (field.type === 'date') {
                    return (
                      <div key={field.id} className={`${colSpanClass} space-y-1`}>
                        <Label htmlFor={`dlg-${field.id}`} className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <DatePicker
                          id={`dlg-${field.id}`}
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

                  return (
                    <div key={field.id} className={`${colSpanClass} space-y-1`}>
                      <Label htmlFor={`dlg-${field.id}`} className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id={`dlg-${field.id}`}
                        type={field.type || 'text'}
                        value={String(formData[field.id] || '')}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting flight request...
                    </>
                  ) : (
                    fConfig.buttonText || 'Request Flight Quote'
                  )}
                </Button>

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Chat Directly on WhatsApp
                </a>

                {fConfig.noticeText && (
                  <p className="text-center text-[10px] sm:text-[11px] text-zinc-400 pt-0.5">
                    {fConfig.noticeText}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
