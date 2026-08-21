'use client';

import React, { useState } from 'react';
import { ContactInfo, ContactFormConfig, DynamicFormField } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import { ArrowUpRight, MapPin, Phone, Mail, MessageCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactSection({ 
  data, 
  formConfig,
  primaryColor,
}: { 
  data: ContactInfo; 
  formConfig?: ContactFormConfig;
  primaryColor: string;
  subjects?: string[];
}) {
  const fConfig = formConfig || defaultConfig.contactPage.form;

  const fields: DynamicFormField[] = (fConfig.fields && fConfig.fields.length > 0)
    ? fConfig.fields.filter((f) => f.enabled !== false)
    : (defaultConfig.contactPage.form.fields || []);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize dynamic form values
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

  const handleChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, string | boolean> = {};
      fields.forEach((f) => {
        const val = formData[f.id];
        payload[f.label || f.id] = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val || 'N/A');
      });

      const customerName = String(formData.name || formData.fullName || 'Valued Guest');

      if (fConfig.accessKey && fConfig.accessKey.trim() !== '') {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: fConfig.accessKey,
            subject: `Contact Inquiry: ${customerName}`,
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

  if (data.enabled === false && fConfig.enabled === false) return null;

  return (
    <section 
      id="contact" 
      className="py-24 px-6"
      style={{ backgroundColor: data.backgroundColor || '#f5f5f0' }}
    >
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${data.enabled !== false && fConfig.enabled !== false ? 'lg:grid-cols-2 gap-16' : 'max-w-3xl'} items-start`}>
        
        {/* Left Column: Details */}
        {data.enabled !== false && (
          <div>
            <span
              className="mb-3 text-xs font-semibold uppercase tracking-widest block"
              style={{ color: primaryColor }}
            >
              REACH OUT
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1e1e1e] mb-12">We are closer than you think.</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Location */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
                  <span className="text-sm font-semibold" style={{ color: primaryColor }}>Our Location</span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed mb-6">
                  {data.location}
                </p>
                <a href={data.locationLink} className="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
                  View on Google Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              {/* Call Us */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5" style={{ color: primaryColor }} />
                  <span className="text-sm font-semibold" style={{ color: primaryColor }}>Call Us</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-6">
                  {data.phone}
                </p>
                <a href={data.tripAdvisorLink} className="text-sm font-semibold text-slate-500 flex items-center gap-1 hover:opacity-70 transition-opacity">
                  Find us on TripAdvisor <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              {/* General Inquiries */}
              <div className="flex items-center gap-4 bg-[#efebe4] rounded-2xl p-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#e5dfd3]">
                  <Mail className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">General Inquiries</p>
                  <a href={`mailto:${data.email}`} className="text-sm flex items-center gap-1 mt-0.5 hover:underline" style={{ color: primaryColor }}>
                    {data.email} <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4 bg-[#efebe4] rounded-2xl p-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#e5dfd3]">
                  <MessageCircle className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">WhatsApp</p>
                  <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`} className="text-sm flex items-center gap-1 mt-0.5 hover:underline" style={{ color: primaryColor }}>
                    {data.whatsapp} <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Dynamic Form */}
        {fConfig.enabled !== false && (
          <div 
            className="rounded-[2rem] p-8 md:p-10 shadow-lg border border-black/5"
            style={{ backgroundColor: fConfig.backgroundColor || '#ffffff' }}
          >
            <div className="mb-8">
              <h3 className="text-3xl font-serif text-[#1e1e1e]">{fConfig.title}</h3>
              {fConfig.subtitle && (
                <p className="text-sm text-slate-500 mt-2">{fConfig.subtitle}</p>
              )}
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-serif font-bold text-slate-800">Message Sent!</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 inline-flex items-center text-xs font-semibold underline"
                  style={{ color: primaryColor }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3.5 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fields.map((field) => {
                    const spanClass = field.halfWidth ? 'md:col-span-1' : 'md:col-span-2';

                    if (field.type === 'checkbox') {
                      return (
                        <div key={field.id} className={`${spanClass} flex items-center gap-3 pt-2`}>
                          <input
                            type="checkbox"
                            id={`cnt-${field.id}`}
                            checked={Boolean(formData[field.id])}
                            onChange={(e) => handleChange(field.id, e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 accent-primary"
                            style={{ accentColor: primaryColor }}
                          />
                          <label htmlFor={`cnt-${field.id}`} className="text-xs font-semibold text-slate-700 cursor-pointer">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                        </div>
                      );
                    }

                    if (field.type === 'select') {
                      return (
                        <div key={field.id} className={`${spanClass} space-y-2`}>
                          <label className="text-xs font-semibold text-slate-500">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <select
                            id={`cnt-${field.id}`}
                            required={field.required}
                            value={String(formData[field.id] || '')}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors bg-white appearance-none"
                          >
                            {field.placeholder && <option value="">{field.placeholder}</option>}
                            {(field.options || []).map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    if (field.type === 'textarea') {
                      return (
                        <div key={field.id} className={`${spanClass} space-y-2`}>
                          <label className="text-xs font-semibold text-slate-500">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <textarea
                            id={`cnt-${field.id}`}
                            required={field.required}
                            rows={4}
                            placeholder={field.placeholder || ''}
                            value={String(formData[field.id] || '')}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors resize-none"
                          />
                        </div>
                      );
                    }

                    // Text, Email, Tel, Number, Date, Time, Datetime-local
                    return (
                      <div key={field.id} className={`${spanClass} space-y-2`}>
                        <label className="text-xs font-semibold text-slate-500">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          id={`cnt-${field.id}`}
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder || ''}
                          value={String(formData[field.id] || '')}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"
                        />
                      </div>
                    );
                  })}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full rounded-xl py-4 px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {fConfig.buttonText || 'Submit request'} <span className="ml-1">►</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
