import { FAQItem } from '@/types/app-config';
import { isColorDark } from '@/lib/utils';
import { Sun, Globe, BriefcaseMedical } from 'lucide-react';

export function FAQSection({ data, primaryColor }: { data: { enabled: boolean; backgroundColor?: string; title?: string; subtitle?: string; eyebrow?: string; items: FAQItem[] }; primaryColor: string }) {
  if (!data.enabled) return null;
  const visibleFaqs = data.items.filter(f => f.enabled);
  if (visibleFaqs.length === 0) return null;

  const isDark = isColorDark(data.backgroundColor);

  // We hardcode icons for this specific design based on the screenshot, but ideally they'd come from config
  const icons = [Sun, Globe, BriefcaseMedical];

  return (
    <section 
      className={`py-24 px-6 ${isDark ? 'dark text-white' : 'text-foreground'}`}
      style={{ backgroundColor: data.backgroundColor || '#f5f5f0' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center text-center">
          {data.eyebrow && data.eyebrow.trim() !== '' && (
            <span
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: primaryColor }}
            >
              {data.eyebrow}
            </span>
          )}
          {data.title && data.title.trim() !== '' && (
            <h2 className="text-3xl md:text-5xl font-serif text-[#1e1e1e]">{data.title}</h2>
          )}
          {data.subtitle && data.subtitle.trim() !== '' && (
            <p className="mt-4 text-slate-500 max-w-2xl">{data.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleFaqs.map((faq, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-2xl bg-white p-8 transition-shadow hover:shadow-lg hover:shadow-black/5"
              >
                <div className="mb-2">
                  <Icon className="h-6 w-6" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-lg font-bold text-[#1e1e1e] leading-snug">{faq.question}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
