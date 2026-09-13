'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionList } from '@/types/app-config';

interface AirTicketingFAQSectionProps {
  data?: SectionList<{
    question: string;
    answer: string;
    enabled?: boolean;
  }>;
  primaryColor?: string;
  accentColor?: string;
}

export function AirTicketingFAQSection({
  data,
  accentColor = '#d97706',
}: AirTicketingFAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!data || !data.enabled || !data.items || data.items.length === 0) return null;

  const validItems = data.items.filter((item) => item.enabled !== false);

  return (
    <section className="py-20 bg-[#faf8f5] dark:bg-[#0c120e] border-t border-zinc-200/60 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          {data.eyebrow && (
            <p 
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: accentColor }}
            >
              {data.eyebrow}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
            {data.title || 'Frequently Asked Questions'}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {validItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                >
                  <span className="text-sm sm:text-base pr-4">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
