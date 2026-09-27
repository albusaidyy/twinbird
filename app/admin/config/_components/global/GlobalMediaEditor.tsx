'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Upload,
  Loader2,
  X,
  Images,
  Check,
  RefreshCw,
  Search,
  HardDrive,
  Cloud,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMediaLibrary,
  uploadMultipleImages,
  deleteUploadedImage,
  type MediaItem,
} from '../../actions';
import { optimizeImageToWebP, formatFileSize } from '@/lib/image-optimizer';
import { ImageDeleteConfirmDialog } from '../shared/ImageDeleteConfirmDialog';
import { getAllUsedImageUrls, isMediaItemInUse } from '../shared/admin-helpers';
import type { EditorProps } from '../shared/types';

interface FileUploadProgress {
  id: string;
  name: string;
  originalSize: number;
  optimizedSize?: number;
  status: 'optimizing' | 'uploading' | 'success' | 'error';
  url?: string;
  errorMessage?: string;
}

const COMMON_FOLDERS = [
  { value: 'uploads', label: 'Global Uploads (Default)' },
  { value: 'hero', label: 'Hero Banners' },
  { value: 'tours', label: 'Safaris & Tours' },
  { value: 'excursions', label: 'Day Excursions' },
  { value: 'gallery', label: 'Catch Photo Gallery' },
  { value: 'whyus', label: 'Why Choose Us' },
  { value: 'about', label: 'About Us' },
  { value: 'team', label: 'Team Members' },
  { value: 'transfers', label: 'Transfers Fleet' },
  { value: 'brand/logos', label: 'Brand & Logos' },
];

export function GlobalMediaEditor({ draft }: EditorProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetFolder, setTargetFolder] = useState<string>('uploads');
  const [filterTab, setFilterTab] = useState<'all' | 'in-use' | 'global' | 'uploaded' | 'local'>('all');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'size-desc' | 'size-asc'>('newest');

  // Compute all in-use image URLs from draft config
  const usedImageUrls = React.useMemo(() => getAllUsedImageUrls(draft), [draft]);

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<FileUploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview & Delete state
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await getMediaLibrary('uploads', true);
      setMediaItems(res.items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch media library';
      toast.error(msg);
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getMediaLibrary('uploads', true)
      .then((res) => {
        if (!cancelled) {
          setMediaItems(res.items);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to fetch media library';
          toast.error(msg);
          setMediaItems([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success('Image URL copied to clipboard');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    if (isMediaItemInUse(deletingItem, usedImageUrls)) {
      toast.error('This image is currently in use across your website configuration and cannot be deleted.');
      setDeletingItem(null);
      return;
    }
    setIsDeleting(true);
    try {
      const pathToDelete = deletingItem.storagePath || deletingItem.url;
      const res = await deleteUploadedImage(pathToDelete);
      if ('error' in res) {
        toast.error(res.error || 'Failed to delete image');
      } else {
        toast.success('Image permanently deleted from storage');
        setMediaItems((prev) => prev.filter((item) => item.url !== deletingItem.url));
        if (previewItem?.url === deletingItem.url) {
          setPreviewItem(null);
        }
        setDeletingItem(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete image';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Upload handler for single or multiple files
  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WebP, SVG, etc.)');
      return;
    }

    setIsUploading(true);
    const initialQueue: FileUploadProgress[] = fileArray.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${file.name}`,
      name: file.name,
      originalSize: file.size,
      status: 'optimizing',
    }));
    setUploadQueue(initialQueue);

    const optimizedFiles: { file: File; id: string; origSize: number; optSize: number }[] = [];

    // Step 1: Optimize images client-side
    for (let i = 0; i < fileArray.length; i++) {
      const f = fileArray[i];
      const qId = initialQueue[i].id;
      try {
        const { file: optimizedFile, originalSize, optimizedSize } = await optimizeImageToWebP(f, {
          folder: targetFolder,
        });

        optimizedFiles.push({
          file: optimizedFile,
          id: qId,
          origSize: originalSize,
          optSize: optimizedSize,
        });

        setUploadQueue((prev) =>
          prev.map((item) =>
            item.id === qId
              ? { ...item, status: 'uploading', optimizedSize }
              : item
          )
        );
      } catch {
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.id === qId
              ? { ...item, status: 'error', errorMessage: 'Optimization failed' }
              : item
          )
        );
      }
    }

    // Step 2: Upload to Supabase Storage
    if (optimizedFiles.length > 0) {
      const formData = new FormData();
      optimizedFiles.forEach((opt) => {
        formData.append('files', opt.file);
      });

      try {
        const result = await uploadMultipleImages(formData, targetFolder);

        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((err) => toast.error(err));
        }

        if (result.items && result.items.length > 0) {
          const newMediaItems: MediaItem[] = result.items.map((it) => ({
            url: it.url,
            name: it.name || it.url.split('/').pop() || 'uploaded-image',
            source: 'uploaded',
            folder: targetFolder,
            storagePath: it.storagePath,
            size: it.size,
          }));

          // Update queue with success
          setUploadQueue((prev) =>
            prev.map((q) => {
              const matched = result.items.find((r) => r.name === q.name);
              if (matched) {
                return { ...q, status: 'success', url: matched.url };
              }
              return q;
            })
          );

          // Add to current media library at top
          setMediaItems((prev) => [
            ...newMediaItems,
            ...prev.filter((p) => !newMediaItems.some((n) => n.url === p.url)),
          ]);

          toast.success(
            `Successfully uploaded and optimized ${result.items.length} ${
              result.items.length === 1 ? 'image' : 'images'
            } to the Global Library!`
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        toast.error(msg);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Compute counts
  const totalCount = mediaItems.length;
  const localCount = mediaItems.filter((i) => i.source === 'local').length;
  const uploadedCount = mediaItems.filter((i) => i.source === 'uploaded').length;
  const inUseCount = mediaItems.filter((i) => isMediaItemInUse(i, usedImageUrls)).length;
  const globalUploadsCount = mediaItems.filter(
    (i) => i.source === 'uploaded' && (i.folder === 'uploads' || i.folder === 'global' || !i.folder)
  ).length;

  // Extract unique folders for folder filter dropdown
  const uniqueFolders = Array.from(
    new Set(
      mediaItems
        .map((i) => i.folder || (i.source === 'local' ? 'local' : 'uploads'))
        .filter(Boolean)
    )
  ).sort();

  // Filter & Sort
  const filteredItems = mediaItems
    .filter((item) => {
      // Tab filter
      if (filterTab === 'in-use') {
        if (!isMediaItemInUse(item, usedImageUrls)) return false;
      } else if (filterTab === 'global') {
        if (item.source !== 'uploaded') return false;
        if (item.folder && item.folder !== 'uploads' && item.folder !== 'global') return false;
      } else if (filterTab === 'uploaded') {
        if (item.source !== 'uploaded') return false;
      } else if (filterTab === 'local') {
        if (item.source !== 'local') return false;
      }

      // Folder dropdown filter
      if (folderFilter !== 'all') {
        const itemF = item.folder || (item.source === 'local' ? 'local' : 'uploads');
        if (itemF !== folderFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.url.toLowerCase().includes(q) ||
          (item.folder && item.folder.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'size-desc') {
        return (b.size || 0) - (a.size || 0);
      }
      if (sortBy === 'size-asc') {
        return (a.size || 0) - (b.size || 0);
      }
      // default: newest first (uploaded before local)
      if (a.source === 'uploaded' && b.source !== 'uploaded') return -1;
      if (b.source === 'uploaded' && a.source !== 'uploaded') return 1;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* ── Summary & Overview Header ───────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Images className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-foreground">Global Media & Uploads</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Upload, optimize, and manage media across your entire web application. All images uploaded
              here are automatically compressed to WebP and immediately accessible via the{' '}
              <strong className="text-foreground">Global Uploads</strong> tab in every image selection
              drawer across the app.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchMedia}
              disabled={loading}
              className="gap-1.5 text-xs h-8"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stat Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 pt-4 border-t border-border/60">
          <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Media Files
            </span>
            <p className="text-lg font-bold text-foreground">{totalCount}</p>
          </div>

          <div className="rounded-lg bg-emerald-500/5 dark:bg-emerald-950/20 p-2.5 border border-emerald-500/20">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Active in Site
            </span>
            <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              {inUseCount}
            </p>
          </div>

          <div className="rounded-lg bg-emerald-500/5 dark:bg-emerald-950/20 p-2.5 border border-emerald-500/20">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Global Uploads
            </span>
            <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              {globalUploadsCount}
            </p>
          </div>

          <div className="rounded-lg bg-blue-500/5 dark:bg-blue-950/20 p-2.5 border border-blue-500/20">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              All Cloud Uploads
            </span>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{uploadedCount}</p>
          </div>

          <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Local Bundled Assets
            </span>
            <p className="text-lg font-bold text-foreground">{localCount}</p>
          </div>
        </div>
      </div>

      {/* ── Multi-File Upload Zone ───────────────────────────── */}
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10 p-3.5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-white text-xs font-bold shadow-xs shrink-0"
              style={{ backgroundColor: draft.branding.primaryColor || '#1b4332' }}
            >
              <Upload className="h-3.5 w-3.5" />
            </span>
            <h4 className="text-sm font-bold text-foreground">Upload Images (Single or Multiple)</h4>
          </div>

          {/* Target Folder Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
            <Label htmlFor="target-folder" className="text-xs text-muted-foreground shrink-0 font-medium">
              Save to folder:
            </Label>
            <select
              id="target-folder"
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              className="h-8 flex-1 sm:flex-initial w-full sm:w-auto min-w-0 max-w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-xs focus:outline-none focus:ring-1 focus:ring-primary truncate"
            >
              {COMMON_FOLDERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed transition-all p-5 sm:p-8 text-center flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-primary bg-primary/20 scale-[1.005]'
              : 'border-border/80 bg-background/80 hover:bg-background hover:border-primary/60'
          }`}
          style={{
            borderColor: isDragging ? draft.branding.primaryColor : undefined,
          }}
        >
          <div
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white shadow-xs"
            style={{ backgroundColor: draft.branding.primaryColor || '#1b4332' }}
          >
            <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Click to select one or multiple images, or drag &amp; drop them here
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports selecting multiple images at once (PNG, JPG, WebP, SVG, AVIF). All images are
              automatically converted to lightweight WebP before uploading.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={isUploading}
            className="mt-1 gap-1.5 text-xs font-semibold pointer-events-none text-white shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: draft.branding.primaryColor || '#1b4332' }}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading in progress...
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" /> Browse Multiple Images
              </>
            )}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processFiles(e.target.files);
              }
            }}
          />
        </div>

        {/* Upload Queue Progress */}
        {uploadQueue.length > 0 && (
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-card p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                )}
                Upload Queue ({uploadQueue.filter((q) => q.status === 'success').length} /{' '}
                {uploadQueue.length} completed)
              </span>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => setUploadQueue([])}
                  className="text-muted-foreground hover:text-foreground text-[11px] underline"
                >
                  Clear queue
                </button>
              )}
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pt-1">
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-muted/30 p-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.status === 'optimizing' && (
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 animate-pulse" />
                    )}
                    {item.status === 'uploading' && (
                      <Loader2 className="h-3.5 w-3.5 text-primary shrink-0 animate-spin" />
                    )}
                    {item.status === 'success' && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    )}
                    {item.status === 'error' && (
                      <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    )}

                    <span className="truncate font-medium text-foreground">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.optimizedSize ? (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {formatFileSize(item.originalSize)} &rarr;{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {formatFileSize(item.optimizedSize)}
                        </strong>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {formatFileSize(item.originalSize)}
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        item.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'error'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Media Explorer & Gallery Grid ───────────────────── */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
        {/* Filter Tabs & Search Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Main Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                filterTab === 'all'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('in-use')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                filterTab === 'in-use'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Images currently selected anywhere in the site configuration"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active in Site ({inUseCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('global')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                filterTab === 'global'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Global Uploads ({globalUploadsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('uploaded')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                filterTab === 'uploaded'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Cloud className="h-3.5 w-3.5" />
              All Cloud ({uploadedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('local')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                filterTab === 'local'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <HardDrive className="h-3.5 w-3.5" />
              Local Assets ({localCount})
            </button>
          </div>

          {/* Search, Folder Filter & Sort */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[150px] sm:min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, folder..."
                className="h-8 pl-8 pr-7 text-xs"
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

            {/* Folder Filter Dropdown */}
            <div className="flex items-center gap-1">
              <FolderOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <select
                value={folderFilter}
                onChange={(e) => setFolderFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus:outline-none"
              >
                <option value="all">All Folders</option>
                {uniqueFolders.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'name' | 'size-desc' | 'size-asc')}
                className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="size-desc">Largest Size</option>
                <option value="size-asc">Smallest Size</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Image Grid Content ─────────────────────────────── */}
        {loading ? (
          <div className="flex h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Loading media files...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground space-y-3">
            <Images className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="font-medium text-foreground">No media files found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query, selecting another category tab, or uploading new images above.
            </p>
            {searchQuery && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="text-xs"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div
            className="h-[65vh] min-h-[460px] max-h-[720px] overflow-y-auto overscroll-contain scroll-smooth p-1.5 sm:p-2.5 rounded-xl border border-border/60 bg-muted/20 shadow-inner"
            style={{
              scrollBehavior: 'smooth',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {filteredItems.map((item) => {
              const formattedSize = formatFileSize(item.size);
              const isCopied = copiedUrl === item.url;
              const isInUse = isMediaItemInUse(item, usedImageUrls);
              const canDelete = item.source === 'uploaded' && !isInUse;
              const isGlobalUpload = item.folder === 'uploads' || item.folder === 'global';

              return (
                <div
                  key={item.url}
                  className="group relative aspect-video rounded-lg overflow-hidden border border-border bg-muted/40 shadow-xs hover:border-primary/60 hover:shadow-md transition-all flex flex-col transform-gpu"
                >
                  {/* Thumbnail Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 transform-gpu"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="gray"><rect width="100" height="100"/></svg>';
                    }}
                  />

                  {/* Top-Left: Category/Folder Badge */}
                  <div className="pointer-events-none absolute top-1.5 left-1.5 z-10">
                    <span
                      className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 leading-none rounded shadow-xs uppercase tracking-wider whitespace-nowrap inline-block ${
                        item.source === 'local'
                          ? 'bg-slate-900/85 text-slate-100'
                          : isGlobalUpload
                          ? 'bg-emerald-600 text-white font-extrabold'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.source === 'local'
                        ? 'Local'
                        : isGlobalUpload
                        ? 'Global'
                        : item.folder || 'Upload'}
                    </span>
                  </div>

                  {/* Top-Right: In-Use Indicator & Action Buttons */}
                  <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1">
                    {isInUse && (
                      <span
                        className="pointer-events-none flex h-4.5 w-4.5 sm:h-auto sm:w-auto items-center justify-center rounded-full sm:rounded shadow-xs bg-emerald-600 text-white sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0"
                        title="Currently active in site configuration — cannot be deleted"
                      >
                        <Check className="h-2.5 w-2.5 sm:h-2.5 sm:w-2.5 stroke-[3] shrink-0" />
                        <span className="hidden sm:inline ml-0.5">In Use</span>
                      </span>
                    )}

                    {/* Action buttons (Top Right on hover / touch) */}
                    <div className="pointer-events-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(item.url);
                        }}
                        className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-black/70 text-white hover:bg-primary shadow-xs transition-colors cursor-pointer"
                        title="Copy direct image URL"
                      >
                        {isCopied ? (
                          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-400 stroke-[3]" />
                        ) : (
                          <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        )}
                      </button>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingItem(item);
                          }}
                          disabled={isDeleting}
                          className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-black/70 text-white hover:bg-destructive shadow-xs transition-colors cursor-pointer"
                          title="Delete image permanently"
                        >
                          <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom Strip: Filename on Left, File Size on Right */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="cursor-pointer absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-5 pb-1.5 px-2 flex items-center justify-between gap-1.5"
                  >
                    <p className="truncate text-[9.5px] sm:text-[10px] font-medium text-white/95 drop-shadow-xs min-w-0">
                      {item.name}
                    </p>
                    {formattedSize && (
                      <span
                        className={`text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs shrink-0 leading-none ${
                          (item.size ?? 0) > 1024 * 1024
                            ? 'bg-amber-500/90 text-black font-bold'
                            : 'bg-black/60 text-white/90 font-medium backdrop-blur-xs'
                        }`}
                      >
                        {formattedSize}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>

      {/* ── Image Details & Full Preview Modal ──────────────── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-sm text-foreground truncate">
                  {previewItem.name}
                </span>
                <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase">
                  {previewItem.source}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-video max-h-[60vh] rounded-lg overflow-hidden border border-border bg-black/20 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Folder: <strong className="text-foreground">{previewItem.folder || 'uploads'}</strong></span>
                {previewItem.size && (
                  <span>Size: <strong className="text-foreground">{formatFileSize(previewItem.size)}</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={previewItem.url}
                  className="h-8 font-mono text-xs flex-1 bg-muted/40"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyUrl(previewItem.url)}
                  className="h-8 gap-1 text-xs shrink-0"
                >
                  {copiedUrl === previewItem.url ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy URL
                    </>
                  )}
                </Button>
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground hover:text-foreground"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Permanent Delete Dialog ─────────────────────────── */}
      <ImageDeleteConfirmDialog
        isOpen={!!deletingItem}
        imageName={deletingItem?.name || ''}
        imageUrl={deletingItem?.url || ''}
        imageSize={deletingItem?.size}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setDeletingItem(null);
        }}
      />
    </div>
  );
}
