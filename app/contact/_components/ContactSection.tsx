'use client';

import { ContactInfo, ContactFormConfig } from '@/types/app-config';
import { ArrowUpRight, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export function ContactSection({ 
  data, 
  formConfig,
  primaryColor,
  subjects = ['General Inquiry', 'Feedback']
}: { 
  data: ContactInfo; 
  formConfig?: ContactFormConfig;
  primaryColor: string;
  subjects?: string[];
}) {
  const fConfig = formConfig || {
    title: 'Send a message',
    buttonText: 'Submit request',
    accessKey: ''
  };

  if (data.enabled === false && fConfig.enabled === false) return null;

  return (
    <section 
      id="contact" 
      className="py-24 px-6"
      style={{ backgroundColor: data.backgroundColor || '#f5f5f0' }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
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

        {/* Right Column: Form */}
        {fConfig.enabled !== false && (
          <div 
            className="rounded-[2rem] p-8 md:p-10 shadow-lg border border-black/5"
            style={{ backgroundColor: fConfig.backgroundColor || '#ffffff' }}
          >
            <h3 className="text-3xl font-serif text-[#1e1e1e] mb-8">{fConfig.title}</h3>
          
          <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
            <input type="hidden" name="access_key" value={fConfig.accessKey} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Jane Doe" 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="jane@example.com" 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="+254 ..." 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Subject</label>
                <select name="subject" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors bg-white appearance-none">
                  {subjects.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Your Message</label>
              <textarea 
                name="message"
                required
                rows={4} 
                placeholder="Tell us about your next big fishing trip..." 
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full rounded-xl py-4 px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              Submit request <span className="ml-1">►</span>
            </button>
          </form>
        </div>
        )}

      </div>
    </section>
  );
}
