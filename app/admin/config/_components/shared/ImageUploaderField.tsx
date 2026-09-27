import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  Sparkles,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  uploadImage,
  uploadMultipleImages,
  getMediaLibrary,
  deleteUploadedImage,
  type MediaItem,
} from '../../actions';
import { optimizeImageToWebP, formatFileSize } from '@/lib/image-optimizer';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { getAllUsedImageUrls, isMediaItemInUse } from './admin-helpers';
import { ImageDeleteConfirmDialog } from './ImageDeleteConfirmDialog';

export function ImageUploaderField({
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
  const { config } = useAppConfig();
  const usedImageUrls = React.useMemo(
    () => (config ? getAllUsedImageUrls(config) : new Set<string>()),
    [config]
  );

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'global' | 'section' | 'local' | 'uploaded'>(
    folder && folder !== 'uploads' ? 'section' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllFolders, setShowAllFolders] = useState(true);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadImages = async (includeAll = true) => {
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

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    if (isMediaItemInUse(deletingItem, usedImageUrls) || value === deletingItem.url) {
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
        if (value === deletingItem.url) {
          onChange('');
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (fileList.length === 0) {
        setError('Please select valid image files');
        setUploading(false);
        return;
      }

      if (fileList.length === 1) {
        // Single file upload
        const { file: optimizedFile } = await optimizeImageToWebP(fileList[0], { folder });
        const formData = new FormData();
        formData.append('file', optimizedFile);
        const res = await uploadImage(formData, folder);
        if ('error' in res) {
          setError(res.error);
        } else if (res.url) {
          const newItem: MediaItem = {
            url: res.url,
            name: optimizedFile.name || res.url.split('/').pop() || 'uploaded-image',
            source: 'uploaded',
            folder,
            storagePath: res.storagePath,
            size: optimizedFile.size,
          };
          setMediaItems((prev) => [newItem, ...prev.filter((item) => item.url !== res.url)]);
          setShowLibrary(true);
          toast.success('Image uploaded to library. Click to select it when ready.');
        }
      } else {
        // Multiple files upload
        const formData = new FormData();
        for (const file of fileList) {
          try {
            const { file: optimizedFile } = await optimizeImageToWebP(file, { folder });
            formData.append('files', optimizedFile);
          } catch {
            formData.append('files', file);
          }
        }

        const res = await uploadMultipleImages(formData, folder);
        if (res.items && res.items.length > 0) {
          const newEntries: MediaItem[] = res.items.map((it) => ({
            url: it.url,
            name: it.name || it.url.split('/').pop() || 'uploaded-image',
            source: 'uploaded' as const,
            folder,
            storagePath: it.storagePath,
            size: it.size,
          }));

          setMediaItems((prev) => [
            ...newEntries,
            ...prev.filter((p) => !newEntries.some((n) => n.url === p.url)),
          ]);
          setShowLibrary(true);

          toast.success(
            `Uploaded ${res.items.length} images to library! Click any image to select it.`
          );
        }

        if (res.errors && res.errors.length > 0) {
          res.errors.forEach((err) => toast.error(err));
        }
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
  const globalCount = mediaItems.filter(
    (i) => i.source === 'uploaded' && (i.folder === 'uploads' || i.folder === 'global' || !i.folder)
  ).length;
  const sectionCount = mediaItems.filter((i) => i.folder === folder).length;

  const filteredItems = mediaItems.filter((item) => {
    if (filterTab === 'global') {
      if (item.source !== 'uploaded') return false;
      if (item.folder && item.folder !== 'uploads' && item.folder !== 'global') return false;
    } else if (filterTab === 'section') {
      if (item.folder !== folder) return false;
    } else if (filterTab === 'local') {
      if (item.source !== 'local') return false;
    } else if (filterTab === 'uploaded') {
      if (item.source !== 'uploaded') return false;
    }

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
    <div className="flex flex-col gap-2 w-full min-w-0 max-w-full">
      {/* Input & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full min-w-0">
        <div className="relative flex-1 min-w-0 w-full">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || uploading}
            className="w-full text-xs sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5 w-full sm:flex sm:w-auto sm:items-center sm:gap-2 shrink-0">
          {/* Upload Button */}
          <label
            htmlFor={`${id}-file`}
            className={`flex h-9 w-full sm:w-auto cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors ${
              disabled || uploading ? 'pointer-events-none opacity-50' : ''
            }`}
            title="Upload one or multiple images from your device"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span className="truncate">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Upload</span>
              </>
            )}
          </label>
          <input
            id={`${id}-file`}
            type="file"
            multiple
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
              if (!showLibrary) {
                loadImages(showAllFolders);
                if (folder && folder !== 'uploads') {
                  setFilterTab('section');
                }
              }
              setShowLibrary(!showLibrary);
            }}
            disabled={disabled}
            className="h-9 w-full sm:w-auto gap-1.5 px-2.5 sm:px-3 text-xs"
            title="Browse section image gallery"
          >
            <Images className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Library</span>
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Selected Image Preview Pill */}
      {value && (
        <div className="relative flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 p-1.5 sm:p-2 w-full min-w-0 max-w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-9 w-12 rounded object-cover border border-border bg-background shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="block text-[9px] uppercase font-semibold text-muted-foreground tracking-wider truncate">
                Active Image
              </span>
              {(() => {
                const active = mediaItems.find((i) => i.url === value);
                const sizeStr = active?.size ? formatFileSize(active.size) : null;
                return sizeStr ? (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ({sizeStr})
                  </span>
                ) : null;
              })()}
            </div>
            <p className="truncate text-[11px] font-mono text-foreground leading-tight">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-muted-foreground hover:text-destructive text-xs p-1 shrink-0 ml-1"
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
              <label
                htmlFor={`${id}-drawer-upload`}
                className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md text-white transition-opacity hover:opacity-90 cursor-pointer font-semibold shadow-xs ${
                  disabled || uploading ? 'pointer-events-none opacity-50' : ''
                }`}
                style={{ backgroundColor: config?.branding?.primaryColor || '#1b4332' }}
                title="Upload one or multiple images directly to library"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload Images
              </label>
              <input
                id={`${id}-drawer-upload`}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled || uploading}
              />
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
            <div className="flex flex-wrap items-center gap-1 bg-muted/50 p-0.5 rounded-lg border border-border/50 text-[11px]">
              {folder && folder !== 'uploads' && (
                <button
                  type="button"
                  onClick={() => setFilterTab('section')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    filterTab === 'section'
                      ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={`Images in ${folder}`}
                >
                  <Layers className="h-3 w-3" />
                  This Section ({sectionCount})
                </button>
              )}
              <button
                type="button"
                onClick={() => setFilterTab('global')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterTab === 'global'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Images uploaded to Global Library"
              >
                <Sparkles className="h-3 w-3" />
                Global Uploads ({globalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterTab === 'all'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
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
                    ? 'bg-background text-foreground shadow-xs font-semibold'
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
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Cloud className="h-3 w-3" />
                All Cloud ({uploadedCount})
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
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto overscroll-contain scroll-smooth p-1"
              style={{ scrollBehavior: 'smooth', overscrollBehavior: 'contain' }}
            >
              {filteredItems.map((item) => {
                const isSelected = value === item.url;
                const isInUse = isSelected || isMediaItemInUse(item, usedImageUrls);
                const canDelete = !isInUse && item.source === 'uploaded';
                const formattedSize = formatFileSize(item.size);

                return (
                  <div
                    key={item.url}
                    className={`group relative aspect-video rounded-md overflow-hidden border-2 transition-all bg-muted/40 transform-gpu ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border/60 hover:border-foreground/30'
                    }`}
                  >
                    {/* Clickable Image Selection Area */}
                    <button
                      type="button"
                      onClick={() => onChange(item.url)}
                      className="absolute inset-0 w-full h-full text-left cursor-pointer focus:outline-none"
                      aria-label={`Select ${item.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 transform-gpu"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>

                    {/* Top-Left: Source Badge */}
                    <div className="pointer-events-none absolute top-1.5 left-1.5 z-10">
                      <span
                        className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 leading-none rounded shadow-xs uppercase tracking-wider whitespace-nowrap inline-block ${
                          item.source === 'local'
                            ? 'bg-slate-900/80 text-slate-100'
                            : 'bg-blue-600/90 text-white'
                        }`}
                      >
                        {item.source === 'local' ? 'Local' : 'Upload'}
                      </span>
                    </div>

                    {/* Top Right: Selected Checkmark OR In-Use Badge OR Delete button */}
                    {isSelected ? (
                      <div className="pointer-events-none absolute top-1.5 right-1.5 z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background">
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
                      </div>
                    ) : isInUse ? (
                      <div
                        className="pointer-events-none absolute top-1.5 right-1.5 z-10 flex h-4.5 w-4.5 sm:h-auto sm:w-auto items-center justify-center rounded-full sm:rounded bg-emerald-600 text-white sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[9px] font-bold shadow-xs whitespace-nowrap uppercase tracking-wider shrink-0"
                        title="Currently selected in site configuration — cannot be deleted"
                      >
                        <Check className="h-2.5 w-2.5 sm:h-2.5 sm:w-2.5 stroke-[3] shrink-0" />
                        <span className="hidden sm:inline ml-0.5">In Use</span>
                      </div>
                    ) : canDelete ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingItem(item);
                        }}
                        disabled={disabled || uploading || isDeleting}
                        aria-label="Delete image"
                        className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white/90 hover:bg-destructive hover:text-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}

                    {/* Bottom Strip: Filename on Left, File Size on Right */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-5 pb-1.5 px-2 flex items-center justify-between gap-1.5">
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
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
