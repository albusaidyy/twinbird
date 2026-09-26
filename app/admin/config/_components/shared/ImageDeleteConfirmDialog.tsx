import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';

import { formatFileSize } from '@/lib/image-optimizer';

export function ImageDeleteConfirmDialog({
  isOpen,
  imageName,
  imageUrl,
  imageSize,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  imageName: string;
  imageUrl: string;
  imageSize?: number;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
    >
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none"
          title="Close"
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-full shrink-0 bg-destructive/15 text-destructive">
            <Trash2 className="h-5 w-5" />
          </div>
          <div className="space-y-1 pr-4">
            <h3 className="text-base font-semibold text-foreground">
              Delete Uploaded Image?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This action will permanently delete this image from Supabase Storage. You can then re-upload an optimized WebP version.
            </p>
          </div>
        </div>

        {/* Image Preview Thumbnail */}
        {imageUrl && (
          <div className="rounded-lg border border-border bg-muted/40 p-2.5 flex items-center gap-3">
            <div className="h-16 w-20 rounded border border-border/80 bg-background overflow-hidden shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageName || 'Image preview'}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden space-y-0.5">
              <p className="text-xs font-medium text-foreground truncate" title={imageName}>
                {imageName || 'uploaded-image'}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground truncate" title={imageUrl}>
                {imageUrl}
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                {imageSize && formatFileSize(imageSize) && (
                  <span className="inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-foreground border border-border/60">
                    {formatFileSize(imageSize)}
                  </span>
                )}
                <span className="inline-block text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Permanent deletion
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Warning callout */}
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-snug">
            Any sections or pages actively referencing this image URL will lose their source until updated with a new image.
          </p>
        </div>

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isDeleting}
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="text-xs h-8 gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Delete Image
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
