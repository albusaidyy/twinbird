'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { saveAppConfig } from '@/lib/config/saveAppConfig';
import { defaultConfig } from '@/config/default-config';
import { saveConfigVersion } from './actions';
import type { AppConfig } from '@/types/app-config';
import {
  CheckCircle,
  RotateCcw,
  Layers,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Loader2,
  X,
  Check,
  Menu,
  PanelLeftClose,
  History,
} from 'lucide-react';

import { APP_SETTINGS, PAGES, type SectionKey } from './_components/shared/types';
import { ResetConfirmDialog } from './_components/shared/ResetConfirmDialog';

// Global editors
import { BrandingEditor } from './_components/global/BrandingEditor';
import { NavigationEditor } from './_components/global/NavigationEditor';
import { VersionHistoryEditor } from './_components/global/VersionHistoryEditor';

// Homepage editors
import { HomeHeroEditor } from './_components/home/HomeHeroEditor';
import { HomeStatsEditor } from './_components/home/HomeStatsEditor';
import { HomeExperiencesEditor } from './_components/home/HomeExperiencesEditor';
import { HomeToursEditor } from './_components/home/HomeToursEditor';
import { HomeExcursionsEditor } from './_components/home/HomeExcursionsEditor';
import { HomeReviewsEditor } from './_components/home/HomeReviewsEditor';
import { HomeGalleryEditor } from './_components/home/HomeGalleryEditor';
import { HomeWhyUsEditor } from './_components/home/HomeWhyUsEditor';
import { HomeCTAEditor } from './_components/home/HomeCTAEditor';
import { HomeFooterEditor } from './_components/home/HomeFooterEditor';

// Tours page editors
import { ToursHeroEditor } from './_components/tours/ToursHeroEditor';
import { ToursListEditor } from './_components/tours/ToursListEditor';
import { ToursBookingEditor } from './_components/tours/ToursBookingEditor';

// Excursions page editors
import { ExcursionsHeroEditor } from './_components/excursions/ExcursionsHeroEditor';
import { ExcursionsListEditor } from './_components/excursions/ExcursionsListEditor';
import { ExcursionsBookingEditor } from './_components/excursions/ExcursionsBookingEditor';

// Transfers page editors
import { TransfersHeroEditor } from './_components/transfers/TransfersHeroEditor';
import { TransfersRoutesEditor } from './_components/transfers/TransfersRoutesEditor';
import { TransfersBookingEditor } from './_components/transfers/TransfersBookingEditor';
import { TransfersFleetEditor } from './_components/transfers/TransfersFleetEditor';
import { TransfersFAQEditor } from './_components/transfers/TransfersFAQEditor';

// About page editors
import { AboutHeroEditor } from './_components/about/AboutHeroEditor';
import { AboutStoryEditor } from './_components/about/AboutStoryEditor';
import { AboutValuesEditor } from './_components/about/AboutValuesEditor';
import { AboutTeamEditor } from './_components/about/AboutTeamEditor';
import { AboutImpactEditor } from './_components/about/AboutImpactEditor';
import { AboutCTAEditor } from './_components/about/AboutCTAEditor';

// Contact page editors
import { ContactHeroEditor } from './_components/contact/ContactHeroEditor';
import { ContactDetailsEditor } from './_components/contact/ContactDetailsEditor';
import { ContactFAQEditor } from './_components/contact/ContactFAQEditor';

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
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Live preview
  useEffect(() => {
    updateConfig(draft);
  }, [draft, updateConfig]);

  const handleSave = async () => {
    setSaving(true);

    // Clean up empty options in select fields before saving
    const cleanedDraft = JSON.parse(JSON.stringify(draft)) as AppConfig;

    const deduplicateList = <T extends { id?: string; slug?: string; title?: string }>(items?: T[]): T[] | undefined => {
      if (!items) return items;
      const seen = new Set<string>();
      return items.filter((item, idx) => {
        const key = item.id || item.slug || (item.title ? item.title.trim().toLowerCase() : `t-${idx}`);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    if (cleanedDraft.homepage?.tours?.items) {
      cleanedDraft.homepage.tours.items = deduplicateList(cleanedDraft.homepage.tours.items)!;
    }
    if (cleanedDraft.homepage?.excursions?.items) {
      cleanedDraft.homepage.excursions.items = deduplicateList(cleanedDraft.homepage.excursions.items)!;
    }
    if (cleanedDraft.toursPage?.tours?.items) {
      cleanedDraft.toursPage.tours.items = deduplicateList(cleanedDraft.toursPage.tours.items)!;
    }
    if (cleanedDraft.excursionsPage?.tours?.items) {
      cleanedDraft.excursionsPage.tours.items = deduplicateList(cleanedDraft.excursionsPage.tours.items)!;
    }

    if (cleanedDraft.toursPage?.bookingForm?.fields) {
      cleanedDraft.toursPage.bookingForm.fields.forEach((f) => {
        if (f.type === 'select' && f.options) {
          f.options = f.options.map((o) => o.trim()).filter(Boolean);
        }
      });
    }

    if (cleanedDraft.excursionsPage?.bookingForm?.fields) {
      cleanedDraft.excursionsPage.bookingForm.fields.forEach((f) => {
        if (f.type === 'select' && f.options) {
          f.options = f.options.map((o) => o.trim()).filter(Boolean);
        }
      });
    }

    if (cleanedDraft.contactPage?.form?.fields) {
      cleanedDraft.contactPage.form.fields.forEach((f) => {
        if (f.type === 'select' && f.options) {
          f.options = f.options.map((o) => o.trim()).filter(Boolean);
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

  const handleReset = () => setResetConfirmOpen(true);

  const confirmReset = async () => {
    setResetting(true);
    try {
      // Snapshot the current config before resetting
      await saveConfigVersion(draft, `Manual reset — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}`);
    } catch {
      // Snapshot failed — still allow reset, it's non-blocking
    } finally {
      setResetting(false);
      setResetConfirmOpen(false);
      setDraft(defaultConfig);
    }
  };

  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [snapshotCustomName, setSnapshotCustomName] = useState('');
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  const handleOpenSaveVersionModal = () => {
    setSnapshotCustomName(`Version — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}`);
    setSnapshotModalOpen(true);
  };

  const handleSaveVersion = async () => {
    if (savingSnapshot) return;
    setSavingSnapshot(true);
    try {
      const label = snapshotCustomName.trim() || `Version — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}`;
      await saveConfigVersion(draft, label);
      setSnapshotSuccess(true);
      setTimeout(() => {
        setSnapshotSuccess(false);
        setSnapshotModalOpen(false);
      }, 1200);
    } catch {
      // non-blocking
    } finally {
      setSavingSnapshot(false);
    }
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
      <ResetConfirmDialog
        isOpen={resetConfirmOpen}
        isSaving={resetting}
        onConfirm={confirmReset}
        onCancel={() => setResetConfirmOpen(false)}
      />

      {/* ── Save Named Version Modal ────────────────────────────────────────── */}
      {snapshotModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Save Current Config as Version
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setSnapshotModalOpen(false)}
                disabled={savingSnapshot}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Give this configuration snapshot a name or label to easily identify and restore it later.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="global-snapshot-name">Version Name / Label</Label>
              <Input
                id="global-snapshot-name"
                value={snapshotCustomName}
                onChange={(e) => setSnapshotCustomName(e.target.value)}
                placeholder="e.g. Peak Season Rates & Christmas Hero"
                className="text-xs"
                autoFocus
              />
            </div>

            {snapshotSuccess && (
              <div className="rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 p-2.5 text-xs flex items-center gap-1.5 font-medium">
                <CheckCircle className="h-4 w-4" />
                Version snapshot saved successfully!
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSnapshotModalOpen(false)}
                disabled={savingSnapshot}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveVersion}
                disabled={savingSnapshot || snapshotSuccess}
                className="text-xs h-8 gap-1.5 text-white"
                style={{ backgroundColor: config.branding.primaryColor }}
              >
                {savingSnapshot ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Save Version
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

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

                          const heroSec = page.sections.find((s) => s.key === 'hero');
                          const footerSec = page.sections.find((s) => s.key === 'footer');
                          const defaultOrder = ['stats', 'experiences', 'tours', 'excursions', 'whyus', 'reviews', 'gallery', 'cta'];
                          const order = [...(draft.homepage.sectionOrder || defaultOrder)];
                          if (!order.includes('experiences')) {
                            const statsIdx = order.indexOf('stats');
                            if (statsIdx !== -1) order.splice(statsIdx + 1, 0, 'experiences');
                            else order.unshift('experiences');
                          }
                          if (!order.includes('excursions')) {
                            const toursIdx = order.indexOf('tours');
                            if (toursIdx !== -1) order.splice(toursIdx + 1, 0, 'excursions');
                            else order.push('excursions');
                          }
                          if (!order.includes('gallery')) {
                            const reviewsIdx = order.indexOf('reviews');
                            if (reviewsIdx !== -1) order.splice(reviewsIdx + 1, 0, 'gallery');
                            else order.push('gallery');
                          }

                          const middleSecs = order
                            .map((k) => {
                              if (k === 'excursions') {
                                return page.sections.find((s) => s.key === 'home-excursions');
                              }
                              return page.sections.find((s) => s.key === k);
                            })
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
                                  e.dataTransfer.effectAllowed = 'move';
                                  e.currentTarget.classList.add('opacity-50');
                                }}
                                onDragEnd={(e) => {
                                  setDraggedItem(null);
                                  e.currentTarget.classList.remove('opacity-50');
                                }}
                                onDragOver={(e) => {
                                  if (!isMiddle) return;
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = 'move';
                                }}
                                onDrop={(e) => {
                                  if (!isMiddle) return;
                                  e.preventDefault();
                                  if (draggedItem && draggedItem !== key) {
                                    const normalizeKey = (k: string) => (k === 'home-excursions' ? 'excursions' : k);
                                    const dragKey = normalizeKey(draggedItem);
                                    const targetKey = normalizeKey(key);
                                    const oldIdx = order.indexOf(dragKey);
                                    const newIdx = order.indexOf(targetKey);
                                    if (oldIdx !== -1 && newIdx !== -1) {
                                      const newOrder = [...order];
                                      newOrder.splice(oldIdx, 1);
                                      newOrder.splice(newIdx, 0, dragKey);
                                      setDraft((p) => ({ ...p, homepage: { ...p.homepage, sectionOrder: newOrder } }));
                                    }
                                  }
                                }}
                                onClick={() => handleSectionClick(key)}
                                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors text-left ${
                                  isMiddle ? 'cursor-grab active:cursor-grabbing hover:bg-accent/80' : ''
                                } ${
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
            id="save-version-btn"
            variant="outline"
            size="sm"
            onClick={handleOpenSaveVersionModal}
            className="w-full gap-1 text-xs border-dashed"
          >
            <History className="h-3.5 w-3.5 text-primary" /> Save as Named Version
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
            {/* Global Settings */}
            {active === 'branding' && <BrandingEditor {...editorProps} />}
            {active === 'navigation' && <NavigationEditor {...editorProps} />}
            {active === 'versions' && <VersionHistoryEditor {...editorProps} />}

            {/* Homepage */}
            {active === 'hero' && <HomeHeroEditor {...editorProps} />}
            {active === 'stats' && <HomeStatsEditor {...editorProps} />}
            {active === 'experiences' && <HomeExperiencesEditor {...editorProps} />}
            {active === 'tours' && <HomeToursEditor {...editorProps} />}
            {active === 'home-excursions' && <HomeExcursionsEditor {...editorProps} />}
            {active === 'reviews' && <HomeReviewsEditor {...editorProps} />}
            {active === 'gallery' && <HomeGalleryEditor {...editorProps} />}
            {active === 'whyus' && <HomeWhyUsEditor {...editorProps} />}
            {active === 'cta' && <HomeCTAEditor {...editorProps} />}
            {active === 'footer' && <HomeFooterEditor {...editorProps} />}

            {/* Safari Tours Page */}
            {active === 'tours-page-hero' && <ToursHeroEditor {...editorProps} />}
            {active === 'tours-page-list' && <ToursListEditor {...editorProps} />}
            {active === 'tours-page-booking' && <ToursBookingEditor {...editorProps} />}

            {/* Excursions Page */}
            {active === 'excursions-hero' && <ExcursionsHeroEditor {...editorProps} />}
            {active === 'excursions-list' && <ExcursionsListEditor {...editorProps} />}
            {active === 'excursions-booking' && <ExcursionsBookingEditor {...editorProps} />}

            {/* Transfers Page */}
            {active === 'transfers-hero' && <TransfersHeroEditor {...editorProps} />}
            {active === 'transfers-routes' && <TransfersRoutesEditor {...editorProps} />}
            {active === 'transfers-booking' && <TransfersBookingEditor {...editorProps} />}
            {active === 'transfers-fleet' && <TransfersFleetEditor {...editorProps} />}
            {active === 'transfers-faq' && <TransfersFAQEditor {...editorProps} />}

            {/* About Page */}
            {active === 'about-hero' && <AboutHeroEditor {...editorProps} />}
            {active === 'about-story' && <AboutStoryEditor {...editorProps} />}
            {active === 'about-values' && <AboutValuesEditor {...editorProps} />}
            {active === 'about-team' && <AboutTeamEditor {...editorProps} />}
            {active === 'about-impact' && <AboutImpactEditor {...editorProps} />}
            {active === 'about-cta' && <AboutCTAEditor {...editorProps} />}

            {/* Contact Page */}
            {active === 'contact-hero' && <ContactHeroEditor {...editorProps} />}
            {active === 'contact-details' && <ContactDetailsEditor {...editorProps} />}
            {active === 'contact-faq' && <ContactFAQEditor {...editorProps} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
