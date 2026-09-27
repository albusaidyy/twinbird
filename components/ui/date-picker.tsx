'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useId } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  id?: string;
  value?: string; // Expects 'YYYY-MM-DD' or ''
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  primaryColor?: string;
  minDate?: string; // 'YYYY-MM-DD' - optional min selectable date
  name?: string;
  align?: 'left' | 'right' | 'auto';
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr || !dateStr.includes('-')) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map((p) => parseInt(p, 10));
  if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;

  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toDateString(year: number, monthIndex: number, day: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function DatePicker({
  id,
  value = '',
  onChange,
  placeholder = 'Select date',
  required = false,
  disabled = false,
  className,
  primaryColor = '#193da9',
  minDate,
  name,
  align = 'left',
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to parse value for calendar view
  const parseViewFromValue = (val?: string) => {
    if (val && val.includes('-')) {
      const [y, m] = val.split('-').map((v) => parseInt(v, 10));
      if (!isNaN(y) && !isNaN(m)) {
        return { year: y, month: m - 1 };
      }
    }
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  };

  const [prevValue, setPrevValue] = useState(value);
  const [viewDate, setViewDate] = useState(() => parseViewFromValue(value));


  // Sync viewDate when value changes externally (React recommended state adjustment pattern)
  if (value !== prevValue) {
    setPrevValue(value);
    setViewDate(parseViewFromValue(value));
  }

  // Click outside & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const { year, month } = viewDate;

  const prevMonth = () => {
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  };

  const nextMonth = () => {
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  };

  // Calendar days grid computation
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = (() => {
    const d = new Date();
    return toDateString(d.getFullYear(), d.getMonth(), d.getDate());
  })();

  const handleSelectDay = (dayNum: number, targetMonth = month, targetYear = year) => {
    const formatted = toDateString(targetYear, targetMonth, dayNum);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleQuickToday = () => {
    const d = new Date();
    setViewDate({ year: d.getFullYear(), month: d.getMonth() });
    onChange(todayStr);
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange('');
  };

  const displayLabel = formatDisplayDate(value);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for form standard submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      )}

      {/* Styled Trigger Input */}
      <button
        type="button"
        id={inputId}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={cn(
          'w-full h-10 px-3 rounded-md border text-left text-xs transition-all flex items-center justify-between gap-2 select-none outline-none',
          'bg-background border-input text-foreground hover:bg-muted/40',
          'focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          isOpen && 'border-ring ring-1 ring-ring shadow-xs',
          className
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          <CalendarIcon
            className="h-4 w-4 shrink-0 transition-colors"
            style={{ color: value ? primaryColor : undefined }}
          />
          <span
            className={cn(
              'truncate font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            {value ? displayLabel : placeholder}
          </span>
        </div>

        {value && !disabled && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                handleClear();
              }
            }}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            title="Clear date"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {/* Dropdown Calendar Popover */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50 w-[300px] sm:w-[320px] max-w-[calc(100vw-24px)] p-3.5 sm:p-4',
            'rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 dark:border-white/10',
            'shadow-2xl shadow-black/15 dark:shadow-black/60 backdrop-blur-md',
            'animate-in fade-in-0 zoom-in-95 duration-150 select-none',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {/* Header Month / Year Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <button
              type="button"
              onClick={prevMonth}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted text-foreground transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
              {MONTHS[month]} {year}
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted text-foreground transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
            {WEEKDAYS.map((wd, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold text-muted-foreground/80 tracking-wider"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {/* Previous Month Days (Dimmed) */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
              const day = daysInPrevMonth - firstDayOfWeek + idx + 1;
              const prevM = month === 0 ? 11 : month - 1;
              const prevY = month === 0 ? year - 1 : year;
              const dStr = toDateString(prevY, prevM, day);
              const isPast = minDate ? dStr < minDate : false;

              return (
                <button
                  key={`prev-${idx}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(day, prevM, prevY)}
                  className="h-8 sm:h-9 w-full rounded-lg text-xs font-normal text-muted-foreground/40 hover:bg-muted/40 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                >
                  {day}
                </button>
              );
            })}

            {/* Current Month Days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const day = idx + 1;
              const dStr = toDateString(year, month, day);
              const isSelected = value === dStr;
              const isToday = todayStr === dStr;
              const isPast = minDate ? dStr < minDate : false;

              return (
                <button
                  key={`cur-${day}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(day, month, year)}
                  className={cn(
                    'h-8 sm:h-9 w-full rounded-lg text-xs font-medium transition-all relative flex items-center justify-center',
                    isSelected
                      ? 'text-white font-bold shadow-xs scale-105'
                      : isToday
                      ? 'border border-primary/40 font-bold text-primary hover:bg-muted/60'
                      : 'text-foreground hover:bg-muted/70',
                    isPast && 'opacity-30 pointer-events-none hover:bg-transparent'
                  )}
                  style={{
                    backgroundColor: isSelected ? primaryColor : undefined,
                  }}
                >
                  <span>{day}</span>
                  {isToday && !isSelected && (
                    <span
                      className="absolute bottom-1 h-1 w-1 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </button>
              );
            })}

            {/* Next Month Days (to fill out grid) */}
            {(() => {
              const totalCellsSoFar = firstDayOfWeek + daysInCurrentMonth;
              const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
              return Array.from({ length: remainingCells }).map((_, idx) => {
                const day = idx + 1;
                const nextM = month === 11 ? 0 : month + 1;
                const nextY = month === 11 ? year + 1 : year;
                return (
                  <button
                    key={`next-${idx}`}
                    type="button"
                    onClick={() => handleSelectDay(day, nextM, nextY)}
                    className="h-8 sm:h-9 w-full rounded-lg text-xs font-normal text-muted-foreground/40 hover:bg-muted/40 transition-colors"
                  >
                    {day}
                  </button>
                );
              });
            })()}
          </div>

          {/* Quick Footer Action Buttons */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60">
            <button
              type="button"
              onClick={handleQuickToday}
              className="text-[11px] font-semibold text-foreground/80 hover:text-foreground hover:underline transition-colors px-1 py-0.5"
            >
              Today
            </button>

            {value && (
              <button
                type="button"
                onClick={() => handleClear()}
                className="text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors px-1 py-0.5"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-primary hover:underline px-2 py-1 rounded-md transition-colors"
              style={{ color: primaryColor }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
