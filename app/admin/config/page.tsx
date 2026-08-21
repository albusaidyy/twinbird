'use client';

import { useEffect, useState } from 'react';
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
import type { AppConfig, StatItem, TourItem, ReviewItem, WhyUsItem, GalleryItem, FooterLink, SocialLink } from '@/types/app-config';
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
} from 'lucide-react';

// ─── Sidebar configuration ──────────────────────────────────────────────────────
type SectionKey = 'branding' | 'hero' | 'stats' | 'tours' | 'reviews' | 'whyus' | 'gallery' | 'cta' | 'footer' | 'contact-hero' | 'contact-details' | 'contact-faq';

const APP_SETTINGS = [
  { key: 'branding' as SectionKey, label: 'Branding & Theme', Icon: Palette, description: 'Colors, app name, logo' },
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
    id: 'contact',
    label: 'Contact',
    Icon: Info,
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

function ToursEditor({ draft, set }: { draft: AppConfig; set: (fn: (p: AppConfig) => AppConfig) => void }) {
  const data = draft.homepage.tours;
  const updEnabled = (v: boolean) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, enabled: v } } }));
  const updTour = (i: number, k: keyof TourItem, v: string | number | boolean) =>
    set((p) => {
      const arr = [...p.homepage.tours.items];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: arr } } };
    });
  const addTour = () =>
    set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: [...p.homepage.tours.items, { enabled: true, title: 'New Tour', badge: 'New', description: 'Desc', duration: '1 day', rating: 5, imageUrl: '/images/hero/hero.jpg' }] } } }));
  const rmTour = (i: number) =>
    set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, items: p.homepage.tours.items.filter((_, idx) => idx !== i) } } }));

  return (
    <div className="space-y-6">
      <SectionToggle title="Featured Tours" enabled={data.enabled} onChange={updEnabled} />
      <BackgroundColorPicker value={data.backgroundColor} onChange={(v) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, backgroundColor: v } } }))} />
      
      <SectionHeaderFields 
        data={data} 
        onChange={(k, v) => set((p) => ({ ...p, homepage: { ...p.homepage, tours: { ...p.homepage.tours, [k]: v } } }))} 
      />

      {data.items.map((t, i) => (
        <div key={i} className="relative rounded-lg border border-border p-5 pt-10 bg-card">
          <div className="absolute top-2 left-4 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={t.enabled} onCheckedChange={(v) => updTour(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{t.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => rmTour(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: t.enabled ? 1 : 0.5 }}>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Title" id={`t-title-${i}`}>
                <Input id={`t-title-${i}`} value={t.title} onChange={(e) => updTour(i, 'title', e.target.value)} disabled={!t.enabled} />
              </FieldRow>
              <FieldRow label="Badge" id={`t-badge-${i}`}>
                <Input id={`t-badge-${i}`} value={t.badge} onChange={(e) => updTour(i, 'badge', e.target.value)} disabled={!t.enabled} />
              </FieldRow>
              <FieldRow label="Duration" id={`t-dur-${i}`}>
                <Input id={`t-dur-${i}`} value={t.duration} onChange={(e) => updTour(i, 'duration', e.target.value)} disabled={!t.enabled} />
              </FieldRow>
              <FieldRow label="Rating (0–5)" id={`t-rating-${i}`}>
                <Input id={`t-rating-${i}`} type="number" min={0} max={5} step={0.1}
                  value={t.rating} onChange={(e) => updTour(i, 'rating', parseFloat(e.target.value) || 0)} disabled={!t.enabled} />
              </FieldRow>
            </div>
            <FieldRow label="Tour Image" id={`t-img-${i}`}>
              <ImageUploaderField
                id={`t-img-${i}`}
                value={t.imageUrl}
                onChange={(url) => updTour(i, 'imageUrl', url)}
                folder="tours"
                placeholder="Upload or choose tour image..."
                disabled={!t.enabled}
              />
            </FieldRow>
            <FieldRow label="Description" id={`t-desc-${i}`}>
              <textarea id={`t-desc-${i}`} rows={2} value={t.description}
                onChange={(e) => updTour(i, 'description', e.target.value)}
                disabled={!t.enabled}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50" />
            </FieldRow>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addTour}>
        <Plus className="h-4 w-4" /> Add Tour
      </Button>
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

      {data.items.map((img, i) => (
        <div key={i} className="relative rounded-lg border border-border p-5 pt-10 bg-card">
          <div className="absolute top-2 left-4 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch checked={img.enabled} onCheckedChange={(v) => updItem(i, 'enabled', v)} />
              <span className="text-xs text-muted-foreground">{img.enabled ? 'Shown' : 'Hidden'}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => rmItem(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
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
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="h-4 w-4" /> Add Image
      </Button>
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Live preview
  useEffect(() => { updateConfig(draft); }, [draft, updateConfig]);

  const handleSave = async () => {
    setSaving(true);
    await saveAppConfig(draft);
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

  return (
    <div className="flex h-full gap-0">
      {/* ── Left sidebar ────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 border-r border-border bg-muted/30 flex flex-col">
        <div className="px-4 py-5 border-b border-border">
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
                  onClick={() => setActive(key)}
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
                return (
                  <div key={page.id} className="space-y-1">
                    <div className="flex items-center gap-1 group">
                      <button
                        onClick={() => setExpandedPages((prev) => ({ ...prev, [page.id]: !prev[page.id] }))}
                        className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-accent hover:bg-accent/80 transition-colors"
                      >
                        <page.Icon className="h-4 w-4 shrink-0" style={{ color: config.branding.primaryColor }} />
                        <span className="flex-1 text-left">{page.label}</span>
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
                                onClick={() => setActive(key)}
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
                                onClick={() => setActive(key)}
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
      <div className="flex-1 overflow-y-auto">
        <Card className="m-6 shadow-none border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              {currentSectionInfo?.Icon && <currentSectionInfo.Icon className="h-4 w-4" style={{ color: config.branding.primaryColor }} />}
              {currentSectionInfo?.label}
            </CardTitle>
            <CardDescription>{currentSectionInfo?.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {active === 'branding' && <BrandingEditor {...editorProps} />}
            {active === 'hero'     && <HeroEditor {...editorProps} />}
            {active === 'stats'    && <StatsEditor {...editorProps} />}
            {active === 'tours'    && <ToursEditor {...editorProps} />}
            {active === 'reviews'  && <ReviewsEditor {...editorProps} />}
            {active === 'gallery'  && <GalleryEditor {...editorProps} />}
            {active === 'whyus'    && <WhyUsEditor {...editorProps} />}
            {active === 'cta'      && <CTAEditor {...editorProps} />}
            {active === 'footer'   && <FooterEditor {...editorProps} />}
            {active === 'contact-hero'    && <ContactHeroEditor {...editorProps} />}
            {active === 'contact-details' && <ContactEditor {...editorProps} />}
            {active === 'contact-faq'     && <FAQEditor {...editorProps} />}
          </CardContent>
        </Card>
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
        <FieldRow label="Submit Button Text" id="cf-btn">
          <Input id="cf-btn" value={f.buttonText} onChange={(e) => updF('buttonText', e.target.value)} />
        </FieldRow>
        <FieldRow label="Web3Forms Access Key" id="cf-key">
          <Input id="cf-key" value={f.accessKey} onChange={(e) => updF('accessKey', e.target.value)} placeholder="Enter key from web3forms.com" />
          <p className="text-xs text-muted-foreground mt-1">Get your free access key from <a href="https://web3forms.com/" target="_blank" className="underline text-blue-500">web3forms.com</a> to receive emails.</p>
        </FieldRow>
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
