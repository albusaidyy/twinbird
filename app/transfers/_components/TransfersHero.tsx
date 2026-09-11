'use client';

import React from 'react';
import { ShieldCheck, Clock, Sparkles, MapPin, LucideIcon } from 'lucide-react';
import { TransferFeature } from '@/types/app-config';

const iconComponents: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
};

interface TransfersHeroProps {
  eyebrow?: string;
  headline?: string;
  subtitle?: string;
  features?: TransferFeature[];
  primaryColor?: string;
  accentColor?: string;
}

export function TransfersHero({
  eyebrow = 'AIRPORT & COAST',
  headline = 'Transfer Services',
  subtitle = 'Reliable, comfortable transfers across the Kenya Coast — from airport pick-ups to full-day hire.',
  features = [],
  primaryColor = '#1b4332',
  accentColor = '#d97706',
}: TransfersHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#161a18] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Subtle luxury background radial glows */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
      />
      <div 
        className="pointer-events-none absolute -bottom-32 right-1/4 w-[500px] h-[350px] rounded-full blur-3xl opacity-15"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {eyebrow && (
            <p 
              className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em]"
              style={{ color: accentColor }}
            >
              {eyebrow}
            </p>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            {headline}
          </h1>

          {subtitle && (
            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto pt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* 4 Feature Highlights Grid */}
        {features && features.length > 0 && (
          <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((item, idx) => {
              const IconComp = iconComponents[item.icon] || ShieldCheck;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl bg-white/95 dark:bg-zinc-900/90 p-6 sm:p-7 shadow-xl shadow-black/10 border border-white/20 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300"
                      style={{ 
                        backgroundColor: `${accentColor}18`, 
                        color: accentColor 
                      }}
                    >
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
