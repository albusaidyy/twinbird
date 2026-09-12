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
} from 'lucide-react';
import { uploadImage, getMediaLibrary, type MediaItem } from '../../actions';

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
            title="Upload new image from your device"
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
            <span className="block text-[9px] uppercase font-semibold text-muted-foreground tracking-wider truncate">Active Image</span>
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
