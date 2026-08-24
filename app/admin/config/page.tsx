'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { saveAppConfig } from '@/lib/config/saveAppConfig';
import { defaultConfig } from '@/config/default-config';
import { uploadImage, getMediaLibrary, type MediaItem } from './actions';
import type { AppConfig, NavItem, StatItem, TourItem, TourBookingFormConfig, DynamicFormField, FormFieldType, ReviewItem, WhyUsItem, GalleryItem, FooterLink, SocialLink, AboutValueItem, AboutTeamMember, StoryParagraphItem } from '@/types/app-config';
import {
  CheckCircle,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  BarChart2,
  Map,
  Star,
  HelpCircle,
  Megaphone,
  Layers,
  Home,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle,
  LayoutDashboard,
  Info,
  Phone,
  ChevronRight,
  ChevronDown,
  Upload,
  Loader2,
  X,
  Images,
  Check,
  RefreshCw,
  Search,
  HardDrive,
  Cloud,
  Ship,
  Compass,
  Calendar,
  ArrowUp,
  ArrowDown,
  Menu,
  PanelLeftClose,
  Users,
  FileText,
} from 'lucide-react';

// ─── Sidebar configuration ──────────────────────────────────────────────────────
type SectionKey =
  | 'branding'
  | 'navigation'
  | 'hero'
  | 'stats'
  | 'tours'
  | 'reviews'
  | 'whyus'
  | 'gallery'
  | 'cta'
  | 'footer'
  | 'tours-page-hero'
  | 'tours-page-list'
  | 'tours-page-booking'
  | 'about-hero'
  | 'about-story'
  | 'about-values'
  | 'about-team'
  | 'about-impact'
  | 'about-cta'
  | 'contact-hero'
  | 'contact-details'
  | 'contact-faq';

const APP_SETTINGS = [
  { key: 'branding' as SectionKey, label: 'Branding & Theme', Icon: Palette, description: 'Colors, app name, logo' },
  { key: 'navigation' as SectionKey, label: 'Header Navigation', Icon: Compass, description: 'Top navbar links & order' },
];

const PAGES = [
  {
    id: 'home',
    label: 'Home',
    Icon: Home,
    href: '/',
    sections: [
      { key: 'hero' as SectionKey,     label: 'Hero',            Icon: Layers,     description: 'Main splash section' },
      { key: 'stats' as SectionKey,    label: 'Stats Bar',       Icon: BarChart2,  description: '4 stat counters' },
      { key: 'tours' as SectionKey,    label: 'Featured Tours',  Icon: Map,        description: 'Tour cards' },
      { key: 'reviews' as SectionKey,  label: 'Reviews',         Icon: Star,       description: 'Guest testimonials' },
      { key: 'whyus' as SectionKey,    label: 'Why Us',          Icon: HelpCircle, description: 'Feature highlights' },
      { key: 'gallery' as SectionKey,  label: 'Gallery',         Icon: ImageIcon,  description: 'Catch photo gallery' },
      { key: 'cta' as SectionKey,      label: 'CTA Banner',      Icon: Megaphone,  description: 'Bottom call-to-action' },
      { key: 'footer' as SectionKey,   label: 'Footer',          Icon: LayoutDashboard, description: 'Site footer & links' },
    ],
  },
  {
    id: 'tours',
    label: 'Fishing Charters',
    Icon: Ship,
    href: '/tours',
    sections: [
      { key: 'tours-page-hero' as SectionKey, label: 'Hero', Icon: Layers, description: 'Fishing Charters splash hero' },
      { key: 'tours-page-list' as SectionKey, label: 'Charters Listing', Icon: Map, description: 'Fishing charter packages & cards' },
      { key: 'tours-page-booking' as SectionKey, label: 'Booking Form', Icon: Calendar, description: 'Single charter reservation form settings' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    Icon: Info,
    href: '/about',
    sections: [
      { key: 'about-hero' as SectionKey,   label: 'Hero',              Icon: Layers,     description: 'About splash hero section' },
      { key: 'about-story' as SectionKey,  label: 'Our Story',         Icon: FileText,   description: 'Heritage narrative & imagery' },
      { key: 'about-values' as SectionKey, label: 'Core Values',       Icon: Star,       description: 'Company core values cards' },
      { key: 'about-team' as SectionKey,   label: 'The Crew',          Icon: Users,      description: 'Skipper and guide profiles' },
      { key: 'about-impact' as SectionKey, label: 'Impact & Partners', Icon: BarChart2,  description: 'Conservation stats & partners' },
      { key: 'about-cta' as SectionKey,    label: 'CTA Banner',        Icon: Megaphone,  description: 'Bottom call-to-action banner' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    Icon: Phone,
    href: '/contact',
    sections: [
      { key: 'contact-hero' as SectionKey,     label: 'Hero',       Icon: Layers,  description: 'Contact splash section' },
      { key: 'contact-details' as SectionKey,  label: 'Contact Section', Icon: Phone,   description: 'Details and Form' },
      { key: 'contact-faq' as SectionKey,      label: 'FAQ',        Icon: HelpCircle, description: 'Frequently asked questions' },
    ],
  },
];

// ─── Generic list item editor ─────────────────────────────────────────────────
function FieldRow({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

// ─── Section Header Toggle ────────────────────────────────────────────────────
function SectionToggle({ title, enabled, onChange }: { title: string; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between bg-accent/50 p-4 rounded-lg mb-6 border border-border">
      <div>
        <p className="font-semibold text-sm">Show {title}</p>
        <p className="text-xs text-muted-foreground">Toggle this section on or off on the homepage.</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}

function BackgroundColorPicker({ value, onChange, label = "Background Color", desc = "Pick a custom color for this section." }: { value: string | undefined, onChange: (v: string) => void, label?: string, desc?: string }) {
  return (
    <div className="flex items-center justify-between bg-accent/20 p-4 rounded-lg mb-6 border border-border">
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="flex gap-2 items-center">
        <Input type="color" className="w-12 p-1 h-9" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} />
        <Input className="w-24 font-mono text-xs" value={value || ''} placeholder="#ffffff" onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

// ─── Image Uploader Component with Media Library Browser ─────────────────────
function ImageUploaderField({
  id,
  value,
  onChange,
  placeholder = 'Image URL, upload, or choose from library...',
  folder = 'uploads',
  disabled = false,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  folder?: string;
  presets?: string[];
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'local' | 'uploaded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllFolders, setShowAllFolders] = useState(false);

  const loadImages = async (includeAll = showAllFolders) => {
    setLoadingLibrary(true);
    setError(null);
    try {
      const res = await getMediaLibrary(folder, includeAll);
      setMediaItems(res.items);
    } catch {
      setMediaItems([]);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImage(formData, folder);
      if ('error' in res) {
        setError(res.error);
      } else if (res.url) {
        onChange(res.url);
        const newItem: MediaItem = {
          url: res.url,
          name: file.name || res.url.split('/').pop() || 'uploaded-image',
          source: 'uploaded',
          folder,
        };
        setMediaItems((prev) => [newItem, ...prev.filter((item) => item.url !== res.url)]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const localCount = mediaItems.filter((i) => i.source === 'local').length;
  const uploadedCount = mediaItems.filter((i) => i.source === 'uploaded').length;

  const filteredItems = mediaItems.filter((item) => {
    if (filterTab === 'local' && item.source !== 'local') return false;
    if (filterTab === 'uploaded' && item.source !== 'uploaded') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.folder && item.folder.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Input & Action Buttons */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || uploading}
          />
        </div>

        {/* Upload Button */}
        <label
          htmlFor={`${id}-file`}
          className={`flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors ${
            disabled || uploading ? 'pointer-events-none opacity-50' : ''
          }`}
          title="Upload new image from your device"
        >
          {uploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              <span>Upload</span>
            </>
          )}
        </label>
        <input
          id={`${id}-file`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />

        {/* Browse Library Button */}
        <Button
          type="button"
          variant={showLibrary ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => {
            if (!showLibrary) loadImages(showAllFolders);
            setShowLibrary(!showLibrary);
          }}
          disabled={disabled}
          className="h-9 gap-1.5 text-xs shrink-0"
          title="Browse section image gallery"
        >
          <Images className="h-3.5 w-3.5" />
          <span>Library</span>
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Selected Image Preview Pill */}
      {value && (
        <div className="relative flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-12 w-16 rounded object-cover border border-border bg-background shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Active Image</span>
            <p className="truncate text-xs font-mono text-foreground">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-muted-foreground hover:text-destructive text-xs p-1"
            title="Clear image"
            disabled={disabled || uploading}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Image Library Drawer / Grid */}
      {showLibrary && (
        <div className="rounded-lg border border-border bg-card p-3 shadow-inner space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Images className="h-3.5 w-3.5 text-primary" />
                Media Gallery
              </span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {showAllFolders ? 'all folders' : folder}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextVal = !showAllFolders;
                  setShowAllFolders(nextVal);
                  loadImages(nextVal);
                }}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  showAllFolders
                    ? 'border-primary text-primary bg-primary/10 font-medium'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
                title="Toggle showing all folders or only this section's folder"
              >
                {showAllFolders ? 'Scope to folder' : 'Show all folders'}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                onClick={() => loadImages(showAllFolders)}
                disabled={loadingLibrary}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loadingLibrary ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowLibrary(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Filter tabs & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-lg border border-border/50 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterTab === 'all'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({mediaItems.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('local')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterTab === 'local'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <HardDrive className="h-3 w-3" />
                Local ({localCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('uploaded')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterTab === 'uploaded'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Cloud className="h-3 w-3" />
                Uploaded ({uploadedCount})
              </button>
            </div>

            <div className="relative flex-1 min-w-[140px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="h-7 pl-8 pr-7 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Grid Content */}
          {loadingLibrary ? (
            <div className="flex h-28 items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Loading media files...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
              <p>No images found in this folder.</p>
              {searchQuery && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-1">
              {filteredItems.map((item) => {
                const isSelected = value === item.url;
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => onChange(item.url)}
                    className={`group relative aspect-video rounded-md overflow-hidden border-2 transition-all text-left bg-muted/40 hover:opacity-95 ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border/60 hover:border-foreground/40'
                    }`}
                    title={`${item.name} (${item.url})`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />

                    {/* Source Tag Badge */}
                    <div className="absolute top-1 left-1">
                      <span
                        className={`text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm uppercase tracking-wider ${
                          item.source === 'local'
                            ? 'bg-slate-900/80 text-slate-100'
                            : 'bg-blue-600/90 text-white'
                        }`}
                      >
                        {item.source === 'local' ? 'Local' : 'Upload'}
                      </span>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5 text-primary-foreground shadow-sm">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    {/* Overlay Filename */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate text-[9px] font-medium text-white">{item.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────
function BrandingEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const b = draft.branding;
  const upd = <K extends keyof AppConfig['branding']>(k: K, v: AppConfig['branding'][K]) =>
    set((p) => ({ ...p, branding: { ...p.branding, [k]: v } }));

  return (
    <div className="space-y-6">
      <FieldRow label="App Name" id="b-name">
        <Input id="b-name" value={b.appName} onChange={(e) => upd('appName', e.target.value)} />
      </FieldRow>
      <FieldRow label="Site Meta Description (SEO)" id="b-meta-desc">
        <textarea
          id="b-meta-desc"
          rows={3}
          value={b.metaDescription || ''}
          placeholder="e.g. Premier big-game sportfishing charters, marlin & sailfish safaris, and coastal expeditions on the Kenyan Coast."
          onChange={(e) => upd('metaDescription', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Used by search engines, social media previews, and browser metadata.
        </p>
      </FieldRow>
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Primary Color" id="b-primary">
          <div className="flex gap-2">
            <Input type="color" className="w-12 p-1 h-9" value={b.primaryColor} onChange={(e) => upd('primaryColor', e.target.value)} />
            <Input id="b-primary" value={b.primaryColor} onChange={(e) => upd('primaryColor', e.target.value)} />
          </div>
        </FieldRow>
        <FieldRow label="Accent Color" id="b-accent">
          <div className="flex gap-2">
            <Input type="color" className="w-12 p-1 h-9" value={b.accentColor} onChange={(e) => upd('accentColor', e.target.value)} />
            <Input id="b-accent" value={b.accentColor} onChange={(e) => upd('accentColor', e.target.value)} />
          </div>
        </FieldRow>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="b-dark">Dark Mode Default</Label>
          <div className="text-sm text-muted-foreground">Start app in dark mode</div>
        </div>
        <Switch id="b-dark" checked={b.darkMode} onCheckedChange={(v) => upd('darkMode', v)} />
      </div>
      <Separator />
      
      <FieldRow label="Main Logo" id="b-logo">
        <ImageUploaderField
          id="b-logo"
          value={b.logoUrl ?? ''}
          onChange={(val) => {
            const nextLogo = val || null;
            set((p) => {
              let nextFavicon = p.branding.faviconUrl;
              if (nextLogo && nextLogo.includes('logo')) {
                const suffix = nextLogo.replace(/^.*logo/i, '').replace(/\.(png|jpg|jpeg|svg|webp|ico)$/i, '');
                if (suffix) nextFavicon = `/brand/favicons/favicon${suffix}.ico`;
              }
              return { ...p, branding: { ...p.branding, logoUrl: nextLogo, faviconUrl: nextFavicon } };
            });
          }}
          folder="brand/logos"
          placeholder="Upload or choose logo..."
        />
        <p className="text-[11px] text-muted-foreground mt-1">Recommended: 512x512px or SVG. Used in header and footer.</p>
      </FieldRow>

      <FieldRow label="Favicon" id="b-favicon">
        <ImageUploaderField
          id="b-favicon"
          value={b.faviconUrl ?? ''}
          onChange={(val) => upd('faviconUrl', val || null)}
          folder="brand/favicons"
          placeholder="Upload or choose favicon..."
        />
        <p className="text-[11px] text-muted-foreground mt-1">Recommended: 32x32px or 16x16px (PNG or ICO). Used in browser tab.</p>
      </FieldRow>
    </div>
  );
}

function NavigationEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const nav = draft.navigation || defaultConfig.navigation;
  const updItem = (i: number, k: keyof NavItem, v: string | boolean) =>
    set((p) => {
      const arr = [...(p.navigation || defaultConfig.navigation)];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, navigation: arr };
    });
  const addNavItem = () =>
    set((p) => {
      const current = p.navigation || defaultConfig.navigation;
      return {
        ...p,
        navigation: [
          ...current,
          { key: `custom-${Date.now()}`, label: 'New Link', href: '/', icon: 'Link', enabled: true },
        ],
      };
    });
  const rmNavItem = (i: number) =>
    set((p) => {
      const current = p.navigation || defaultConfig.navigation;
      return {
        ...p,
        navigation: current.filter((_, idx) => idx !== i),
      };
    });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">Header Navigation Links</h3>
        <p className="text-sm text-muted-foreground">Manage the navigation links displayed in the top navbar.</p>
      </div>

      <div className="space-y-3">
        {nav.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 rounded-lg border border-border p-4 bg-card">
            <Switch
              checked={item.enabled}
              onCheckedChange={(v) => updItem(idx, 'enabled', v)}
            />
            <div className="flex-1 grid grid-cols-2 gap-3">
              <FieldRow label="Label" id={`nav-label-${idx}`}>
                <Input
                  id={`nav-label-${idx}`}
                  value={item.label}
                  onChange={(e) => updItem(idx, 'label', e.target.value)}
                  disabled={!item.enabled}
                />
              </FieldRow>
              <FieldRow label="URL / Route" id={`nav-href-${idx}`}>
                <Input
                  id={`nav-href-${idx}`}
                  value={item.href}
                  onChange={(e) => updItem(idx, 'href', e.target.value)}
                  disabled={!item.enabled}
                />
              </FieldRow>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => rmNavItem(idx)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={addNavItem}>
        <Plus className="h-4 w-4" /> Add Nav Link
      </Button>
    </div>
  );
}

function HeroEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const h = draft.homepage.hero;
  const upd = <K extends keyof AppConfig['homepage']['hero']>(k: K, v: AppConfig['homepage']['hero'][K]) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, hero: { ...p.homepage.hero, [k]: v } } }));

  return (
    <div className="space-y-5">
      <SectionToggle title="Hero Section" enabled={h.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={h.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showEyebrow} onCheckedChange={(v) => upd('showEyebrow', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Eyebrow text" id="h-eyebrow">
            <Input id="h-eyebrow" value={h.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} disabled={!h.showEyebrow} />
          </FieldRow>
        </div>
      </div>
      <Separator />
      
      <FieldRow label="Headline" id="h-headline">
        <Input id="h-headline" value={h.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Italic / highlight text" id="h-italic">
        <Input id="h-italic" value={h.italicText} onChange={(e) => upd('italicText', e.target.value)} />
      </FieldRow>
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showSubtitle} onCheckedChange={(v) => upd('showSubtitle', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Subtitle" id="h-subtitle">
            <textarea id="h-subtitle" rows={3} value={h.subtitle}
              onChange={(e) => upd('subtitle', e.target.value)}
              disabled={!h.showSubtitle}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
          </FieldRow>
        </div>
      </div>
      
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Switch checked={h.showPrimaryCta} onCheckedChange={(v) => upd('showPrimaryCta', v)} />
            <span className="text-sm font-semibold">Primary CTA</span>
          </div>
          <FieldRow label="Button label" id="h-cta1-label">
            <Input id="h-cta1-label" value={h.primaryCtaLabel} onChange={(e) => upd('primaryCtaLabel', e.target.value)} disabled={!h.showPrimaryCta} />
          </FieldRow>
          <FieldRow label="Button link" id="h-cta1-href">
            <Input id="h-cta1-href" value={h.primaryCtaHref} onChange={(e) => upd('primaryCtaHref', e.target.value)} disabled={!h.showPrimaryCta} />
          </FieldRow>
        </div>
        
        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Switch checked={h.showSecondaryCta} onCheckedChange={(v) => upd('showSecondaryCta', v)} />
            <span className="text-sm font-semibold">Secondary CTA</span>
          </div>
          <FieldRow label="Button label" id="h-cta2-label">
            <Input id="h-cta2-label" value={h.secondaryCtaLabel} onChange={(e) => upd('secondaryCtaLabel', e.target.value)} disabled={!h.showSecondaryCta} />
          </FieldRow>
          <FieldRow label="Button link" id="h-cta2-href">
            <Input id="h-cta2-href" value={h.secondaryCtaHref} onChange={(e) => upd('secondaryCtaHref', e.target.value)} disabled={!h.showSecondaryCta} />
          </FieldRow>
        </div>
      </div>
      <Separator />
      <FieldRow label="Background image" id="h-image">
        <ImageUploaderField
          id="h-image"
          value={h.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="hero"
          placeholder="Paste image URL or click Upload..."
        />
      </FieldRow>
      <p className="text-[11px] text-muted-foreground mt-1">Recommended: 1920x1080px or higher (JPG, PNG, WEBP). Used as the hero background.</p>
    </div>
  );
}

function SectionHeaderFields({
  data,
  onChange,
}: {
  data: { title?: string; subtitle?: string; eyebrow?: string; enabled: boolean };
  onChange: (key: 'title' | 'subtitle' | 'eyebrow', value: string) => void;
}) {
  return (
    <>
      <FieldRow label="Section Eyebrow" id="sec-eyebrow">
        <Input id="sec-eyebrow" value={data.eyebrow ?? ''} onChange={(e) => onChange('eyebrow', e.target.value)} disabled={!data.enabled} />
      </FieldRow>
      <FieldRow label="Section Title" id="sec-title">
        <Input id="sec-title" value={data.title ?? ''} onChange={(e) => onChange('title', e.target.value)} disabled={!data.enabled} />
      </FieldRow>
      <FieldRow label="Section Subtitle" id="sec-subtitle">
        <Input id="sec-subtitle" value={data.subtitle ?? ''} onChange={(e) => onChange('subtitle', e.target.value)} disabled={!data.enabled} />
      </FieldRow>
      <Separator />
    </>
  );
}

function StatsEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const data = draft.homepage.stats;
  const updEnabled = (v: boolean) => set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, enabled: v } } }));
  const updStat = (i: number, k: keyof StatItem, v: string | boolean) =>
    set((p) => {
      const arr = [...p.homepage.stats.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, items: arr } } };
    });
  const addStat = () =>
    set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, items: [...p.homepage.stats.items, { enabled: true, value: 'New', label: 'Item' }] } } }));
  const rmStat = (i: number) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, items: p.homepage.stats.items.filter((_, idx) => idx !== i) } } }));

  return (
    <div className="space-y-4">
      <SectionToggle title="Stats Bar" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, backgroundColor: v } } }))} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => ({ ...p, homepage: { ...p.homepage, stats: { ...p.homepage.stats, [k]: v } } }))} 
      />

      {data.items.map((s, i) => (
        <div key={i} className="relative rounded-lg border border-border p-4 pt-8 bg-card">
          <div className="absolute top-2 left-3 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={s.enabled} onCheckedChange={(v) => updStat(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{s.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => rmStat(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <FieldRow label="Value" id={`stat-val-${i}`}>
              <Input id={`stat-val-${i}`} value={s.value} onChange={(e) => updStat(i, 'value', e.target.value)} disabled={!s.enabled} />
            </FieldRow>
            <FieldRow label="Label" id={`stat-lbl-${i}`}>
              <Input id={`stat-lbl-${i}`} value={s.label} onChange={(e) => updStat(i, 'label', e.target.value)} disabled={!s.enabled} />
            </FieldRow>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addStat}>
        <Plus className="h-4 w-4" /> Add Stat
      </Button>
    </div>
  );
}

// ─── Tour matching helper across both sections ─────────────────────────────────
function isTourMatch(a: TourItem, b: TourItem, aIdx?: number, bIdx?: number): boolean {
  if (a.id && b.id) return a.id === b.id;
  if (a.slug && b.slug) return a.slug === b.slug;
  if (a.title && b.title && a.title.trim().toLowerCase() === b.title.trim().toLowerCase()) return true;
  if (aIdx !== undefined && bIdx !== undefined) return aIdx === bIdx;
  return false;
}

// ─── Reusable Delete Confirmation Dialog ───────────────────────────────────────
function TourDeleteConfirmDialog({
  isOpen,
  type,
  tourTitle,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  type: 'soft' | 'permanent';
  tourTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const isPermanent = type === 'permanent';

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-full shrink-0 ${
              isPermanent ? 'bg-destructive/15 text-destructive' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isPermanent ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {isPermanent ? 'Permanently Delete Charter?' : 'Soft-Delete Charter?'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isPermanent ? (
                <>
                  Are you sure you want to permanently delete <strong className="text-foreground">{tourTitle}</strong>? This action <span className="font-semibold text-destructive">cannot be undone</span> and will completely erase this charter package from both the Featured Tours and Charters Listing.
                </>
              ) : (
                <>
                  Are you sure you want to soft-delete <strong className="text-foreground">{tourTitle}</strong>? It will become <span className="font-semibold text-foreground">inactive and greyed out</span> on both the Featured Tours and Charters Listing, and will be hidden from public visitors. You can restore it anytime or permanently delete it later.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} className="text-xs h-8">
            Cancel
          </Button>
          <Button
            type="button"
            variant={isPermanent ? 'destructive' : 'default'}
            size="sm"
            onClick={onConfirm}
            className={`text-xs h-8 gap-1.5 ${!isPermanent ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isPermanent ? 'Delete Forever' : 'Soft Delete'}
          </Button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

function ToursEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const data = draft.homepage.tours;
  const toursList = draft.homepage.tours?.items || [];
  const [deletePrompt, setDeletePrompt] = useState<{ type: 'soft' | 'permanent'; tour: TourItem; index: number } | null>(null);

  const toursPageNavLabel = draft.navigation?.find((l) => l.href === '/tours' || l.href.startsWith('/tours'))?.label || PAGES.find((p) => p.id === 'tours')?.label || 'Fishing Charters';
  const toursSectionLabel = PAGES.find((p) => p.id === 'tours')?.sections.find((s) => s.key === 'tours-page-list')?.label || draft.toursPage?.tours?.title || 'Charter Packages';

  const updEnabled = (v: boolean) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, enabled: v } } }));

  const VISIBILITY_KEYS = new Set([
    'enabled',
    'showTitle',
    'showBadge',
    'showDuration',
    'showRating',
    'showPrice',
    'showLocation',
    'showSchedule',
    'showGroupType',
    'showIncluded',
    'showNotIncluded',
    'showWhyChoose',
    'showKnowBeforeYouGo',
  ]);

  const updTour = (i: number, k: keyof TourItem, v: string | number | boolean | string[]) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const currentItem = hpItems[i];
      if (!currentItem) return p;

      hpItems[i] = { ...currentItem, [k]: v };

      if (!VISIBILITY_KEYS.has(k)) {
        const tpIdx = tpItems.findIndex((t, idx) => isTourMatch(t, currentItem, idx, i));
        if (tpIdx !== -1) {
          tpItems[tpIdx] = { ...tpItems[tpIdx], [k]: v };
        } else if (tpItems[i]) {
          tpItems[i] = { ...tpItems[i], [k]: v };
        }
      }

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems } },
      };
    });

  const addTour = () =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];
      const uniqueId = `charter-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newTour: TourItem = {
        id: uniqueId,
        enabled: true,
        deleted: false,
        title: 'New Fishing Charter',
        badge: 'Popular',
        description: 'Experience premier big-game fishing on the Kenyan Coast...',
        duration: 'Guided 6 hours Tour',
        rating: 5,
        imageUrl: '/images/hero/hero.jpg',
        location: 'Watamu Marine Park, Kilifi County',
        showLocation: true,
        schedule: 'Morning Slots (November To March)',
        showSchedule: true,
        groupType: 'Families · Private · Groups',
        showGroupType: true,
        price: 'Contact for pricing',
        overview: 'Experience premier big-game fishing along the Kenyan Coast with full gear and experienced crew.',
        included: ['Professional skipper & crew', 'Tackle & bait', 'Refreshments & lunch'],
        showIncluded: true,
        notIncluded: ['Crew gratuities and tips (optional)', 'Hotel pickup & return transfers', 'Personal swimwear & towels'],
        showNotIncluded: true,
        whyChoose: ['Decades of local fishing experience', 'Modern rigged tournament boat'],
        showWhyChoose: true,
        knowBeforeYouGo: ['Departure: 6:00 AM', 'What to bring: Sunscreen, hat, sunglasses'],
        showKnowBeforeYouGo: true,
        showTitle: true,
        showBadge: true,
        showDuration: true,
        showRating: true,
        showPrice: true,
      };
      const newHpItems = [...hpItems, { ...newTour }];
      const newTpItems = [...tpItems, { ...newTour }];
      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: newHpItems } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: newTpItems } },
      };
    });

  const softDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const markSoftDeleted = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: true, enabled: false, deletedAt: new Date().toISOString() }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markSoftDeleted) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.map(markSoftDeleted) } },
      };
    });

  const restoreTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const markRestored = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: false, enabled: true, deletedAt: undefined }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markRestored) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.map(markRestored) } },
      };
    });

  const permanentDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const notTarget = (t: TourItem, idx: number) => !isTourMatch(t, targetTour, idx, targetIndex);

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.filter(notTarget) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.filter(notTarget) } },
      };
    });

  const moveTour = (i: number, dir: -1 | 1) =>
    set((p) => {
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const target = i + dir;
      if (target < 0 || target >= hpItems.length) return p;

      const tempHp = hpItems[i];
      hpItems[i] = hpItems[target];
      hpItems[target] = tempHp;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems } },
      };
    });

  return (
    <div className="space-y-6">
      {deletePrompt && (
        <TourDeleteConfirmDialog
          isOpen={true}
          type={deletePrompt.type}
          tourTitle={deletePrompt.tour.title}
          onConfirm={() => {
            if (deletePrompt.type === 'soft') {
              softDeleteTour(deletePrompt.tour, deletePrompt.index);
            } else {
              permanentDeleteTour(deletePrompt.tour, deletePrompt.index);
            }
            setDeletePrompt(null);
          }}
          onCancel={() => setDeletePrompt(null)}
        />
      )}

      <SectionToggle title="Featured Tours" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, backgroundColor: v } } }))} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, [k]: v } } }))} 
      />

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 p-3.5 text-xs text-muted-foreground">
        <Ship className="h-4 w-4 shrink-0 text-primary mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Connected to {toursPageNavLabel} Directory</p>
          <p>
            The charters listed below are automatically synced with your <strong>{toursPageNavLabel}</strong> directory (`/tours`) and individual charter pages (`/tours/[slug]`).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Charter Packages ({toursList.length})</h4>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={addTour}>
            <Plus className="h-3.5 w-3.5" /> Add Charter
          </Button>
        </div>

        {toursList.map((t, i) => {
          const isDeleted = Boolean(t.deleted);
          return (
            <div
              key={t.id || `tour-${i}`}
              className={`relative rounded-lg border p-5 pt-11 transition-all ${
                isDeleted
                  ? 'border-dashed border-destructive/40 bg-muted/30 opacity-60'
                  : 'border-border bg-card shadow-xs'
              }`}
            >
              <div className="absolute top-2.5 left-4 right-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {!isDeleted ? (
                    <>
                      <Switch checked={t.enabled} onCheckedChange={(v) => updTour(i, 'enabled', v)} />
                      <span className="text-xs font-semibold text-muted-foreground">
                        Charter #{i + 1} {!t.enabled && '(Hidden)'}
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                      <Trash2 className="h-3 w-3" /> Inactive / Soft-Deleted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {!isDeleted ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === 0}
                        onClick={() => moveTour(i, -1)}
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === toursList.length - 1}
                        onClick={() => moveTour(i, 1)}
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletePrompt({ type: 'soft', tour: t, index: i })}
                        title="Soft delete charter (move to inactive)"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => restoreTour(t, i)}
                        title="Restore charter"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setDeletePrompt({ type: 'permanent', tour: t, index: i })}
                        title="Permanently delete charter"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Forever
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: isDeleted ? 0.6 : t.enabled ? 1 : 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showTitle !== false}
                      onCheckedChange={(v) => updTour(i, 'showTitle', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Title On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Title" id={`t-title-${i}`}>
                        <Input
                          id={`t-title-${i}`}
                          value={t.title}
                          onChange={(e) => updTour(i, 'title', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showTitle === false}
                          className={isDeleted ? 'line-through text-muted-foreground' : ''}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showBadge !== false}
                      onCheckedChange={(v) => updTour(i, 'showBadge', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Badge On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Badge" id={`t-badge-${i}`}>
                        <Input
                          id={`t-badge-${i}`}
                          value={t.badge}
                          onChange={(e) => updTour(i, 'badge', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showBadge === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showDuration !== false}
                      onCheckedChange={(v) => updTour(i, 'showDuration', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Duration On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Duration (e.g. Guided 6 - 8 hours Tour)" id={`t-dur-${i}`}>
                        <Input
                          id={`t-dur-${i}`}
                          value={t.duration}
                          onChange={(e) => updTour(i, 'duration', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showDuration === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showRating !== false}
                      onCheckedChange={(v) => updTour(i, 'showRating', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Rating On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Rating (0–5)" id={`t-rating-${i}`}>
                        <Input
                          id={`t-rating-${i}`}
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={t.rating}
                          onChange={(e) => updTour(i, 'rating', parseFloat(e.target.value) || 0)}
                          disabled={!t.enabled || isDeleted || t.showRating === false}
                        />
                      </FieldRow>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showPrice !== false}
                      onCheckedChange={(v) => updTour(i, 'showPrice', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Pricing On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Price Text" id={`t-price-${i}`}>
                        <Input
                          id={`t-price-${i}`}
                          value={t.price || ''}
                          placeholder="Contact for pricing"
                          onChange={(e) => updTour(i, 'price', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showPrice === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <FieldRow label="Custom URL (Leave blank for auto /tours/[slug])" id={`t-href-${i}`}>
                    <Input id={`t-href-${i}`} value={t.href || ''} placeholder="/tours/..." onChange={(e) => updTour(i, 'href', e.target.value)} disabled={!t.enabled || isDeleted} />
                  </FieldRow>
                </div>
                <FieldRow label="Tour Image" id={`t-img-${i}`}>
                  <ImageUploaderField
                    id={`t-img-${i}`}
                    value={t.imageUrl}
                    onChange={(url) => updTour(i, 'imageUrl', url)}
                    folder="tours"
                    placeholder="Upload or choose tour image..."
                    disabled={!t.enabled || isDeleted}
                  />
                </FieldRow>
                <FieldRow label="Description" id={`t-desc-${i}`}>
                  <textarea id={`t-desc-${i}`} rows={2} value={t.description}
                    onChange={(e) => updTour(i, 'description', e.target.value)}
                    disabled={!t.enabled || isDeleted}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
                </FieldRow>

                <div className="rounded-md bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground border border-border/50">
                  Single charter deep page details (inclusions, itinerary, single-page carousel) are managed under <strong>{toursPageNavLabel} &rarr; {toursSectionLabel}</strong>.
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewsEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const data = draft.homepage.reviews;
  const updEnabled = (v: boolean) => set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, enabled: v } } }));
  const updReview = (i: number, k: keyof ReviewItem, v: string | boolean) =>
    set((p) => {
      const arr = [...p.homepage.reviews.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, items: arr } } };
    });
  const addReview = () =>
    set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, items: [...p.homepage.reviews.items, { enabled: true, name: 'New Guest', location: 'Earth', quote: 'Great!' }] } } }));
  const rmReview = (i: number) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, items: p.homepage.reviews.items.filter((_, idx) => idx !== i) } } }));

  return (
    <div className="space-y-6">
      <SectionToggle title="Reviews" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, backgroundColor: v } } }))} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => ({ ...p, homepage: { ...p.homepage, reviews: { ...p.homepage.reviews, [k]: v } } }))} 
      />

      {data.items.map((r, i) => (
        <div key={i} className="relative rounded-lg border border-border p-5 pt-10 bg-card">
          <div className="absolute top-2 left-4 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={r.enabled} onCheckedChange={(v) => updReview(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{r.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => rmReview(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: r.enabled ? 1 : 0.5 }}>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Name" id={`r-name-${i}`}>
                <Input id={`r-name-${i}`} value={r.name} onChange={(e) => updReview(i, 'name', e.target.value)} disabled={!r.enabled} />
              </FieldRow>
              <FieldRow label="Location" id={`r-loc-${i}`}>
                <Input id={`r-loc-${i}`} value={r.location} onChange={(e) => updReview(i, 'location', e.target.value)} disabled={!r.enabled} />
              </FieldRow>
            </div>
            <FieldRow label="Quote" id={`r-quote-${i}`}>
              <textarea id={`r-quote-${i}`} rows={3} value={r.quote}
                onChange={(e) => updReview(i, 'quote', e.target.value)}
                disabled={!r.enabled}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
            </FieldRow>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addReview}>
        <Plus className="h-4 w-4" /> Add Review
      </Button>
    </div>
  );
}

function GalleryEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const data = draft.homepage.gallery || defaultConfig.homepage.gallery;
  const updEnabled = (v: boolean) => set((p) => ({ ...p, homepage: { ...p.homepage, gallery: { ...(p.homepage.gallery || defaultConfig.homepage.gallery), enabled: v } } }));
  const updItem = (i: number, k: keyof GalleryItem, v: string | boolean) =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      const arr = [...currentGallery.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, items: arr } } };
    });
  const addItem = () =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, items: [...currentGallery.items, { enabled: true, caption: 'New Image', imageUrl: '/images/hero/hero.jpg' }] } } };
    });
  const rmItem = (i: number) =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, items: currentGallery.items.filter((_, idx) => idx !== i) } } };
    });
  const moveItem = (i: number, dir: -1 | 1) =>
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      const target = i + dir;
      if (target < 0 || target >= currentGallery.items.length) return p;
      const arr = [...currentGallery.items];
      const temp = arr[i];
      arr[i] = arr[target];
      arr[target] = temp;
      return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, items: arr } } };
    });

  return (
    <div className="space-y-6">
      <SectionToggle title="Catch Gallery" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, gallery: { ...p.homepage.gallery, backgroundColor: v } } }))} />
      <BackgroundColorPicker 
        label="Indicator Color" 
        desc="Pick a custom color for the carousel indicator dots and buttons." 
        value={data.indicatorColor} 
        onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, gallery: { ...p.homepage.gallery, indicatorColor: v } } }))} 
      />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => {
          const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
          return { ...p, homepage: { ...p.homepage, gallery: { ...currentGallery, [k]: v } } };
        })} 
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Gallery Photos ({data.items.length})</h4>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={addItem}>
            <Plus className="h-3.5 w-3.5" /> Add Image
          </Button>
        </div>

        {data.items.map((img, i) => (
          <div key={i} className="relative rounded-lg border border-border p-5 pt-11 bg-card shadow-xs">
            <div className="absolute top-2.5 left-4 right-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Switch checked={img.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} />
                <span className="text-xs font-semibold text-muted-foreground">
                  Photo #{i + 1} {!img.enabled && '(Hidden)'}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={i === 0}
                  onClick={() => moveItem(i, -1)}
                  title="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={i === data.items.length - 1}
                  onClick={() => moveItem(i, 1)}
                  title="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  onClick={() => rmItem(i)}
                  title="Delete photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: img.enabled ? 1 : 0.5 }}>
              <FieldRow label="Gallery Photo" id={`g-img-${i}`}>
                <ImageUploaderField
                  id={`g-img-${i}`}
                  value={img.imageUrl}
                  onChange={(url) => updItem(i, 'imageUrl', url)}
                  folder="gallery"
                  placeholder="Upload or choose gallery photo..."
                  disabled={!img.enabled}
                />
              </FieldRow>
              <FieldRow label="Caption" id={`g-cap-${i}`}>
                <Input id={`g-cap-${i}`} value={img.caption} onChange={(e) => updItem(i, 'caption', e.target.value)} disabled={!img.enabled} />
              </FieldRow>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyUsEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const data = draft.homepage.whyUs;
  const updEnabled = (v: boolean) => set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, enabled: v } } }));
  const updItem = (i: number, k: keyof WhyUsItem, v: string | boolean) =>
    set((p) => {
      const arr = [...p.homepage.whyUs.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, items: arr } } };
    });
  const addWhyUs = () =>
    set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, items: [...p.homepage.whyUs.items, { enabled: true, title: 'New Feature', icon: 'Star', body: '...' }] } } }));
  const rmWhyUs = (i: number) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, items: p.homepage.whyUs.items.filter((_, idx) => idx !== i) } } }));

  return (
    <div className="space-y-6">
      <SectionToggle title="Why Us" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, backgroundColor: v } } }))} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, [k]: v } } }))} 
      />

      <FieldRow label="Section Image" id="w-section-img">
        <ImageUploaderField
          id="w-section-img"
          value={data.imageUrl ?? ''}
          onChange={(url) => set((p) => ({ ...p, homepage: { ...p.homepage, whyUs: { ...p.homepage.whyUs, imageUrl: url } } }))}
          folder="whyus"
          placeholder="Upload or choose Why Us image..."
          disabled={!data.enabled}
        />
      </FieldRow>
      <Separator />

      {data.items.map((item, i) => (
        <div key={i} className="relative rounded-lg border border-border p-5 pt-10 bg-card">
          <div className="absolute top-2 left-4 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={item.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{item.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => rmWhyUs(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: item.enabled ? 1 : 0.5 }}>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Title" id={`w-title-${i}`}>
                <Input id={`w-title-${i}`} value={item.title} onChange={(e) => updItem(i, 'title', e.target.value)} disabled={!item.enabled} />
              </FieldRow>
              <FieldRow label="Icon (Lucide name)" id={`w-icon-${i}`}>
                <Input id={`w-icon-${i}`} value={item.icon} onChange={(e) => updItem(i, 'icon', e.target.value)}
                  placeholder="e.g. Shield, Globe" disabled={!item.enabled} />
              </FieldRow>
            </div>
            <FieldRow label="Body text" id={`w-body-${i}`}>
              <textarea id={`w-body-${i}`} rows={2} value={item.body}
                onChange={(e) => updItem(i, 'body', e.target.value)}
                disabled={!item.enabled}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
            </FieldRow>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addWhyUs}>
        <Plus className="h-4 w-4" /> Add Feature
      </Button>
    </div>
  );
}

function CTAEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const cta = draft.homepage.ctaBanner;
  const upd = <K extends keyof AppConfig['homepage']['ctaBanner']>(k: K, v: AppConfig['homepage']['ctaBanner'][K]) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, ctaBanner: { ...p.homepage.ctaBanner, [k]: v } } }));

  return (
    <div className="space-y-5">
      <SectionToggle title="CTA Banner" enabled={cta.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={cta.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <FieldRow label="Headline" id="cta-headline">
        <Input id="cta-headline" value={cta.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Subtitle" id="cta-subtitle">
        <textarea id="cta-subtitle" rows={2} value={cta.subtitle}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
      </FieldRow>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Button label" id="cta-label">
          <Input id="cta-label" value={cta.ctaLabel} onChange={(e) => upd('ctaLabel', e.target.value)} />
        </FieldRow>
        <FieldRow label="Button link" id="cta-href">
          <Input id="cta-href" value={cta.ctaHref} onChange={(e) => upd('ctaHref', e.target.value)} />
        </FieldRow>
      </div>
    </div>
  );
}

function LinkListEditor({ title, list, onChange }: { title: string; list: { enabled: boolean; items: FooterLink[] }; onChange: (list: { enabled: boolean; items: FooterLink[] }) => void }) {
  const updEnabled = (v: boolean) => onChange({ ...list, enabled: v });
  const updItem = (i: number, k: keyof FooterLink, v: string | boolean) => {
    const newItems = [...list.items];
    newItems[i] = { ...newItems[i], [k]: v };
    onChange({ ...list, items: newItems });
  };
  const addItem = () => onChange({ ...list, items: [...list.items, { enabled: true, label: 'New Link', href: '#' }] });
  const rmItem = (i: number) => onChange({ ...list, items: list.items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <div className="flex items-center gap-2 mb-2">
        <Switch checked={list.enabled} onCheckedChange={updEnabled} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="space-y-3 opacity-100 transition-opacity" style={{ opacity: list.enabled ? 1 : 0.5 }}>
        {list.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center relative pr-8">
            <Switch checked={item.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} className="scale-75 origin-left" />
            <Input className="h-8 text-xs" value={item.label} onChange={e => updItem(i, 'label', e.target.value)} disabled={!item.enabled} placeholder="Label" />
            <Input className="h-8 text-xs" value={item.href} onChange={e => updItem(i, 'href', e.target.value)} disabled={!item.enabled} placeholder="URL" />
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive absolute right-0" onClick={() => rmItem(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8" onClick={addItem} disabled={!list.enabled}>
          <Plus className="h-3 w-3" /> Add Link
        </Button>
      </div>
    </div>
  );
}

function SocialListEditor({ title, list, onChange }: { title: string; list: { enabled: boolean; items: SocialLink[] }; onChange: (list: { enabled: boolean; items: SocialLink[] }) => void }) {
  const updEnabled = (v: boolean) => onChange({ ...list, enabled: v });
  const updItem = (i: number, k: keyof SocialLink, v: string | boolean) => {
    const newItems = [...list.items];
    newItems[i] = { ...newItems[i], [k]: v };
    onChange({ ...list, items: newItems });
  };
  const addItem = () => onChange({ ...list, items: [...list.items, { enabled: true, icon: 'Facebook', url: '#' }] });
  const rmItem = (i: number) => onChange({ ...list, items: list.items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <div className="flex items-center gap-2 mb-2">
        <Switch checked={list.enabled} onCheckedChange={updEnabled} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="space-y-3 opacity-100 transition-opacity" style={{ opacity: list.enabled ? 1 : 0.5 }}>
        {list.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center relative pr-8">
            <Switch checked={item.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} className="scale-75 origin-left" />
            <Input className="h-8 text-xs w-32" value={item.icon} onChange={e => updItem(i, 'icon', e.target.value)} disabled={!item.enabled} placeholder="Icon (Lucide)" />
            <Input className="h-8 text-xs" value={item.url} onChange={e => updItem(i, 'url', e.target.value)} disabled={!item.enabled} placeholder="URL" />
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive absolute right-0" onClick={() => rmItem(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8" onClick={addItem} disabled={!list.enabled}>
          <Plus className="h-3 w-3" /> Add Social
        </Button>
      </div>
    </div>
  );
}

function FooterEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const f = draft.homepage.footer;
  const upd = <K extends keyof AppConfig['homepage']['footer']>(k: K, v: AppConfig['homepage']['footer'][K]) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, footer: { ...p.homepage.footer, [k]: v } } }));

  return (
    <div className="space-y-6">
      <SectionToggle title="Footer" enabled={f.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={f.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <FieldRow label="Description (under logo)" id="f-desc">
        <textarea id="f-desc" rows={3} value={f.description}
          onChange={(e) => upd('description', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
      </FieldRow>
      
      <Separator />
      <h4 className="text-sm font-semibold">Contact Details</h4>
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Location" id="f-contact-loc">
          <Input id="f-contact-loc" value={f.contact.location} onChange={(e) => upd('contact', { ...f.contact, location: e.target.value })} />
        </FieldRow>
        <FieldRow label="Phone" id="f-contact-phone">
          <Input id="f-contact-phone" value={f.contact.phone} onChange={(e) => upd('contact', { ...f.contact, phone: e.target.value })} />
        </FieldRow>
        <FieldRow label="Email" id="f-contact-email">
          <Input id="f-contact-email" value={f.contact.email} onChange={(e) => upd('contact', { ...f.contact, email: e.target.value })} />
        </FieldRow>
        <FieldRow label="Working Days" id="f-contact-days">
          <Input id="f-contact-days" value={f.contact.workingDays} onChange={(e) => upd('contact', { ...f.contact, workingDays: e.target.value })} />
        </FieldRow>
        <FieldRow label="Working Hours" id="f-contact-hrs">
          <Input id="f-contact-hrs" value={f.contact.workingHours} onChange={(e) => upd('contact', { ...f.contact, workingHours: e.target.value })} />
        </FieldRow>
      </div>
      
      <Separator />
      <h4 className="text-sm font-semibold mb-4">Link Sections</h4>
      <div className="space-y-6">
        <LinkListEditor title="Quick Links" list={f.quickLinks} onChange={v => upd('quickLinks', v)} />
        <LinkListEditor title="Top Packages" list={f.topPackages} onChange={v => upd('topPackages', v)} />
        <LinkListEditor title="Bottom Links" list={f.bottomLinks} onChange={v => upd('bottomLinks', v)} />
        <SocialListEditor title="Socials" list={f.socials} onChange={v => upd('socials', v)} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminConfigPage() {
  const { config, updateConfig } = useAppConfig();
  const [draft, setDraft] = useState<AppConfig>(config);
  const [active, setActive] = useState<SectionKey>('branding');
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Live preview
  useEffect(() => { updateConfig(draft); }, [draft, updateConfig]);

  const handleSave = async () => {
    setSaving(true);
    
    // Clean up empty options in select fields before saving
    const cleanedDraft = JSON.parse(JSON.stringify(draft)) as AppConfig;
    
    if (cleanedDraft.toursPage?.bookingForm?.fields) {
      cleanedDraft.toursPage.bookingForm.fields.forEach(f => {
        if (f.type === 'select' && f.options) {
          f.options = f.options.map(o => o.trim()).filter(Boolean);
        }
      });
    }
    
    if (cleanedDraft.contactPage?.form?.fields) {
      cleanedDraft.contactPage.form.fields.forEach(f => {
        if (f.type === 'select' && f.options) {
          f.options = f.options.map(o => o.trim()).filter(Boolean);
        }
      });
    }

    await saveAppConfig(cleanedDraft);
    setDraft(cleanedDraft); // Update UI to reflect cleaned state
    updateConfig(cleanedDraft); // Update context to reflect cleaned state
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setDraft(defaultConfig);
  };

  const currentSectionInfo =
    APP_SETTINGS.find((s) => s.key === active) ||
    PAGES.flatMap((p) => p.sections).find((s) => s.key === active);

  const editorProps = { draft, set: setDraft };

  const handleSectionClick = (key: string) => {
    setActive(key as SectionKey);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-full gap-0">
      {/* ── Left sidebar ────────────────────────────────────────────────── */}
      <aside className={`${isSidebarOpen ? 'w-full md:w-64 flex' : 'hidden'} shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex-col h-full transition-all duration-300 relative`}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSidebarOpen(false)} 
          className="absolute right-2 top-3 h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
        <div className="px-4 py-5 border-b border-border pr-12">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Configuration</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Changes apply live as you type.</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* App Settings */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
              Global Settings
            </p>
            <div className="space-y-0.5">
              {APP_SETTINGS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => handleSectionClick(key)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left ${
                    active === key
                      ? 'text-white'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  style={active === key ? { backgroundColor: config.branding.primaryColor } : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
              Pages & Routing
            </p>
            <div className="space-y-2">
              {PAGES.map((page) => {
                const isExpanded = expandedPages[page.id];
                const navItem = (draft.navigation || defaultConfig.navigation).find((n) => n.key === page.id);
                const pageLabel = navItem?.label || page.label;

                return (
                  <div key={page.id} className="space-y-1">
                    <div className="flex items-center gap-1 group">
                      <button
                        onClick={() => setExpandedPages((prev) => ({ ...prev, [page.id]: !prev[page.id] }))}
                        className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-accent hover:bg-accent/80 transition-colors"
                      >
                        <page.Icon className="h-4 w-4 shrink-0" style={{ color: config.branding.primaryColor }} />
                        <span className="flex-1 text-left">{pageLabel}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <Link
                        href={page.href}
                        target="_blank"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        title="Preview page in new tab"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {isExpanded && (
                      <div className="ml-4 pl-3 border-l border-border space-y-0.5">
                        {(() => {
                          if (page.id !== 'home') {
                            return page.sections.map(({ key, label, Icon }) => (
                              <button
                                key={key}
                                onClick={() => handleSectionClick(key)}
                                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left ${
                                  active === key
                                    ? 'text-foreground font-semibold bg-accent/50'
                                    : 'text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground'
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" style={active === key ? { color: config.branding.primaryColor } : undefined} />
                                {label}
                              </button>
                            ));
                          }

                          const heroSec = page.sections.find(s => s.key === 'hero');
                          const footerSec = page.sections.find(s => s.key === 'footer');
                          const defaultOrder = ['stats', 'tours', 'whyus', 'reviews', 'gallery', 'cta'];
                          const order = [...(draft.homepage.sectionOrder || defaultOrder)];
                          if (!order.includes('gallery')) {
                            const reviewsIdx = order.indexOf('reviews');
                            if (reviewsIdx !== -1) order.splice(reviewsIdx + 1, 0, 'gallery');
                            else order.push('gallery');
                          }
                          
                          const middleSecs = order
                            .map(k => page.sections.find(s => s.key === k))
                            .filter(Boolean) as typeof page.sections;
                            
                          const allOrdered = [];
                          if (heroSec) allOrdered.push(heroSec);
                          allOrdered.push(...middleSecs);
                          if (footerSec) allOrdered.push(footerSec);
                          
                          return allOrdered.map(({ key, label, Icon }) => {
                            const isMiddle = key !== 'hero' && key !== 'footer';
                            return (
                              <button
                                key={key}
                                draggable={isMiddle}
                                onDragStart={(e) => {
                                  if (!isMiddle) return;
                                  setDraggedItem(key);
                                  e.dataTransfer.effectAllowed = "move";
                                  e.currentTarget.classList.add('opacity-50');
                                }}
                                onDragEnd={(e) => {
                                  setDraggedItem(null);
                                  e.currentTarget.classList.remove('opacity-50');
                                }}
                                onDragOver={(e) => {
                                  if (!isMiddle) return;
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                }}
                                onDrop={(e) => {
                                  if (!isMiddle) return;
                                  e.preventDefault();
                                  if (draggedItem && draggedItem !== key) {
                                    const oldIdx = order.indexOf(draggedItem);
                                    const newIdx = order.indexOf(key);
                                    if (oldIdx !== -1 && newIdx !== -1) {
                                      const newOrder = [...order];
                                      newOrder.splice(oldIdx, 1);
                                      newOrder.splice(newIdx, 0, draggedItem);
                                      setDraft(p => ({ ...p, homepage: { ...p.homepage, sectionOrder: newOrder } }));
                                    }
                                  }
                                }}
                                onClick={() => handleSectionClick(key)}
                                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors text-left ${isMiddle ? 'cursor-grab active:cursor-grabbing hover:bg-accent/80' : ''} ${
                                  active === key
                                    ? 'text-foreground font-semibold bg-accent/50'
                                    : 'text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground'
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" style={active === key ? { color: config.branding.primaryColor } : undefined} />
                                {label}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="border-t border-border p-3 space-y-2">
          <Button
            id="save-config-btn"
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-1 text-white text-sm"
            style={{ backgroundColor: config.branding.primaryColor }}
          >
            {saved ? <><CheckCircle className="h-4 w-4" /> Saved</> : saving ? 'Saving…' : 'Save Changes'}
          </Button>
          <Button
            id="reset-config-btn"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="w-full gap-1 text-muted-foreground text-xs"
          >
            <RotateCcw className="h-3 w-3" /> Reset to defaults
          </Button>
        </div>
      </aside>

      {/* ── Editor area ─────────────────────────────────────────────────── */}
      <div className={`flex-1 overflow-y-auto relative ${isSidebarOpen ? 'hidden md:block' : 'block'}`}>
        {!isSidebarOpen && mounted && typeof document !== 'undefined' && document.getElementById('admin-mobile-menu-portal') && createPortal(
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Open Sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>,
          document.getElementById('admin-mobile-menu-portal')!
        )}
        <Card className="m-3 md:m-6 shadow-none border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              {currentSectionInfo?.Icon && <currentSectionInfo.Icon className="h-4 w-4" style={{ color: config.branding.primaryColor }} />}
              {currentSectionInfo?.label}
            </CardTitle>
            <CardDescription>{currentSectionInfo?.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {active === 'branding' && <BrandingEditor {...editorProps} />}
            {active === 'navigation' && <NavigationEditor {...editorProps} />}
            {active === 'hero'     && <HeroEditor {...editorProps} />}
            {active === 'stats'    && <StatsEditor {...editorProps} />}
            {active === 'tours'    && <ToursEditor {...editorProps} />}
            {active === 'reviews'  && <ReviewsEditor {...editorProps} />}
            {active === 'gallery'  && <GalleryEditor {...editorProps} />}
            {active === 'whyus'    && <WhyUsEditor {...editorProps} />}
            {active === 'cta'      && <CTAEditor {...editorProps} />}
            {active === 'footer'   && <FooterEditor {...editorProps} />}
            {active === 'tours-page-hero' && <ToursPageHeroEditor {...editorProps} />}
            {active === 'tours-page-list' && <ToursPageListEditor {...editorProps} />}
            {active === 'tours-page-booking' && <ToursBookingFormEditor {...editorProps} />}
            {active === 'about-hero'      && <AboutHeroEditor {...editorProps} />}
            {active === 'about-story'     && <AboutStoryEditor {...editorProps} />}
            {active === 'about-values'    && <AboutValuesEditor {...editorProps} />}
            {active === 'about-team'      && <AboutTeamEditor {...editorProps} />}
            {active === 'about-impact'    && <AboutImpactEditor {...editorProps} />}
            {active === 'about-cta'       && <AboutCTAEditor {...editorProps} />}
            {active === 'contact-hero'    && <ContactHeroEditor {...editorProps} />}
            {active === 'contact-details' && <ContactEditor {...editorProps} />}
            {active === 'contact-faq'     && <FAQEditor {...editorProps} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Tours Page Editors ─────────────────────────────────────────────────────
function ToursPageHeroEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const h = draft.toursPage?.hero || defaultConfig.toursPage?.hero || defaultConfig.contactPage.hero;
  const upd = <K extends keyof AppConfig['homepage']['hero']>(k: K, v: AppConfig['homepage']['hero'][K]) =>
    set((p) => {
      const current = p.toursPage || defaultConfig.toursPage!;
      return { ...p, toursPage: { ...current, hero: { ...current.hero, [k]: v } } };
    });

  return (
    <div className="space-y-5">
      <SectionToggle title="Fishing Charters Hero Section" enabled={h.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={h.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showEyebrow} onCheckedChange={(v) => upd('showEyebrow', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Eyebrow text" id="tph-eyebrow">
            <Input id="tph-eyebrow" value={h.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} disabled={!h.showEyebrow} />
          </FieldRow>
        </div>
      </div>
      <Separator />
      
      <FieldRow label="Headline" id="tph-headline">
        <Input id="tph-headline" value={h.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Italic / highlight text" id="tph-italic">
        <Input id="tph-italic" value={h.italicText} onChange={(e) => upd('italicText', e.target.value)} />
      </FieldRow>
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showSubtitle} onCheckedChange={(v) => upd('showSubtitle', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Subtitle" id="tph-subtitle">
            <textarea id="tph-subtitle" rows={3} value={h.subtitle}
              onChange={(e) => upd('subtitle', e.target.value)}
              disabled={!h.showSubtitle}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
          </FieldRow>
        </div>
      </div>
      
      <Separator />
      <FieldRow label="Background image" id="tph-image">
        <ImageUploaderField
          id="tph-image"
          value={h.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="hero"
          placeholder="Upload or choose hero background..."
        />
      </FieldRow>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3 pt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Fishing Charters Page SEO & Meta</h4>
        <FieldRow label="Meta Title" id="tp-meta-title">
          <Input
            id="tp-meta-title"
            value={draft.toursPage?.metaTitle || ''}
            placeholder="e.g. Fishing Charters & Packages"
            onChange={(e) =>
              set((p) => {
                const current = p.toursPage || defaultConfig.toursPage!;
                return { ...p, toursPage: { ...current, metaTitle: e.target.value } };
              })
            }
          />
        </FieldRow>
        <FieldRow label="Meta Description" id="tp-meta-desc">
          <textarea
            id="tp-meta-desc"
            rows={2}
            value={draft.toursPage?.metaDescription || ''}
            placeholder="e.g. Explore our fleet of sportfishing charter packages in Watamu..."
            onChange={(e) =>
              set((p) => {
                const current = p.toursPage || defaultConfig.toursPage!;
                return { ...p, toursPage: { ...current, metaDescription: e.target.value } };
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </FieldRow>
      </div>
    </div>
  );
}

function ToursPageListEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const currentToursPage = draft.toursPage || defaultConfig.toursPage!;
  const data = currentToursPage.tours;
  const [deletePrompt, setDeletePrompt] = useState<{ type: 'soft' | 'permanent'; tour: TourItem; index: number } | null>(null);

  const homeLabel = PAGES.find((p) => p.id === 'home')?.label || 'Home';
  const homeToursSectionLabel = PAGES.find((p) => p.id === 'home')?.sections.find((s) => s.key === 'tours')?.label || draft.homepage?.tours?.title || 'Featured Tours';

  const updEnabled = (v: boolean) => set((p) => {
    const current = p.toursPage || defaultConfig.toursPage!;
    return { ...p, toursPage: { ...current, tours: { ...current.tours, enabled: v } } };
  });

  const VISIBILITY_KEYS = new Set([
    'enabled',
    'showTitle',
    'showBadge',
    'showDuration',
    'showRating',
    'showPrice',
    'showLocation',
    'showSchedule',
    'showGroupType',
    'showIncluded',
    'showNotIncluded',
    'showWhyChoose',
    'showKnowBeforeYouGo',
  ]);

  const updTour = (i: number, k: keyof TourItem, v: string | number | boolean | string[]) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const currentItem = tpItems[i];
      if (!currentItem) return p;

      tpItems[i] = { ...currentItem, [k]: v };

      if (!VISIBILITY_KEYS.has(k)) {
        const hpIdx = hpItems.findIndex((t, idx) => isTourMatch(t, currentItem, idx, i));
        if (hpIdx !== -1) {
          hpItems[hpIdx] = { ...hpItems[hpIdx], [k]: v };
        } else if (hpItems[i]) {
          hpItems[i] = { ...hpItems[i], [k]: v };
        }
      }

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems } },
      };
    });

  const softDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const markSoftDeleted = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: true, enabled: false, deletedAt: new Date().toISOString() }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markSoftDeleted) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.map(markSoftDeleted) } },
      };
    });

  const restoreTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const markRestored = (t: TourItem, idx: number) =>
        isTourMatch(t, targetTour, idx, targetIndex)
          ? { ...t, deleted: false, enabled: true, deletedAt: undefined }
          : t;

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.map(markRestored) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.map(markRestored) } },
      };
    });

  const permanentDeleteTour = (targetTour: TourItem, targetIndex: number) =>
    set((p) => {
      const currentToursPage = p.toursPage || defaultConfig.toursPage!;
      const hpItems = [...(p.homepage?.tours?.items || [])];
      const tpItems = [...(currentToursPage.tours?.items || [])];

      const notTarget = (t: TourItem, idx: number) => !isTourMatch(t, targetTour, idx, targetIndex);

      return {
        ...p,
        homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: hpItems.filter(notTarget) } },
        toursPage: { ...currentToursPage, tours: { ...currentToursPage.tours, items: tpItems.filter(notTarget) } },
      };
    });

  const moveTour = (i: number, dir: -1 | 1) =>
    set((p) => {
      const current = p.toursPage || defaultConfig.toursPage!;
      const tpItems = [...(current.tours?.items || [])];
      const target = i + dir;
      if (target < 0 || target >= tpItems.length) return p;

      const tempTp = tpItems[i];
      tpItems[i] = tpItems[target];
      tpItems[target] = tempTp;

      return {
        ...p,
        toursPage: {
          ...current,
          tours: {
            ...current.tours,
            items: tpItems,
          },
        },
      };
    });

  return (
    <div className="space-y-6">
      {deletePrompt && (
        <TourDeleteConfirmDialog
          isOpen={true}
          type={deletePrompt.type}
          tourTitle={deletePrompt.tour.title}
          onConfirm={() => {
            if (deletePrompt.type === 'soft') {
              softDeleteTour(deletePrompt.tour, deletePrompt.index);
            } else {
              permanentDeleteTour(deletePrompt.tour, deletePrompt.index);
            }
            setDeletePrompt(null);
          }}
          onCancel={() => setDeletePrompt(null)}
        />
      )}

      <SectionToggle title="Charters Listing Section" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => {
        const current = p.toursPage || defaultConfig.toursPage!;
        return { ...p, toursPage: { ...current, tours: { ...current.tours, backgroundColor: v } } };
      })} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => {
          const current = p.toursPage || defaultConfig.toursPage!;
          return { ...p, toursPage: { ...current, tours: { ...current.tours, [k]: v } } };
        })} 
      />

      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Charter Card Attributes Managed in {homeToursSectionLabel}</p>
          <p>
            Card titles, pricing, ratings, badges, and cover thumbnails are edited under <strong>{homeLabel} &rarr; {homeToursSectionLabel}</strong>. Below, expand each charter to configure its full single-page details (overview, inclusions, itinerary, hero banner, and photo carousel).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Charter Packages ({data.items.length})</h4>
        </div>

        {data.items.map((t, i) => {
          const isDeleted = Boolean(t.deleted);
          return (
            <div
              key={t.id || `tpl-${i}`}
              className={`relative rounded-lg border p-5 pt-11 transition-all ${
                isDeleted
                  ? 'border-dashed border-destructive/40 bg-muted/30 opacity-60'
                  : 'border-border bg-card shadow-xs'
              }`}
            >
              <div className="absolute top-2.5 left-4 right-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {!isDeleted ? (
                    <>
                      <Switch checked={t.enabled} onCheckedChange={(v) => updTour(i, 'enabled', v)} />
                      <span className="text-xs font-semibold text-muted-foreground">
                        Charter #{i + 1} {!t.enabled && '(Hidden)'}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Card info read-only
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                      <Trash2 className="h-3 w-3" /> Inactive / Soft-Deleted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {!isDeleted ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === 0}
                        onClick={() => moveTour(i, -1)}
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === data.items.length - 1}
                        onClick={() => moveTour(i, 1)}
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletePrompt({ type: 'soft', tour: t, index: i })}
                        title="Soft delete charter (move to inactive)"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => restoreTour(t, i)}
                        title="Restore charter"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setDeletePrompt({ type: 'permanent', tour: t, index: i })}
                        title="Permanently delete charter"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Forever
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: isDeleted ? 0.6 : t.enabled ? 1 : 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showTitle !== false}
                      onCheckedChange={(v) => updTour(i, 'showTitle', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Title On/Off on Listing Page"
                    />
                    <div className="flex-1">
                      <FieldRow label="Title" id={`tp-title-${i}`}>
                        <Input id={`tp-title-${i}`} value={t.title} disabled={true} className={`bg-muted/40 cursor-not-allowed ${isDeleted ? 'line-through text-muted-foreground' : ''}`} />
                      </FieldRow>
                    </div>
                  </div>

                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showBadge !== false}
                    onCheckedChange={(v) => updTour(i, 'showBadge', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle Badge On/Off on Listing Page"
                  />
                  <div className="flex-1">
                    <FieldRow label="Badge" id={`tp-badge-${i}`}>
                      <Input id={`tp-badge-${i}`} value={t.badge} disabled={true} className="bg-muted/40 cursor-not-allowed" />
                    </FieldRow>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showDuration !== false}
                    onCheckedChange={(v) => updTour(i, 'showDuration', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle Duration On/Off on Listing Page"
                  />
                  <div className="flex-1">
                    <FieldRow label="Duration" id={`tp-dur-${i}`}>
                      <Input id={`tp-dur-${i}`} value={t.duration} disabled={true} className="bg-muted/40 cursor-not-allowed" />
                    </FieldRow>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showRating !== false}
                    onCheckedChange={(v) => updTour(i, 'showRating', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle Rating On/Off on Listing Page"
                  />
                  <div className="flex-1">
                    <FieldRow label="Rating (0–5)" id={`tp-rating-${i}`}>
                      <Input id={`tp-rating-${i}`} type="number" min={0} max={5} step={0.1}
                        value={t.rating} disabled={true} className="bg-muted/40 cursor-not-allowed" />
                    </FieldRow>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showPrice !== false}
                    onCheckedChange={(v) => updTour(i, 'showPrice', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle Pricing On/Off on Listing Page"
                  />
                  <div className="flex-1">
                    <FieldRow label="Price Text" id={`tp-price-${i}`}>
                      <Input id={`tp-price-${i}`} value={t.price || ''} placeholder="Contact for pricing" disabled={true} className="bg-muted/40 cursor-not-allowed" />
                    </FieldRow>
                  </div>
                </div>

                <FieldRow label="Custom URL" id={`tp-href-${i}`}>
                  <Input id={`tp-href-${i}`} value={t.href || ''} placeholder="/tours/..." disabled={true} className="bg-muted/40 cursor-not-allowed" />
                </FieldRow>
              </div>
            <FieldRow label="Charter Card & Gallery Main Image" id={`tp-img-${i}`}>
              <ImageUploaderField
                id={`tp-img-${i}`}
                value={t.imageUrl}
                onChange={(url) => updTour(i, 'imageUrl', url)}
                folder="tours"
                placeholder="Cover photo..."
                disabled={true}
              />
            </FieldRow>
            <FieldRow label="Card Short Description" id={`tp-desc-${i}`}>
              <textarea id={`tp-desc-${i}`} rows={2} value={t.description}
                disabled={true}
                className="w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-sm shadow-sm resize-none disabled:opacity-75 cursor-not-allowed" />
            </FieldRow>

            {/* Single Tour Page Details Accordion */}
            <details open={!isDeleted} className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-4">
              <summary className="cursor-pointer text-xs font-semibold text-foreground flex items-center justify-between select-none">
                <span className="flex items-center gap-1.5 text-primary font-bold">
                  <Ship className="h-3.5 w-3.5" /> Single Charter Page Details (Overview, Included, Location, Info, Carousel)
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">▼ Collapse / Expand</span>
              </summary>
              
              <div className="space-y-4 pt-3 border-t border-border/60">
                {/* Hero Background & Carousel Photos */}
                <div className="rounded-lg border border-border p-4 bg-background space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Single Charter Hero & Carousel Photos</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Configure the hero background color, backdrop image, and the interactive photo carousel for this single charter detail page.
                    </p>
                  </div>

                  <BackgroundColorPicker
                    label="Hero Background Color"
                    desc="Custom hero background color when no hero image is set or behind the overlay."
                    value={t.heroBackgroundColor || '#193da9'}
                    onChange={(v) => updTour(i, 'heroBackgroundColor', v)}
                  />

                  <FieldRow label="Hero Background Image (Behind Title)" id={`tp-hero-img-${i}`}>
                    <ImageUploaderField
                      id={`tp-hero-img-${i}`}
                      value={t.heroImageUrl || ''}
                      onChange={(url) => updTour(i, 'heroImageUrl', url)}
                      folder="hero"
                      placeholder="Select hero background image (Optional)..."
                      disabled={!t.enabled || isDeleted}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Optional hero backdrop image with dark ambient gradient overlay.</p>
                  </FieldRow>

                  <BackgroundColorPicker
                    label="Carousel Indicator Color"
                    desc="Pick a custom color for the active carousel dot indicators."
                    value={t.indicatorColor || '#f6ab03'}
                    onChange={(v) => updTour(i, 'indicatorColor', v)}
                  />

                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Carousel Photos (Like Catch Gallery)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                          const currentGallery = t.gallery && t.gallery.length > 0 ? t.gallery : [baseImg, baseImg, baseImg];
                          updTour(i, 'gallery', [...currentGallery, '/images/hero/hero.jpg']);
                        }}
                        disabled={!t.enabled || isDeleted}
                        className="gap-1.5 h-7 text-xs"
                      >
                        <Plus className="h-3 w-3" /> Add Carousel Photo
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {(t.gallery && t.gallery.length > 0 ? t.gallery : [t.imageUrl || '/images/hero/hero.jpg', t.imageUrl || '/images/hero/hero.jpg', t.imageUrl || '/images/hero/hero.jpg']).map((imgUrl, gIdx) => {
                        const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                        const currentGallery = t.gallery && t.gallery.length > 0 ? t.gallery : [baseImg, baseImg, baseImg];
                        const updGalleryImg = (newUrl: string) => {
                          const updated = [...currentGallery];
                          updated[gIdx] = newUrl;
                          updTour(i, 'gallery', updated);
                        };
                        const removeGalleryImg = () => {
                          const updated = currentGallery.filter((_, idx) => idx !== gIdx);
                          const baseImg = t.imageUrl || '/images/hero/hero.jpg';
                          updTour(i, 'gallery', updated.length > 0 ? updated : [baseImg, baseImg, baseImg]);
                        };
                        const moveGalleryImg = (dir: 'up' | 'down') => {
                          const target = dir === 'up' ? gIdx - 1 : gIdx + 1;
                          if (target < 0 || target >= currentGallery.length) return;
                          const updated = [...currentGallery];
                          const temp = updated[gIdx];
                          updated[gIdx] = updated[target];
                          updated[target] = temp;
                          updTour(i, 'gallery', updated);
                        };

                        return (
                          <div key={gIdx} className="flex items-center gap-2 rounded-lg border border-border p-2.5 bg-card shadow-xs">
                            <span className="text-xs font-mono font-medium text-muted-foreground w-6 text-center">{gIdx + 1}</span>
                            <div className="flex-1">
                              <ImageUploaderField
                                id={`tp-gal-${i}-${gIdx}`}
                                value={imgUrl}
                                onChange={updGalleryImg}
                                folder="tours"
                                placeholder="Choose carousel photo..."
                                disabled={!t.enabled || isDeleted}
                              />
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={gIdx === 0 || !t.enabled || isDeleted}
                                onClick={() => moveGalleryImg('up')}
                                title="Move up"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={gIdx === currentGallery.length - 1 || !t.enabled || isDeleted}
                                onClick={() => moveGalleryImg('down')}
                                title="Move down"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                disabled={!t.enabled || currentGallery.length <= 1 || isDeleted}
                                onClick={removeGalleryImg}
                                title="Delete photo"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showLocation !== false}
                      onCheckedChange={(v) => updTour(i, 'showLocation', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Location Strip Text On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Location Strip Text" id={`tp-loc-${i}`}>
                        <Input
                          id={`tp-loc-${i}`}
                          value={t.location || ''}
                          placeholder="e.g. Watamu Marine Park, Kilifi County"
                          onChange={(e) => updTour(i, 'location', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showLocation === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showSchedule !== false}
                      onCheckedChange={(v) => updTour(i, 'showSchedule', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Schedule Strip Text On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Schedule / Season Text" id={`tp-sched-${i}`}>
                        <Input
                          id={`tp-sched-${i}`}
                          value={t.schedule || ''}
                          placeholder="e.g. Morning Slots (November To March)"
                          onChange={(e) => updTour(i, 'schedule', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showSchedule === false}
                        />
                      </FieldRow>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Switch
                      checked={t.showGroupType !== false}
                      onCheckedChange={(v) => updTour(i, 'showGroupType', v)}
                      disabled={!t.enabled || isDeleted}
                      className="mt-8"
                      title="Toggle Group Suitability Text On/Off"
                    />
                    <div className="flex-1">
                      <FieldRow label="Group Suitability Text" id={`tp-grp-${i}`}>
                        <Input
                          id={`tp-grp-${i}`}
                          value={t.groupType || ''}
                          placeholder="e.g. Families · Private · Groups"
                          onChange={(e) => updTour(i, 'groupType', e.target.value)}
                          disabled={!t.enabled || isDeleted || t.showGroupType === false}
                        />
                      </FieldRow>
                    </div>
                  </div>
                </div>

                <FieldRow label="Full Tour Overview (Main Article)" id={`tp-over-${i}`}>
                  <textarea
                    id={`tp-over-${i}`}
                    rows={3}
                    value={t.overview || ''}
                    placeholder="Full detailed narrative description for the single tour page..."
                    onChange={(e) => updTour(i, 'overview', e.target.value)}
                    disabled={!t.enabled || isDeleted}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                  />
                </FieldRow>

                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showIncluded !== false}
                    onCheckedChange={(v) => updTour(i, 'showIncluded', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle What's Included On/Off"
                  />
                  <div className="flex-1">
                    <FieldRow label="What's Included (1 item per line)" id={`tp-inc-${i}`}>
                      <textarea
                        id={`tp-inc-${i}`}
                        rows={3}
                        value={(t.included || []).join('\n')}
                        placeholder="Heavy tackle Penn & Shimano rods&#10;Live bait & lures&#10;Marine park entry permits&#10;Seafood lunch & drinks"
                        onChange={(e) =>
                          updTour(
                            i,
                            'included',
                            e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        disabled={!t.enabled || isDeleted || t.showIncluded === false}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                      />
                    </FieldRow>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showNotIncluded !== false}
                    onCheckedChange={(v) => updTour(i, 'showNotIncluded', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle What's Not Included On/Off"
                  />
                  <div className="flex-1">
                    <FieldRow label="What's Not Included (1 item per line)" id={`tp-notinc-${i}`}>
                      <textarea
                        id={`tp-notinc-${i}`}
                        rows={3}
                        value={(t.notIncluded || []).join('\n')}
                        placeholder="Crew gratuities and tips (optional)&#10;Hotel pickup & return transfers&#10;Personal swimwear & towels&#10;Alcoholic beverages"
                        onChange={(e) =>
                          updTour(
                            i,
                            'notIncluded',
                            e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        disabled={!t.enabled || isDeleted || t.showNotIncluded === false}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                      />
                    </FieldRow>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showWhyChoose !== false}
                    onCheckedChange={(v) => updTour(i, 'showWhyChoose', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle Why Choose This Tour On/Off"
                  />
                  <div className="flex-1">
                    <FieldRow label="Why Choose This Tour (1 item per line)" id={`tp-why-${i}`}>
                      <textarea
                        id={`tp-why-${i}`}
                        rows={3}
                        value={(t.whyChoose || []).join('\n')}
                        placeholder="Twin-engine sportfisher with fighting chair&#10;IGFA certified captain with 20+ years experience&#10;Strict billfish conservation policy"
                        onChange={(e) =>
                          updTour(
                            i,
                            'whyChoose',
                            e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        disabled={!t.enabled || isDeleted || t.showWhyChoose === false}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                      />
                    </FieldRow>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Switch
                    checked={t.showKnowBeforeYouGo !== false}
                    onCheckedChange={(v) => updTour(i, 'showKnowBeforeYouGo', v)}
                    disabled={!t.enabled || isDeleted}
                    className="mt-8"
                    title="Toggle Know Before You Go On/Off"
                  />
                  <div className="flex-1">
                    <FieldRow label="Know Before You Go (1 item per line)" id={`tp-know-${i}`}>
                      <textarea
                        id={`tp-know-${i}`}
                        rows={3}
                        value={(t.knowBeforeYouGo || []).join('\n')}
                        placeholder="Departure: 6:00 AM from Watamu Marine Park Gate&#10;Duration: Approx. 8 hours&#10;What to bring: Polarized sunglasses, reef-safe sunscreen"
                        onChange={(e) =>
                          updTour(
                            i,
                            'knowBeforeYouGo',
                            e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        disabled={!t.enabled || isDeleted || t.showKnowBeforeYouGo === false}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono"
                      />
                    </FieldRow>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Single Charter SEO & Meta
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Meta Title (Optional)" id={`tp-mtitle-${i}`}>
                      <Input
                        id={`tp-mtitle-${i}`}
                        value={t.metaTitle || ''}
                        placeholder={t.title ? `${t.title} | Sea Smoke Fishing Club` : 'e.g. Marlin Safari | Sea Smoke'}
                        onChange={(e) => updTour(i, 'metaTitle', e.target.value)}
                        disabled={!t.enabled || isDeleted}
                      />
                    </FieldRow>
                    <FieldRow label="Meta Description (Optional)" id={`tp-mdesc-${i}`}>
                      <textarea
                        id={`tp-mdesc-${i}`}
                        rows={2}
                        value={t.metaDescription || ''}
                        placeholder="Overrides default meta description for this single charter page..."
                        onChange={(e) => updTour(i, 'metaDescription', e.target.value)}
                        disabled={!t.enabled || isDeleted}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                      />
                    </FieldRow>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      );
    })}
    </div>
  </div>
);
}

function ToursBookingFormEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const f = draft.toursPage?.bookingForm || defaultConfig.toursPage?.bookingForm || {
    enabled: true,
    title: 'Book This Charter',
    subtitle: 'Reserve your private expedition on the water.',
    buttonText: 'Submit Reservation',
    accessKey: '',
    fields: defaultConfig.toursPage!.bookingForm!.fields || [],
  };

  const fields: DynamicFormField[] = f.fields || defaultConfig.toursPage!.bookingForm!.fields || [];

  const updF = <K extends keyof TourBookingFormConfig>(k: K, v: TourBookingFormConfig[K]) =>
    set((p) => {
      const current = p.toursPage || defaultConfig.toursPage!;
      return {
        ...p,
        toursPage: {
          ...current,
          bookingForm: {
            ...(current.bookingForm || defaultConfig.toursPage?.bookingForm || {}),
            [k]: v,
          },
        },
      };
    });

  const updField = (index: number, key: keyof DynamicFormField, val: unknown) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: val };
    updF('fields', updated);
  };

  const addField = () => {
    const newField: DynamicFormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter details...',
      required: false,
      halfWidth: false,
      enabled: true,
    };
    updF('fields', [...fields, newField]);
  };

  const addFieldWithType = (type: FormFieldType, label = 'New Field') => {
    const newField: DynamicFormField = {
      id: `field_${Date.now()}`,
      label,
      type,
      placeholder: type === 'select' || type === 'checkbox' ? '' : 'Enter details...',
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
      required: false,
      halfWidth: type === 'date' || type === 'time' || type === 'text' || type === 'tel',
      enabled: true,
    };
    updF('fields', [...fields, newField]);
  };

  const removeField = (index: number) => {
    updF('fields', fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const reordered = [...fields];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    updF('fields', reordered);
  };

  return (
    <div className="space-y-6">
      <SectionToggle
        title="Enable Reservation Form on Charter Pages"
        enabled={f.enabled !== false}
        onChange={(v) => updF('enabled', v)}
      />

      <div className="space-y-4">
        <FieldRow label="Form Title" id="tbf-title">
          <Input
            id="tbf-title"
            value={f.title || ''}
            placeholder="Book This Charter"
            onChange={(e) => updF('title', e.target.value)}
            disabled={f.enabled === false}
          />
        </FieldRow>

        <FieldRow label="Form Subtitle" id="tbf-sub">
          <Input
            id="tbf-sub"
            value={f.subtitle || ''}
            placeholder="Reserve your private expedition on the water."
            onChange={(e) => updF('subtitle', e.target.value)}
            disabled={f.enabled === false}
          />
        </FieldRow>

        <FieldRow label="Submit Button Label" id="tbf-btn">
          <Input
            id="tbf-btn"
            value={f.buttonText || ''}
            placeholder="Submit Reservation"
            onChange={(e) => updF('buttonText', e.target.value)}
            disabled={f.enabled === false}
          />
        </FieldRow>

        <FieldRow label="Web3Forms Access Key (Optional override)" id="tbf-key">
          <Input
            id="tbf-key"
            value={f.accessKey || ''}
            placeholder="Leave blank to use Contact Page access key"
            onChange={(e) => updF('accessKey', e.target.value)}
            disabled={f.enabled === false}
          />
          <p className="text-xs text-muted-foreground mt-1">
            If left blank, it automatically uses the access key configured on the Contact Page form.
          </p>
        </FieldRow>

        <Separator />

        {/* Dynamic Form Fields Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Dynamic Reservation Form Fields</h4>
              <p className="text-xs text-muted-foreground">
                Customize, reorder, add dropdowns, checkboxes, date/time pickers, or text fields.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addField}
              disabled={f.enabled === false}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={field.id || idx}
                className="relative rounded-xl border border-border p-4 bg-card shadow-xs space-y-3"
                style={{ opacity: field.enabled !== false ? 1 : 0.55 }}
              >
                {/* Field Top Bar: Controls */}
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.enabled !== false}
                      onCheckedChange={(v) => updField(idx, 'enabled', v)}
                      disabled={f.enabled === false}
                    />
                    <span className="text-xs font-semibold text-foreground">
                      {field.label || `Field ${idx + 1}`}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                      {field.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === 0 || f.enabled === false}
                      onClick={() => moveField(idx, 'up')}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === fields.length - 1 || f.enabled === false}
                      onClick={() => moveField(idx, 'down')}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      disabled={f.enabled === false}
                      onClick={() => removeField(idx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Field Configuration Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FieldRow label="Field Label" id={`f-lbl-${idx}`}>
                    <Input
                      id={`f-lbl-${idx}`}
                      value={field.label}
                      onChange={(e) => updField(idx, 'label', e.target.value)}
                      disabled={f.enabled === false}
                    />
                  </FieldRow>

                  <FieldRow label="Field Type" id={`f-typ-${idx}`}>
                    <select
                      id={`f-typ-${idx}`}
                      value={field.type}
                      onChange={(e) => updField(idx, 'type', e.target.value as FormFieldType)}
                      disabled={f.enabled === false}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="text">Text (Single Line)</option>
                      <option value="email">Email Address</option>
                      <option value="tel">Phone Number</option>
                      <option value="number">Number</option>
                      <option value="date">Date Picker</option>
                      <option value="time">Time Picker</option>
                      <option value="datetime-local">Date & Time Picker</option>
                      <option value="select">Dropdown (Select Menu)</option>
                      <option value="checkbox">Checkbox Toggle</option>
                      <option value="textarea">Textarea (Multi-Line)</option>
                    </select>
                  </FieldRow>
                </div>

                {/* Placeholder (Not applicable for checkbox) */}
                {field.type !== 'checkbox' && (
                  <FieldRow label="Placeholder Text" id={`f-plc-${idx}`}>
                    <Input
                      id={`f-plc-${idx}`}
                      value={field.placeholder || ''}
                      placeholder="e.g. Enter details..."
                      onChange={(e) => updField(idx, 'placeholder', e.target.value)}
                      disabled={f.enabled === false}
                    />
                  </FieldRow>
                )}

                {/* Dropdown Options (For Select Type) */}
                {field.type === 'select' && (
                  <FieldRow label="Dropdown Options (1 per line)" id={`f-opt-${idx}`}>
                    <textarea
                      id={`f-opt-${idx}`}
                      rows={3}
                      value={(field.options || []).join('\n')}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      onChange={(e) =>
                        updField(
                          idx,
                          'options',
                          e.target.value.split('\n')
                        )
                      }
                      disabled={f.enabled === false}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none font-mono"
                    />
                  </FieldRow>
                )}

                {/* Toggles: Required & Half Width */}
                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`f-req-${idx}`}
                      checked={Boolean(field.required)}
                      onCheckedChange={(v) => updField(idx, 'required', v)}
                      disabled={f.enabled === false}
                    />
                    <Label htmlFor={`f-req-${idx}`} className="text-xs cursor-pointer">
                      Required field
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id={`f-half-${idx}`}
                      checked={Boolean(field.halfWidth)}
                      onCheckedChange={(v) => updField(idx, 'halfWidth', v)}
                      disabled={f.enabled === false}
                    />
                    <Label htmlFor={`f-half-${idx}`} className="text-xs cursor-pointer">
                      Half Width (2-Column Grid)
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Field at the Bottom */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => addField()}
              disabled={f.enabled === false}
              className="w-full sm:flex-1 h-10 border-dashed gap-2 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" /> Add Custom Field
            </Button>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addFieldWithType('date', 'Preferred Date')}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Date
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addFieldWithType('time', 'Departure Time')}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Time
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addFieldWithType('select', 'Select Option')}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Dropdown
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addFieldWithType('checkbox', 'Checkbox Option')}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Checkbox
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Editors ────────────────────────────────────────────────────────
function ContactHeroEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const h = draft.contactPage?.hero || defaultConfig.contactPage.hero;
  const upd = <K extends keyof AppConfig['contactPage']['hero']>(k: K, v: AppConfig['contactPage']['hero'][K]) =>
    set((p) => ({ ...p, contactPage: { ...p.contactPage, hero: { ...p.contactPage.hero, [k]: v } } }));

  return (
    <div className="space-y-5">
      <SectionToggle title="Contact Hero Section" enabled={h.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={h.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showEyebrow} onCheckedChange={(v) => upd('showEyebrow', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Eyebrow text" id="ch-eyebrow">
            <Input id="ch-eyebrow" value={h.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} disabled={!h.showEyebrow} />
          </FieldRow>
        </div>
      </div>
      <Separator />
      
      <FieldRow label="Headline" id="ch-headline">
        <Input id="ch-headline" value={h.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Italic / highlight text" id="ch-italic">
        <Input id="ch-italic" value={h.italicText} onChange={(e) => upd('italicText', e.target.value)} />
      </FieldRow>
      
      <div className="flex gap-4 items-start">
        <Switch checked={h.showSubtitle} onCheckedChange={(v) => upd('showSubtitle', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Subtitle" id="ch-subtitle">
            <textarea id="ch-subtitle" rows={3} value={h.subtitle}
              onChange={(e) => upd('subtitle', e.target.value)}
              disabled={!h.showSubtitle}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
          </FieldRow>
        </div>
      </div>
      
      <Separator />
      <FieldRow label="Background image" id="ch-image">
        <ImageUploaderField
          id="ch-image"
          value={h.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="contact-hero"
          placeholder="Upload or choose contact hero image..."
        />
      </FieldRow>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3 pt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Contact Page SEO & Meta</h4>
        <FieldRow label="Meta Title" id="ct-meta-title">
          <Input
            id="ct-meta-title"
            value={draft.contactPage?.metaTitle || ''}
            placeholder="e.g. Contact & Reservations"
            onChange={(e) =>
              set((p) => ({ ...p, contactPage: { ...p.contactPage, metaTitle: e.target.value } }))
            }
          />
        </FieldRow>
        <FieldRow label="Meta Description" id="ct-meta-desc">
          <textarea
            id="ct-meta-desc"
            rows={2}
            value={draft.contactPage?.metaDescription || ''}
            placeholder="e.g. Get in touch with our booking desk to plan your custom fishing trip..."
            onChange={(e) =>
              set((p) => ({ ...p, contactPage: { ...p.contactPage, metaDescription: e.target.value } }))
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </FieldRow>
      </div>
    </div>
  );
}

function ContactEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const c = draft.contactPage?.contact || defaultConfig.contactPage.contact;
  const f = draft.contactPage?.form || defaultConfig.contactPage.form;

  const updC = <K extends keyof AppConfig['contactPage']['contact']>(k: K, v: AppConfig['contactPage']['contact'][K]) =>
    set((p) => ({ ...p, contactPage: { ...p.contactPage, contact: { ...p.contactPage.contact, [k]: v } } }));

  const updF = <K extends keyof AppConfig['contactPage']['form']>(k: K, v: AppConfig['contactPage']['form'][K]) =>
    set((p) => ({ ...p, contactPage: { ...p.contactPage, form: { ...p.contactPage.form, [k]: v } } }));

  return (
    <div className="space-y-10">
      
      {/* SECTION: LEFT COLUMN (DETAILS) */}
      <div className="space-y-5">
        <div className="border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Left Column (Contact Details)</h3>
          <p className="text-sm text-muted-foreground">This controls the main section background and the contact information on the left.</p>
        </div>

        <SectionToggle title="Show Contact Details" enabled={c.enabled !== false} onChange={(v) => updC('enabled', v)} />
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Main Section Background Color</label>
          <BackgroundColorPicker value={c.backgroundColor || '#f5f5f0'} onChange={(v) => updC('backgroundColor', v)} />
        </div>
        
        <FieldRow label="Location" id="cd-loc">
          <textarea id="cd-loc" rows={3} value={c.location}
            onChange={(e) => updC('location', e.target.value)}
            className="w-full flex min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </FieldRow>
        <FieldRow label="Location Maps Link" id="cd-locl">
          <Input id="cd-locl" value={c.locationLink} onChange={(e) => updC('locationLink', e.target.value)} />
        </FieldRow>
        <FieldRow label="Phone" id="cd-phone">
          <Input id="cd-phone" value={c.phone} onChange={(e) => updC('phone', e.target.value)} />
        </FieldRow>
        <FieldRow label="Email" id="cd-email">
          <Input id="cd-email" value={c.email} onChange={(e) => updC('email', e.target.value)} />
        </FieldRow>
        <FieldRow label="WhatsApp" id="cd-wa">
          <Input id="cd-wa" value={c.whatsapp} onChange={(e) => updC('whatsapp', e.target.value)} />
        </FieldRow>
      </div>

      {/* SECTION: RIGHT COLUMN (FORM) */}
      <div className="space-y-5">
        <div className="border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Right Column (Form Card)</h3>
          <p className="text-sm text-muted-foreground">This controls the message form card displayed on the right.</p>
        </div>

        <SectionToggle title="Show Contact Form" enabled={f.enabled !== false} onChange={(v) => updF('enabled', v)} />
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Form Card Background Color</label>
          <BackgroundColorPicker value={f.backgroundColor || '#ffffff'} onChange={(v) => updF('backgroundColor', v)} />
        </div>

        <FieldRow label="Form Title" id="cf-title">
          <Input id="cf-title" value={f.title} onChange={(e) => updF('title', e.target.value)} />
        </FieldRow>
        <FieldRow label="Form Subtitle" id="cf-sub">
          <Input id="cf-sub" value={f.subtitle || ''} placeholder="We usually respond within 2-4 hours." onChange={(e) => updF('subtitle', e.target.value)} />
        </FieldRow>
        <FieldRow label="Submit Button Text" id="cf-btn">
          <Input id="cf-btn" value={f.buttonText} onChange={(e) => updF('buttonText', e.target.value)} />
        </FieldRow>
        <FieldRow label="Web3Forms Access Key" id="cf-key">
          <Input id="cf-key" value={f.accessKey} onChange={(e) => updF('accessKey', e.target.value)} placeholder="Enter key from web3forms.com" />
          <p className="text-xs text-muted-foreground mt-1">Get your free access key from <a href="https://web3forms.com/" target="_blank" className="underline text-blue-500">web3forms.com</a> to receive emails.</p>
        </FieldRow>

        <Separator />

        {/* Dynamic Contact Form Fields */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Dynamic Contact Form Fields</h4>
              <p className="text-xs text-muted-foreground">
                Customize, reorder, add dropdowns, checkboxes, date/time pickers, or text fields.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newField: DynamicFormField = {
                  id: `cf_${Date.now()}`,
                  label: 'New Field',
                  type: 'text',
                  placeholder: 'Enter details...',
                  required: false,
                  halfWidth: false,
                  enabled: true,
                };
                const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                updF('fields', [...currentFields, newField]);
              }}
              disabled={f.enabled === false}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {(f.fields || defaultConfig.contactPage.form.fields || []).map((field, idx) => {
              const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
              const updCField = (key: keyof DynamicFormField, val: unknown) => {
                const updated = [...currentFields];
                updated[idx] = { ...updated[idx], [key]: val };
                updF('fields', updated);
              };

              const removeCField = () => {
                updF('fields', currentFields.filter((_, i) => i !== idx));
              };

              const moveCField = (direction: 'up' | 'down') => {
                const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (targetIdx < 0 || targetIdx >= currentFields.length) return;
                const reordered = [...currentFields];
                const temp = reordered[idx];
                reordered[idx] = reordered[targetIdx];
                reordered[targetIdx] = temp;
                updF('fields', reordered);
              };

              return (
                <div
                  key={field.id || idx}
                  className="relative rounded-xl border border-border p-4 bg-card shadow-xs space-y-3"
                  style={{ opacity: field.enabled !== false ? 1 : 0.55 }}
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.enabled !== false}
                        onCheckedChange={(v) => updCField('enabled', v)}
                        disabled={f.enabled === false}
                      />
                      <span className="text-xs font-semibold text-foreground">
                        {field.label || `Field ${idx + 1}`}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                        {field.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={idx === 0 || f.enabled === false}
                        onClick={() => moveCField('up')}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={idx === currentFields.length - 1 || f.enabled === false}
                        onClick={() => moveCField('down')}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                        disabled={f.enabled === false}
                        onClick={removeCField}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Field Label" id={`cf-lbl-${idx}`}>
                      <Input
                        id={`cf-lbl-${idx}`}
                        value={field.label}
                        onChange={(e) => updCField('label', e.target.value)}
                        disabled={f.enabled === false}
                      />
                    </FieldRow>

                    <FieldRow label="Field Type" id={`cf-typ-${idx}`}>
                      <select
                        id={`cf-typ-${idx}`}
                        value={field.type}
                        onChange={(e) => updCField('type', e.target.value as FormFieldType)}
                        disabled={f.enabled === false}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="text">Text (Single Line)</option>
                        <option value="email">Email Address</option>
                        <option value="tel">Phone Number</option>
                        <option value="number">Number</option>
                        <option value="date">Date Picker</option>
                        <option value="time">Time Picker</option>
                        <option value="datetime-local">Date & Time Picker</option>
                        <option value="select">Dropdown (Select Menu)</option>
                        <option value="checkbox">Checkbox Toggle</option>
                        <option value="textarea">Textarea (Multi-Line)</option>
                      </select>
                    </FieldRow>
                  </div>

                  {field.type !== 'checkbox' && (
                    <FieldRow label="Placeholder Text" id={`cf-plc-${idx}`}>
                      <Input
                        id={`cf-plc-${idx}`}
                        value={field.placeholder || ''}
                        placeholder="e.g. Enter details..."
                        onChange={(e) => updCField('placeholder', e.target.value)}
                        disabled={f.enabled === false}
                      />
                    </FieldRow>
                  )}

                  {field.type === 'select' && (
                    <FieldRow label="Dropdown Options (1 per line)" id={`cf-opt-${idx}`}>
                      <textarea
                        id={`cf-opt-${idx}`}
                        rows={3}
                        value={(field.options || []).join('\n')}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        onChange={(e) =>
                          updCField(
                            'options',
                            e.target.value.split('\n')
                          )
                        }
                        disabled={f.enabled === false}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none font-mono"
                      />
                    </FieldRow>
                  )}

                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`cf-req-${idx}`}
                        checked={Boolean(field.required)}
                        onCheckedChange={(v) => updCField('required', v)}
                        disabled={f.enabled === false}
                      />
                      <Label htmlFor={`cf-req-${idx}`} className="text-xs cursor-pointer">
                        Required field
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id={`cf-half-${idx}`}
                        checked={Boolean(field.halfWidth)}
                        onCheckedChange={(v) => updCField('halfWidth', v)}
                        disabled={f.enabled === false}
                      />
                      <Label htmlFor={`cf-half-${idx}`} className="text-xs cursor-pointer">
                        Half Width (2-Column Grid)
                      </Label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Buttons at the bottom for Contact Form */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newField: DynamicFormField = {
                  id: `cf_${Date.now()}`,
                  label: 'New Field',
                  type: 'text',
                  placeholder: 'Enter details...',
                  required: false,
                  halfWidth: false,
                  enabled: true,
                };
                const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                updF('fields', [...currentFields, newField]);
              }}
              disabled={f.enabled === false}
              className="w-full sm:flex-1 h-10 border-dashed gap-2 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" /> Add Custom Field
            </Button>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newField: DynamicFormField = {
                    id: `cf_date_${Date.now()}`,
                    label: 'Preferred Date',
                    type: 'date',
                    required: false,
                    halfWidth: true,
                    enabled: true,
                  };
                  const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                  updF('fields', [...currentFields, newField]);
                }}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Date
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newField: DynamicFormField = {
                    id: `cf_time_${Date.now()}`,
                    label: 'Preferred Time',
                    type: 'time',
                    required: false,
                    halfWidth: true,
                    enabled: true,
                  };
                  const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                  updF('fields', [...currentFields, newField]);
                }}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Time
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newField: DynamicFormField = {
                    id: `cf_select_${Date.now()}`,
                    label: 'Subject / Category',
                    type: 'select',
                    options: ['General Inquiry', 'Charters', 'Feedback'],
                    required: false,
                    halfWidth: true,
                    enabled: true,
                  };
                  const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                  updF('fields', [...currentFields, newField]);
                }}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Dropdown
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newField: DynamicFormField = {
                    id: `cf_check_${Date.now()}`,
                    label: 'Subscribe to newsletter',
                    type: 'checkbox',
                    required: false,
                    halfWidth: false,
                    enabled: true,
                  };
                  const currentFields = f.fields || defaultConfig.contactPage.form.fields || [];
                  updF('fields', [...currentFields, newField]);
                }}
                disabled={f.enabled === false}
                className="text-[11px] h-9 flex-1 sm:flex-initial"
              >
                + Checkbox
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function FAQEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const f = draft.contactPage?.faq || defaultConfig.contactPage.faq;
  const upd = <K extends keyof AppConfig['contactPage']['faq']>(k: K, v: AppConfig['contactPage']['faq'][K]) =>
    set((p) => ({ ...p, contactPage: { ...p.contactPage, faq: { ...p.contactPage.faq, [k]: v } } }));

  return (
    <div className="space-y-5">
      <SectionToggle title="FAQ Section" enabled={f.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={f.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />
      
      <FieldRow label="Eyebrow text" id="cf-eyebrow">
        <Input id="cf-eyebrow" value={f.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>
      <FieldRow label="Title" id="cf-title">
        <Input id="cf-title" value={f.title} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>
      <FieldRow label="Subtitle" id="cf-subtitle">
        <textarea id="cf-subtitle" rows={3} value={f.subtitle}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
      </FieldRow>

      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">FAQ Items</h4>
        </div>
        {f.items.map((item, idx) => (
          <div key={idx} className="border rounded-md p-3 relative bg-card shadow-sm space-y-3">
            <div className="flex gap-2">
              <Switch 
                checked={item.enabled} 
                onCheckedChange={(v) => {
                  const arr = [...f.items];
                  arr[idx] = { ...item, enabled: v };
                  upd('items', arr);
                }} 
              />
              <div className="flex-1 space-y-2">
                <Input 
                  value={item.question} 
                  onChange={(e) => {
                    const arr = [...f.items];
                    arr[idx] = { ...item, question: e.target.value };
                    upd('items', arr);
                  }}
                  placeholder="Question"
                  disabled={!item.enabled}
                  className="h-8 text-sm font-semibold"
                />
                <textarea
                  value={item.answer}
                  onChange={(e) => {
                    const arr = [...f.items];
                    arr[idx] = { ...item, answer: e.target.value };
                    upd('items', arr);
                  }}
                  placeholder="Answer"
                  disabled={!item.enabled}
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── About Page Editors ──────────────────────────────────────────────────────
function AboutHeroEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const h = about.hero;
  const upd = <K extends keyof AppConfig['homepage']['hero']>(k: K, v: AppConfig['homepage']['hero'][K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, hero: { ...current.hero, [k]: v } } };
    });

  return (
    <div className="space-y-5">
      <SectionToggle title="About Hero Section" enabled={h.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={h.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />

      <FieldRow label="Section Height" id="abh-size">
        <select
          id="abh-size"
          value={h.size || 'large'}
          onChange={(e) => upd('size', e.target.value as 'small' | 'medium' | 'large' | 'fullscreen')}
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="small">Small (50vh)</option>
          <option value="medium">Medium (70vh)</option>
          <option value="large">Large (85vh)</option>
          <option value="fullscreen">Fullscreen (100vh)</option>
        </select>
      </FieldRow>

      <div className="flex gap-4 items-start">
        <Switch checked={h.showEyebrow} onCheckedChange={(v) => upd('showEyebrow', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Eyebrow badge text" id="abh-eyebrow">
            <Input id="abh-eyebrow" value={h.eyebrow} onChange={(e) => upd('eyebrow', e.target.value)} disabled={!h.showEyebrow} />
          </FieldRow>
        </div>
      </div>
      <Separator />

      <FieldRow label="Headline" id="abh-headline">
        <Input id="abh-headline" value={h.headline} onChange={(e) => upd('headline', e.target.value)} />
      </FieldRow>
      <FieldRow label="Italic / highlight text" id="abh-italic">
        <Input id="abh-italic" value={h.italicText} onChange={(e) => upd('italicText', e.target.value)} />
      </FieldRow>

      <div className="flex gap-4 items-start">
        <Switch checked={h.showSubtitle} onCheckedChange={(v) => upd('showSubtitle', v)} className="mt-8" />
        <div className="flex-1">
          <FieldRow label="Subtitle" id="abh-subtitle">
            <textarea
              id="abh-subtitle"
              rows={3}
              value={h.subtitle}
              onChange={(e) => upd('subtitle', e.target.value)}
              disabled={!h.showSubtitle}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
            />
          </FieldRow>
        </div>
      </div>

      <Separator />
      <FieldRow label="Background image" id="abh-image">
        <ImageUploaderField
          id="abh-image"
          value={h.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="hero"
          placeholder="Upload or choose hero image..."
        />
      </FieldRow>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3 pt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">About Page SEO & Meta</h4>
        <FieldRow label="Meta Title" id="ab-meta-title">
          <Input
            id="ab-meta-title"
            value={draft.aboutPage?.metaTitle || ''}
            placeholder="e.g. About Our Heritage & Crew"
            onChange={(e) =>
              set((p) => {
                const current = p.aboutPage || defaultConfig.aboutPage!;
                return { ...p, aboutPage: { ...current, metaTitle: e.target.value } };
              })
            }
          />
        </FieldRow>
        <FieldRow label="Meta Description" id="ab-meta-desc">
          <textarea
            id="ab-meta-desc"
            rows={2}
            value={draft.aboutPage?.metaDescription || ''}
            placeholder="e.g. Discover our story, decades of sportfishing heritage, and conservation..."
            onChange={(e) =>
              set((p) => {
                const current = p.aboutPage || defaultConfig.aboutPage!;
                return { ...p, aboutPage: { ...current, metaDescription: e.target.value } };
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </FieldRow>
      </div>
    </div>
  );
}

function AboutStoryEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const s = about.story;
  const rawParagraphs =
    s.paragraphs && s.paragraphs.length > 0
      ? s.paragraphs
      : ([s.paragraph1, s.paragraph2].filter(Boolean) as string[]);

  const paragraphs: StoryParagraphItem[] = rawParagraphs.map((p) =>
    typeof p === 'string' ? { enabled: true, text: p } : p
  );

  const upd = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, story: { ...current.story, [k]: v } } };
    });

  const addParagraph = () => {
    upd('paragraphs', [...paragraphs, { enabled: true, text: '' }]);
  };

  const updateParagraph = (idx: number, patch: Partial<StoryParagraphItem>) => {
    const updated = [...paragraphs];
    updated[idx] = { ...updated[idx], ...patch };
    upd('paragraphs', updated);
  };

  const removeParagraph = (idx: number) => {
    const updated = paragraphs.filter((_, i) => i !== idx);
    upd('paragraphs', updated);
  };

  const moveParagraph = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= paragraphs.length) return;
    const arr = [...paragraphs];
    const [temp] = arr.splice(idx, 1);
    arr.splice(target, 0, temp);
    upd('paragraphs', arr);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="Our Story Section" enabled={s.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={s.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />

      <FieldRow label="Eyebrow text" id="abs-eyebrow">
        <Input id="abs-eyebrow" value={s.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Title" id="abs-title">
        <Input id="abs-title" value={s.title} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Story Paragraphs ({paragraphs.length})</h4>
            <p className="text-xs text-muted-foreground">Add, toggle on/off, reorder, or delete narrative paragraphs.</p>
          </div>
          <Button size="sm" variant="outline" onClick={addParagraph} className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" /> Add Paragraph
          </Button>
        </div>

        {paragraphs.map((para, idx) => (
          <div key={idx} className="border rounded-lg p-3 bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={para.enabled}
                  onCheckedChange={(checked) => updateParagraph(idx, { enabled: checked })}
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  Paragraph #{idx + 1} {!para.enabled && '(Disabled)'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0} onClick={() => moveParagraph(idx, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === paragraphs.length - 1} onClick={() => moveParagraph(idx, 1)}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeParagraph(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <textarea
              rows={3}
              value={para.text}
              disabled={!para.enabled}
              onChange={(e) => updateParagraph(idx, { text: e.target.value })}
              placeholder="Write a paragraph about your journey, heritage, or mission..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      <Separator />
      <FieldRow label="Side Image" id="abs-image">
        <ImageUploaderField
          id="abs-image"
          value={s.imageUrl}
          onChange={(url) => upd('imageUrl', url)}
          folder="about"
          placeholder="Upload or choose story image..."
        />
      </FieldRow>

      <FieldRow label="Image Alt Description" id="abs-alt">
        <Input id="abs-alt" value={s.imageAlt || ''} onChange={(e) => upd('imageAlt', e.target.value)} />
      </FieldRow>
    </div>
  );
}

function AboutValuesEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const v = about.values;
  const upd = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, values: { ...current.values, [k]: val } } };
    });

  const addItem = () => {
    const newItem: AboutValueItem = {
      enabled: true,
      icon: 'Star',
      title: 'New Value',
      description: 'Describe this core value and how it guides your voyages.',
    };
    upd('items', [...v.items, newItem]);
  };

  const removeItem = (idx: number) => {
    upd('items', v.items.filter((_, i) => i !== idx));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= v.items.length) return;
    const arr = [...v.items];
    const [temp] = arr.splice(idx, 1);
    arr.splice(target, 0, temp);
    upd('items', arr);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="Core Values Section" enabled={v.enabled} onChange={(val) => upd('enabled', val)} />
      <BackgroundColorPicker value={v.backgroundColor} onChange={(val) => upd('backgroundColor', val)} />

      <FieldRow label="Eyebrow text" id="abv-eyebrow">
        <Input id="abv-eyebrow" value={v.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Title" id="abv-title">
        <Input id="abv-title" value={v.title || ''} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Subtitle" id="abv-sub">
        <textarea
          id="abv-sub"
          rows={2}
          value={v.subtitle || ''}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Value Cards ({v.items.length})</h4>
          <Button size="sm" variant="outline" onClick={addItem} className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" /> Add Card
          </Button>
        </div>

        {v.items.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(checked) => {
                    const arr = [...v.items];
                    arr[idx] = { ...item, enabled: checked };
                    upd('items', arr);
                  }}
                />
                <span className="text-sm font-semibold">Card #{idx + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0} onClick={() => moveItem(idx, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === v.items.length - 1} onClick={() => moveItem(idx, 1)}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldRow label="Lucide Icon Name" id={`abv-icon-${idx}`}>
                <Input
                  id={`abv-icon-${idx}`}
                  value={item.icon}
                  placeholder="Anchor, Compass, Users, Star..."
                  onChange={(e) => {
                    const arr = [...v.items];
                    arr[idx] = { ...item, icon: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
              <FieldRow label="Title" id={`abv-title-${idx}`}>
                <Input
                  id={`abv-title-${idx}`}
                  value={item.title}
                  onChange={(e) => {
                    const arr = [...v.items];
                    arr[idx] = { ...item, title: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
            </div>

            <FieldRow label="Description" id={`abv-desc-${idx}`}>
              <textarea
                id={`abv-desc-${idx}`}
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const arr = [...v.items];
                  arr[idx] = { ...item, description: e.target.value };
                  upd('items', arr);
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </FieldRow>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTeamEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const t = about.team;
  const upd = <K extends keyof typeof t>(k: K, val: (typeof t)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, team: { ...current.team, [k]: val } } };
    });

  const addMember = () => {
    const newMember: AboutTeamMember = {
      enabled: true,
      name: 'Captain Alex M.',
      role: 'First Mate & Guide',
      quote: '"The sea has a story to tell every day."',
      imageUrl: '/images/hero/hero.jpg',
    };
    upd('items', [...t.items, newMember]);
  };

  const removeMember = (idx: number) => {
    upd('items', t.items.filter((_, i) => i !== idx));
  };

  const moveMember = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= t.items.length) return;
    const arr = [...t.items];
    const [temp] = arr.splice(idx, 1);
    arr.splice(target, 0, temp);
    upd('items', arr);
  };

  return (
    <div className="space-y-6">
      <SectionToggle title="The Crew / Storytellers Section" enabled={t.enabled} onChange={(val) => upd('enabled', val)} />
      <BackgroundColorPicker value={t.backgroundColor} onChange={(val) => upd('backgroundColor', val)} />

      <FieldRow label="Eyebrow text" id="abt-eyebrow">
        <Input id="abt-eyebrow" value={t.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Title" id="abt-title">
        <Input id="abt-title" value={t.title || ''} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <FieldRow label="Section Subtitle" id="abt-sub">
        <textarea
          id="abt-sub"
          rows={2}
          value={t.subtitle || ''}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Crew Members ({t.items.length})</h4>
          <Button size="sm" variant="outline" onClick={addMember} className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" /> Add Member
          </Button>
        </div>

        {t.items.map((member, idx) => (
          <div key={idx} className="border rounded-lg p-4 bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={member.enabled}
                  onCheckedChange={(checked) => {
                    const arr = [...t.items];
                    arr[idx] = { ...member, enabled: checked };
                    upd('items', arr);
                  }}
                />
                <span className="text-sm font-semibold">{member.name || `Member #${idx + 1}`}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0} onClick={() => moveMember(idx, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === t.items.length - 1} onClick={() => moveMember(idx, 1)}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeMember(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldRow label="Name" id={`abt-name-${idx}`}>
                <Input
                  id={`abt-name-${idx}`}
                  value={member.name}
                  onChange={(e) => {
                    const arr = [...t.items];
                    arr[idx] = { ...member, name: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
              <FieldRow label="Role / Badge" id={`abt-role-${idx}`}>
                <Input
                  id={`abt-role-${idx}`}
                  value={member.role}
                  placeholder="Head Skipper, Marine Biologist..."
                  onChange={(e) => {
                    const arr = [...t.items];
                    arr[idx] = { ...member, role: e.target.value };
                    upd('items', arr);
                  }}
                />
              </FieldRow>
            </div>

            <FieldRow label="Quote / Philosophy" id={`abt-quote-${idx}`}>
              <Input
                id={`abt-quote-${idx}`}
                value={member.quote}
                onChange={(e) => {
                  const arr = [...t.items];
                  arr[idx] = { ...member, quote: e.target.value };
                  upd('items', arr);
                }}
              />
            </FieldRow>

            <FieldRow label="Portrait Image" id={`abt-img-${idx}`}>
              <ImageUploaderField
                id={`abt-img-${idx}`}
                value={member.imageUrl}
                onChange={(url) => {
                  const arr = [...t.items];
                  arr[idx] = { ...member, imageUrl: url };
                  upd('items', arr);
                }}
                folder="team"
                placeholder="Upload or select portrait..."
              />
            </FieldRow>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutImpactEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const imp = about.impact;
  const upd = <K extends keyof typeof imp>(k: K, val: (typeof imp)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, impact: { ...current.impact, [k]: val } } };
    });

  return (
    <div className="space-y-8">
      <SectionToggle title="Impact & Partners Section" enabled={imp.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker
        value={imp.backgroundColor || '#0f172a'}
        onChange={(v) => upd('backgroundColor', v)}
        desc="Dark theme recommended for impact contrast (e.g. #0f172a)."
      />

      <div className="space-y-4 border-b pb-6">
        <h4 className="text-sm font-semibold">Left Column (Narrative & Stats)</h4>

        <FieldRow label="Section Title" id="abi-title">
          <Input id="abi-title" value={imp.title} onChange={(e) => upd('title', e.target.value)} />
        </FieldRow>

        <FieldRow label="Section Subtitle" id="abi-sub">
          <textarea
            id="abi-sub"
            rows={2}
            value={imp.subtitle}
            onChange={(e) => upd('subtitle', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </FieldRow>

        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Impact Metrics (4 Counters)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {imp.stats.map((st, idx) => (
              <div key={idx} className="border rounded-md p-3 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Metric #{idx + 1}</span>
                  <Switch
                    checked={st.enabled}
                    onCheckedChange={(chk) => {
                      const arr = [...imp.stats];
                      arr[idx] = { ...st, enabled: chk };
                      upd('stats', arr);
                    }}
                  />
                </div>
                <Input
                  value={st.value}
                  placeholder="1,200+"
                  onChange={(e) => {
                    const arr = [...imp.stats];
                    arr[idx] = { ...st, value: e.target.value };
                    upd('stats', arr);
                  }}
                  className="font-bold font-mono text-sm"
                />
                <Input
                  value={st.label}
                  placeholder="BILLFISH TAGGED"
                  onChange={(e) => {
                    const arr = [...imp.stats];
                    arr[idx] = { ...st, label: e.target.value };
                    upd('stats', arr);
                  }}
                  className="text-xs uppercase"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Right Column (Global Partners Card)</h4>

        <FieldRow label="Card Title" id="abi-part-title">
          <Input
            id="abi-part-title"
            value={imp.partnersCard.title}
            onChange={(e) => upd('partnersCard', { ...imp.partnersCard, title: e.target.value })}
          />
        </FieldRow>

        <FieldRow label="Card Icon (Lucide)" id="abi-part-icon">
          <Input
            id="abi-part-icon"
            value={imp.partnersCard.icon || 'ShieldCheck'}
            onChange={(e) => upd('partnersCard', { ...imp.partnersCard, icon: e.target.value })}
          />
        </FieldRow>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Partner Badges (comma separated)</label>
          <Input
            value={imp.partnersCard.partners.join(', ')}
            placeholder="The Billfish Foundation, Kenya Wildlife Service..."
            onChange={(e) => {
              const partners = e.target.value
                .split(',')
                .map((p) => p.trim())
                .filter(Boolean);
              upd('partnersCard', { ...imp.partnersCard, partners });
            }}
          />
          <p className="text-xs text-muted-foreground">Separate partner names with commas.</p>
        </div>
      </div>
    </div>
  );
}

function AboutCTAEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const about = draft.aboutPage || defaultConfig.aboutPage!;
  const cta = about.cta;
  const upd = <K extends keyof typeof cta>(k: K, val: (typeof cta)[K]) =>
    set((p) => {
      const current = p.aboutPage || defaultConfig.aboutPage!;
      return { ...p, aboutPage: { ...current, cta: { ...current.cta, [k]: val } } };
    });

  return (
    <div className="space-y-6">
      <SectionToggle title="CTA Banner Section" enabled={cta.enabled} onChange={(v) => upd('enabled', v)} />
      <BackgroundColorPicker value={cta.backgroundColor} onChange={(v) => upd('backgroundColor', v)} />

      <FieldRow label="Banner Title" id="abcta-title">
        <Input id="abcta-title" value={cta.title} onChange={(e) => upd('title', e.target.value)} />
      </FieldRow>

      <FieldRow label="Banner Subtitle" id="abcta-sub">
        <textarea
          id="abcta-sub"
          rows={3}
          value={cta.subtitle}
          onChange={(e) => upd('subtitle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </FieldRow>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary CTA */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Primary Button</h4>
            <Switch
              checked={cta.primaryCta.enabled}
              onCheckedChange={(checked) =>
                upd('primaryCta', { ...cta.primaryCta, enabled: checked })
              }
            />
          </div>
          <FieldRow label="Button Label" id="abcta-p-lbl">
            <Input
              id="abcta-p-lbl"
              value={cta.primaryCta.label}
              onChange={(e) => upd('primaryCta', { ...cta.primaryCta, label: e.target.value })}
              disabled={!cta.primaryCta.enabled}
            />
          </FieldRow>
          <FieldRow label="Button Link" id="abcta-p-href">
            <Input
              id="abcta-p-href"
              value={cta.primaryCta.href}
              onChange={(e) => upd('primaryCta', { ...cta.primaryCta, href: e.target.value })}
              disabled={!cta.primaryCta.enabled}
            />
          </FieldRow>
        </div>

        {/* Secondary CTA */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Secondary Button</h4>
            <Switch
              checked={cta.secondaryCta.enabled}
              onCheckedChange={(checked) =>
                upd('secondaryCta', { ...cta.secondaryCta, enabled: checked })
              }
            />
          </div>
          <FieldRow label="Button Label" id="abcta-s-lbl">
            <Input
              id="abcta-s-lbl"
              value={cta.secondaryCta.label}
              onChange={(e) => upd('secondaryCta', { ...cta.secondaryCta, label: e.target.value })}
              disabled={!cta.secondaryCta.enabled}
            />
          </FieldRow>
          <FieldRow label="Button Link" id="abcta-s-href">
            <Input
              id="abcta-s-href"
              value={cta.secondaryCta.href}
              onChange={(e) => upd('secondaryCta', { ...cta.secondaryCta, href: e.target.value })}
              disabled={!cta.secondaryCta.enabled}
            />
          </FieldRow>
        </div>
      </div>
    </div>
  );
}


