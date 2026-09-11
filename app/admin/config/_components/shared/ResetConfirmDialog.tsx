import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, Loader2 } from 'lucide-react';

export function ResetConfirmDialog({
  isOpen,
  isSaving,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  isSaving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Reset to Default Configuration?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will discard <strong>all your current settings</strong> and restore factory defaults.
              Before resetting, your current configuration will be <strong>saved as a version snapshot</strong> in the database so you can recover it if needed.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-300/50 bg-amber-50/60 dark:bg-amber-900/20 dark:border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-200 space-y-1">
          <p className="font-semibold flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> What happens:</p>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            <li>Your current config is snapshotted to <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">site_config_versions</code></li>
            <li>All settings are reset to system defaults</li>
            <li>The draft is <strong>not</strong> auto-saved — you must click <em>Save Changes</em> to persist the reset</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving} className="text-xs h-8">
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isSaving}
            className="text-xs h-8 gap-1.5"
          >
            {isSaving ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving snapshot…</>
            ) : (
              <><RotateCcw className="h-3.5 w-3.5" /> Yes, Reset to Defaults</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
