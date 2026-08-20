import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isColorDark(hexcolor?: string) {
  if (!hexcolor) return false;
  hexcolor = hexcolor.replace('#', '');
  if (hexcolor.length === 3) hexcolor = hexcolor.split('').map(c => c + c).join('');
  const r = parseInt(hexcolor.substring(0, 2), 16) || 0;
  const g = parseInt(hexcolor.substring(2, 4), 16) || 0;
  const b = parseInt(hexcolor.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
}
