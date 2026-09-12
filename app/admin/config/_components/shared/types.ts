import type { LucideIcon } from 'lucide-react';
import type { AppConfig } from '@/types/app-config';
import {
  Palette,
  Compass,
  History,
  Home,
  Layers,
  BarChart2,
  Map,
  Star,
  HelpCircle,
  ImageIcon,
  Megaphone,
  LayoutDashboard,
  Calendar,
  Car,
  Info,
  Phone,
  FileText,
  Users,
  Sparkles,
} from 'lucide-react';

export type SectionKey =
  | 'branding'
  | 'navigation'
  | 'versions'
  | 'hero'
  | 'stats'
  | 'experiences'
  | 'tours'
  | 'home-excursions'
  | 'reviews'
  | 'whyus'
  | 'gallery'
  | 'cta'
  | 'footer'
  | 'tours-page-hero'
  | 'tours-page-list'
  | 'tours-page-booking'
  | 'excursions-hero'
  | 'excursions-list'
  | 'excursions-booking'
  | 'transfers-hero'
  | 'transfers-routes'
  | 'transfers-booking'
  | 'transfers-fleet'
  | 'transfers-faq'
  | 'about-hero'
  | 'about-story'
  | 'about-values'
  | 'about-team'
  | 'about-impact'
  | 'about-cta'
  | 'contact-hero'
  | 'contact-details'
  | 'contact-faq';

export interface EditorProps {
  draft: AppConfig;
  set: (fn: (p: AppConfig) => AppConfig) => void;
}

export interface SectionItem {
  key: SectionKey;
  label: string;
  Icon: LucideIcon;
  description: string;
}

export interface PageItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  href: string;
  sections: SectionItem[];
}

export const APP_SETTINGS: SectionItem[] = [
  { key: 'branding', label: 'Branding & Theme', Icon: Palette, description: 'Colors, app name, logo' },
  { key: 'navigation', label: 'Header Navigation', Icon: Compass, description: 'Top navbar links & order' },
  { key: 'versions', label: 'Version History', Icon: History, description: 'Config snapshots & restore' },
];

export const PAGES: PageItem[] = [
  {
    id: 'home',
    label: 'Home',
    Icon: Home,
    href: '/',
    sections: [
      { key: 'hero',            label: 'Hero',                Icon: Layers,     description: 'Main splash section' },
      { key: 'stats',           label: 'Stats Bar',           Icon: BarChart2,  description: '4 stat counters' },
      { key: 'experiences',     label: 'Experiences',         Icon: Sparkles,   description: 'Core offerings (Safaris, Excursions, Transfers)' },
      { key: 'tours',           label: 'Featured Tours',      Icon: Map,        description: 'Tour cards' },
      { key: 'home-excursions', label: 'Featured Excursions', Icon: Compass,    description: 'Day excursion cards' },
      { key: 'reviews',         label: 'Reviews',             Icon: Star,       description: 'Guest testimonials' },
      { key: 'whyus',           label: 'Why Us',              Icon: HelpCircle, description: 'Feature highlights' },
      { key: 'gallery',         label: 'Gallery',             Icon: ImageIcon,  description: 'Catch photo gallery' },
      { key: 'cta',             label: 'CTA Banner',          Icon: Megaphone,  description: 'Bottom call-to-action' },
      { key: 'footer',          label: 'Footer',              Icon: LayoutDashboard, description: 'Site footer & links' },
    ],
  },
  {
    id: 'tours',
    label: 'Safaris',
    Icon: Compass,
    href: '/safaris',
    sections: [
      { key: 'tours-page-hero', label: 'Hero', Icon: Layers, description: 'Safaris splash hero' },
      { key: 'tours-page-list', label: 'Safaris Listing', Icon: Map, description: 'Safari packages & cards' },
      { key: 'tours-page-booking', label: 'Booking Form', Icon: Calendar, description: 'Single safari reservation form settings' },
    ],
  },
  {
    id: 'excursions',
    label: 'Excursions',
    Icon: Compass,
    href: '/excursions',
    sections: [
      { key: 'excursions-hero', label: 'Hero', Icon: Layers, description: 'Excursions & Day Trips splash hero' },
      { key: 'excursions-list', label: 'Excursions Listing', Icon: Map, description: 'Excursion packages & coastal activities' },
      { key: 'excursions-booking', label: 'Booking Form', Icon: Calendar, description: 'Single excursion reservation form settings' },
    ],
  },
  {
    id: 'transfers',
    label: 'Transfers',
    Icon: Car,
    href: '/transfers',
    sections: [
      { key: 'transfers-hero', label: 'Hero', Icon: Layers, description: 'Airport & Coast transfer splash hero' },
      { key: 'transfers-routes', label: 'Available Routes', Icon: Map, description: 'Transfer routes and estimated travel times' },
      { key: 'transfers-booking', label: 'Booking Form', Icon: Calendar, description: 'Transfer booking form & dynamic fields' },
      { key: 'transfers-fleet', label: 'Fleet Overview', Icon: Car, description: 'Vehicles, passenger & luggage capacity' },
      { key: 'transfers-faq', label: 'FAQ', Icon: HelpCircle, description: 'Transfer & airport pickup questions' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    Icon: Info,
    href: '/about',
    sections: [
      { key: 'about-hero',   label: 'Hero',              Icon: Layers,     description: 'About splash hero section' },
      { key: 'about-story',  label: 'Our Story',         Icon: FileText,   description: 'Heritage narrative & imagery' },
      { key: 'about-values', label: 'Core Values',       Icon: Star,       description: 'Company core values cards' },
      { key: 'about-team',   label: 'The Crew',          Icon: Users,      description: 'Skipper and guide profiles' },
      { key: 'about-impact', label: 'Impact & Partners', Icon: BarChart2,  description: 'Conservation stats & partners' },
      { key: 'about-cta',    label: 'CTA Banner',        Icon: Megaphone,  description: 'Bottom call-to-action banner' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    Icon: Phone,
    href: '/contact',
    sections: [
      { key: 'contact-hero',     label: 'Hero',       Icon: Layers,  description: 'Contact splash section' },
      { key: 'contact-details',  label: 'Contact Section', Icon: Phone,   description: 'Details and Form' },
      { key: 'contact-faq',      label: 'FAQ',        Icon: HelpCircle, description: 'Frequently asked questions' },
    ],
  },
];
