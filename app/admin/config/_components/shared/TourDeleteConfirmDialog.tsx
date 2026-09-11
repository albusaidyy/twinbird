import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function TourDeleteConfirmDialog({
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
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
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
              {isPermanent ? 'Permanently Delete Safari Package?' : 'Soft-Delete Safari Package?'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isPermanent ? (
                <>
                  Are you sure you want to permanently delete <strong className="text-foreground">{tourTitle}</strong>? This action <span className="font-semibold text-destructive">cannot be undone</span> and will completely erase this safari package from both the Featured Safaris and Safaris Listing.
                </>
              ) : (
                <>
                  Are you sure you want to soft-delete <strong className="text-foreground">{tourTitle}</strong>? It will become <span className="font-semibold text-foreground">inactive and greyed out</span> on both the Featured Safaris and Safaris Listing, and will be hidden from public visitors. You can restore it anytime or permanently delete it later.
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
