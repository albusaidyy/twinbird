'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Upload,
  Images,
  X,
  Search,
  Check,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  getMediaLibrary,
  uploadMultipleImages,
  type MediaItem,
} from '../../actions';
import { optimizeImageToWebP } from '@/lib/image-optimizer';
import { useAppConfig } from '@/components/providers/AppConfigProvider';

interface CarouselPhotosManagerProps {
  id?: string;
  images: string[] | undefined;
  fallbackImage?: string;
  onChange: (images: string[]) => void;
  folder?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
}

export function CarouselPhotosManager({
  id,
  images = [],
  fallbackImage = '/images/hero/hero.jpg',
  onChange,
  folder = 'tours',
  disabled = false,
  title = 'Carousel Photos',
  description = 'Manage photos shown in the hero carousel. Slide #1 serves as the cover photo.',
}: CarouselPhotosManagerProps) {
  const { config } = useAppConfig();
  const primaryColor = config?.branding?.primaryColor || '#1b4332';

  // Ensure working list
  const currentImages = images && images.length > 0 ? images : [fallbackImage];

  // Uploading & Library Modal States
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [selectedLibraryUrls, setSelectedLibraryUrls] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'section' | 'global'>('section');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [photoToDelete, setPhotoToDelete] = useState<{ index: number; url: string } | null>(null);
  const [isTileDragOver, setIsTileDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Load Media Library Items
  const loadMedia = async () => {
    setLoadingLibrary(true);
    try {
      const res = await getMediaLibrary(folder, true);
      setMediaItems(res.items);
    } catch {
      setMediaItems([]);
      toast.error('Failed to load media library');
    } finally {
      setLoadingLibrary(false);
    }
  };

  const openLibraryModal = (indexToReplace: number | null = null) => {
    setReplacingIndex(indexToReplace);
    setSelectedLibraryUrls([]);
    setIsLibraryOpen(true);
    loadMedia();
  };

  const closeLibraryModal = () => {
    setIsLibraryOpen(false);
    setReplacingIndex(null);
    setSelectedLibraryUrls([]);
  };

  // Reordering & Actions
  const moveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentImages.length) return;
    const updated = [...currentImages];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;
    onChange(updated);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const updated = [...currentImages];
    const [target] = updated.splice(index, 1);
    updated.unshift(target);
    onChange(updated);
    toast.success('Slide set as cover photo (#1)');
  };

  const requestRemoveSlide = (index: number, url: string) => {
    if (currentImages.length <= 1) {
      toast.error('A carousel must have at least one photo');
      return;
    }
    setPhotoToDelete({ index, url });
  };

  const confirmRemoveSlide = () => {
    if (!photoToDelete) return;
    const { index } = photoToDelete;
    const updated = currentImages.filter((_, i) => i !== index);
    onChange(updated);
    toast.success('Photo removed from carousel');
    setPhotoToDelete(null);
  };

  // File Uploading
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const optimizedFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const opt = await optimizeImageToWebP(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
        optimizedFiles.push(opt.file);
      }

      if (optimizedFiles.length === 0) {
        toast.error('No valid images to upload');
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('folder', folder);
      optimizedFiles.forEach((f) => formData.append('files', f));

      const res = await uploadMultipleImages(formData);
      if (res.items && res.items.length > 0) {
        const newUrls = res.items.map((r) => r.url);
        if (replacingIndex !== null && replacingIndex >= 0 && newUrls[0]) {
          const updated = [...currentImages];
          updated[replacingIndex] = newUrls[0];
          onChange(updated);
          toast.success('Photo replaced successfully');
          setReplacingIndex(null);
        } else {
          onChange([...currentImages, ...newUrls]);
          toast.success(`Added ${newUrls.length} photo${newUrls.length > 1 ? 's' : ''} to carousel`);
        }
      } else if (res.errors && res.errors.length > 0) {
        toast.error(res.errors[0] || 'Upload failed');
      }
    } catch {
      toast.error('Error uploading photos');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  // Library Selection Confirm
  const handleConfirmLibrarySelection = () => {
    if (replacingIndex !== null && replacingIndex >= 0) {
      if (selectedLibraryUrls.length > 0 && selectedLibraryUrls[0]) {
        const updated = [...currentImages];
        updated[replacingIndex] = selectedLibraryUrls[0];
        onChange(updated);
        toast.success('Photo replaced');
      }
    } else {
      if (selectedLibraryUrls.length > 0) {
        onChange([...currentImages, ...selectedLibraryUrls]);
        toast.success(`Added ${selectedLibraryUrls.length} photo${selectedLibraryUrls.length > 1 ? 's' : ''}`);
      }
    }
    closeLibraryModal();
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    if (replacingIndex !== null && replacingIndex >= 0) {
      const updated = [...currentImages];
      updated[replacingIndex] = trimmed;
      onChange(updated);
      toast.success('Photo replaced');
    } else {
      onChange([...currentImages, trimmed]);
      toast.success('Photo added to carousel');
    }
    setManualUrlInput('');
    setUrlModalOpen(false);
    setReplacingIndex(null);
  };

  // Library Filtering
  const filteredLibraryItems = mediaItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.url.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filterTab === 'section') {
      return (
        item.folder === folder ||
        item.url.includes(`/${folder}/`) ||
        item.url.includes(`/images/${folder}/`)
      );
    }
    if (filterTab === 'global') {
      return item.folder === 'uploads' || item.folder === 'global' || item.url.includes('/uploads/');
    }
    return true;
  });

  return (
    <div id={id} className="space-y-3 pt-2 border-t border-border/60">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Images className="h-3.5 w-3.5 text-primary" /> {title}
            </h5>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
              {currentImages.length} slide{currentImages.length === 1 ? '' : 's'}
            </span>
          </div>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openLibraryModal(null)}
            disabled={disabled || isUploading}
            className="h-7 text-xs gap-1.5 px-2.5 font-medium"
            title="Choose one or multiple photos from Media Library"
          >
            <Images className="h-3.5 w-3.5 text-primary" />
            Media Library
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="h-7 text-xs gap-1.5 px-2.5 font-medium"
            title="Upload new photo(s) from device"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5 text-emerald-600" />
            )}
            Upload
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setReplacingIndex(null);
              setManualUrlInput('');
              setUrlModalOpen(true);
            }}
            disabled={disabled || isUploading}
            className="h-7 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground"
            title="Add photo by URL"
          >
            <LinkIcon className="h-3 w-3" />
            URL
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUploadFiles(e.target.files)}
            disabled={disabled || isUploading}
          />
          <input
            ref={replaceFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUploadFiles(e.target.files)}
            disabled={disabled || isUploading}
          />
        </div>
      </div>

      {/* Visual Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {currentImages.map((imgUrl, idx) => {
          const isCover = idx === 0;
          return (
            <div
              key={`${imgUrl}-${idx}`}
              className={`group relative rounded-xl border overflow-hidden bg-muted/20 shadow-2xs transition-all flex flex-col justify-between ${
                isCover
                  ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-border/80 hover:border-border'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
                <Image
                  src={imgUrl || fallbackImage}
                  alt={`Carousel slide ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Badge: Cover or Slide Number */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                  {isCover ? (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs backdrop-blur-md"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                      Cover Slide
                    </span>
                  ) : (
                    <span className="flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white bg-black/60 shadow-xs backdrop-blur-md">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 z-20 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                  {/* Top action row */}
                  <div className="flex items-center justify-end gap-1">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => setAsCover(idx)}
                        disabled={disabled}
                        className="flex items-center gap-1 text-[10px] font-bold bg-white/20 hover:bg-emerald-600 text-white px-2 py-1 rounded-md transition-colors"
                        title="Set this image as Cover Slide (#1)"
                      >
                        <Star className="h-3 w-3 fill-white text-white" />
                        Make Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => requestRemoveSlide(idx, imgUrl)}
                      disabled={disabled || currentImages.length <= 1}
                      className="p-1 rounded-md bg-white/20 hover:bg-destructive text-white hover:text-white transition-colors"
                      title="Remove this photo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Middle action row: Replace */}
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openLibraryModal(idx)}
                      disabled={disabled}
                      className="flex items-center gap-1 text-[11px] font-semibold bg-white text-black px-2.5 py-1 rounded-md shadow-xs hover:bg-neutral-100 transition-colors"
                      title="Replace with an image from media library"
                    >
                      <Images className="h-3 w-3 text-primary" />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplacingIndex(idx);
                        replaceFileInputRef.current?.click();
                      }}
                      disabled={disabled}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors"
                      title="Upload a new photo for this slot"
                    >
                      <Upload className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Bottom action row: Reorder arrows */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => moveSlide(idx, idx - 1)}
                      disabled={disabled || idx === 0}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 transition-colors"
                      title="Move slide left"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] text-white/80 font-mono">
                      {idx + 1} of {currentImages.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveSlide(idx, idx + 1)}
                      disabled={disabled || idx === currentImages.length - 1}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 transition-colors"
                      title="Move slide right"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom detail pill */}
              <div className="p-1.5 px-2 bg-card border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="truncate max-w-[130px] font-mono" title={imgUrl}>
                  {imgUrl.split('/').pop() || 'slide.jpg'}
                </span>
                <span className="font-semibold text-[9px] uppercase tracking-wider text-muted-foreground/70">
                  {isCover ? 'Cover' : `#${idx + 1}`}
                </span>
              </div>
            </div>
          );
        })}

        {/* Inline "+ Add Slide" Dropzone Tile */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsTileDragOver(true);
          }}
          onDragLeave={() => setIsTileDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsTileDragOver(false);
            handleUploadFiles(e.dataTransfer.files);
          }}
          className={`aspect-[16/10] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all ${
            isTileDragOver
              ? 'border-primary bg-primary/10 scale-98'
              : 'border-border/80 hover:border-primary/50 bg-muted/15 hover:bg-muted/30'
          }`}
        >
          <div className="flex flex-col items-center gap-1.5 max-w-[140px]">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-foreground">Add Carousel Slide</span>
            <div className="flex items-center gap-1 mt-0.5">
              <button
                type="button"
                onClick={() => openLibraryModal(null)}
                disabled={disabled || isUploading}
                className="text-[10px] font-semibold text-primary underline underline-offset-2 hover:opacity-80"
              >
                Library
              </button>
              <span className="text-[10px] text-muted-foreground">•</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="text-[10px] font-semibold text-emerald-600 underline underline-offset-2 hover:opacity-80"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BATCH MEDIA LIBRARY MODAL ────────────────────────────────────── */}
      {isLibraryOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLibraryModal();
            }}
          >
            <div className="relative w-full max-w-4xl max-h-[88vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Images className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {replacingIndex !== null
                        ? `Replace Carousel Slide #${replacingIndex + 1}`
                        : 'Add Photos to Carousel'}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {replacingIndex !== null
                        ? 'Select an image to replace this slide.'
                        : 'Select one or multiple photos to add to the carousel.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="modal-file-upload"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 shadow-xs transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isUploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    Upload New
                  </label>
                  <input
                    id="modal-file-upload"
                    type="file"
                    multiple={replacingIndex === null}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadFiles(e.target.files)}
                    disabled={isUploading}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={closeLibraryModal}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="p-3 border-b border-border flex flex-wrap items-center justify-between gap-2.5 bg-background">
                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterTab('section')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-all ${
                      filterTab === 'section'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Layers className="h-3 w-3" />
                    {folder.charAt(0).toUpperCase() + folder.slice(1)} ({mediaItems.filter((i) => i.folder === folder).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab('global')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-all ${
                      filterTab === 'global'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    Global ({mediaItems.filter((i) => i.folder === 'uploads' || i.folder === 'global').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab('all')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      filterTab === 'all'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All ({mediaItems.length})
                  </button>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search images..."
                    className="pl-8 h-8 text-xs bg-muted/30"
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

              {/* Grid of Images */}
              <div className="flex-1 overflow-y-auto p-4 min-h-[300px] max-h-[50vh]">
                {loadingLibrary ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <span className="text-xs font-medium">Loading photos...</span>
                  </div>
                ) : filteredLibraryItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center space-y-2">
                    <Images className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-xs font-medium">No images found.</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      Upload photos directly or clear your search query.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredLibraryItems.map((item) => {
                      const isSelected = selectedLibraryUrls.includes(item.url);
                      return (
                        <div
                          key={item.url}
                          onClick={() => {
                            if (replacingIndex !== null) {
                              setSelectedLibraryUrls([item.url]);
                            } else {
                              setSelectedLibraryUrls((prev) =>
                                prev.includes(item.url)
                                  ? prev.filter((u) => u !== item.url)
                                  : [...prev, item.url]
                              );
                            }
                          }}
                          className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-muted/20 shadow-2xs transition-all ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/40 shadow-xs scale-98'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                            <Image
                              src={item.url}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {/* Checkmark badge */}
                            <div className="absolute top-1.5 right-1.5 z-10">
                              {isSelected ? (
                                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-white/80 bg-black/30 group-hover:bg-black/50 transition-colors" />
                              )}
                            </div>
                            {/* Source badge */}
                            <div className="absolute bottom-1.5 left-1.5 z-10">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                                {item.source === 'uploaded' ? 'Cloud' : 'Local'}
                              </span>
                            </div>
                          </div>
                          <div className="p-1.5 bg-card text-[10px] text-muted-foreground truncate border-t border-border/50">
                            {item.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 px-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {selectedLibraryUrls.length > 0 ? (
                    <span className="font-semibold text-foreground">
                      {selectedLibraryUrls.length} photo{selectedLibraryUrls.length === 1 ? '' : 's'} selected
                    </span>
                  ) : (
                    <span>Click photos to select</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={closeLibraryModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={selectedLibraryUrls.length === 0}
                    onClick={handleConfirmLibrarySelection}
                    className="h-8 text-xs font-semibold text-white gap-1.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {replacingIndex !== null
                      ? 'Confirm Replacement'
                      : `Add ${selectedLibraryUrls.length > 0 ? selectedLibraryUrls.length : ''} Photos`}
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── MANUAL URL MODAL ───────────────────────────────────────────── */}
      {urlModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setUrlModalOpen(false);
            }}
          >
            <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h5 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-4 w-4 text-primary" /> Add Photo by URL
                </h5>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => setUrlModalOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Image URL</label>
                <Input
                  type="url"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg or /images/..."
                  className="h-9 text-xs"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setUrlModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!manualUrlInput.trim()}
                  onClick={handleAddManualUrl}
                  className="h-8 text-xs font-semibold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Add Photo
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── PHOTO DELETE CONFIRMATION DIALOG ──────────────────────────── */}
      {photoToDelete !== null &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPhotoToDelete(null);
            }}
          >
            <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-full shrink-0 bg-destructive/15 text-destructive">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="space-y-1 pr-4">
                  <h3 className="text-base font-semibold text-foreground">
                    Remove Photo from Carousel?
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Are you sure you want to remove this photo from the carousel? It will no longer appear in the hero gallery on the website.
                  </p>
                </div>
              </div>

              {/* Photo Preview Thumbnail */}
              <div className="rounded-xl border border-border bg-muted/40 p-3 flex items-center gap-3.5">
                <div className="relative h-16 w-24 rounded-lg border border-border/80 bg-background overflow-hidden shrink-0">
                  <Image
                    src={photoToDelete.url || fallbackImage}
                    alt="Photo to remove"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {photoToDelete.index === 0 ? 'Cover Slide (#1)' : `Slide #${photoToDelete.index + 1}`}
                    </span>
                    {photoToDelete.index === 0 && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground truncate" title={photoToDelete.url}>
                    {photoToDelete.url.split('/').pop() || photoToDelete.url}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80">
                    The file remains safely saved in your media library.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPhotoToDelete(null)}
                  className="text-xs h-8 px-3"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={confirmRemoveSlide}
                  className="text-xs h-8 px-3.5 gap-1.5 font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Photo
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
