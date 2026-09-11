import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import type { AppConfig } from '@/types/app-config';
import type { EditorProps } from '../shared/types';
import {
  getConfigVersions,
  getConfigVersion,
  saveConfigVersion,
  restoreConfigVersion,
  deleteConfigVersion,
  type ConfigVersionSummary,
} from '../../actions';
import {
  History,
  CheckCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  Plus,
  Loader2,
  Clock,
  Users,
  Eye,
  RotateCcw,
  Trash2,
  X,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';

export function VersionHistoryEditor({ draft, set }: EditorProps) {
  const { updateConfig } = useAppConfig();
  const [versions, setVersions] = useState<ConfigVersionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Manual snapshot state
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);

  // Inspect state
  const [inspectTarget, setInspectTarget] = useState<ConfigVersionSummary | null>(null);
  const [inspectConfig, setInspectConfig] = useState<AppConfig | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Restore state
  const [restoreTarget, setRestoreTarget] = useState<ConfigVersionSummary | null>(null);
  const [restoring, setRestoring] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ConfigVersionSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVersions = async () => {
    try {
      const data = await getConfigVersions();
      setVersions(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch version history';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getConfigVersions();
        if (active) {
          setVersions(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (active) {
          const message = err instanceof Error ? err.message : 'Failed to fetch version history';
          setError(message);
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleCreateSnapshot = async () => {
    if (creatingSnapshot) return;
    setCreatingSnapshot(true);
    setError(null);
    try {
      const label = snapshotLabel.trim() || `Manual snapshot — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}`;
      const res = await saveConfigVersion(draft, label);
      if ('error' in res) {
        setError(res.error);
      } else {
        setSuccessMsg('Snapshot created successfully!');
        setSnapshotLabel('');
        setIsSnapshotModalOpen(false);
        await fetchVersions();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create snapshot';
      setError(message);
    } finally {
      setCreatingSnapshot(false);
    }
  };

  const handleInspect = async (v: ConfigVersionSummary) => {
    setInspectTarget(v);
    setInspectConfig(null);
    setInspectLoading(true);
    setCopiedJson(false);
    try {
      const cfg = await getConfigVersion(v.id);
      setInspectConfig(cfg);
    } catch {
      // ignore
    } finally {
      setInspectLoading(false);
    }
  };

  const handleRestore = async (v: ConfigVersionSummary) => {
    setRestoring(true);
    setError(null);
    try {
      const res = await restoreConfigVersion(v.id, draft);
      if ('error' in res) {
        setError(res.error);
      } else if (res.success && res.config) {
        // Update both local draft and global context
        set(() => res.config);
        updateConfig(res.config);

        setSuccessMsg(
          `Version restored successfully! A safety backup snapshot of your previous configuration was saved.`
        );
        setRestoreTarget(null);
        setInspectTarget(null);
        await fetchVersions();
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to restore configuration';
      setError(message);
    } finally {
      setRestoring(false);
    }
  };

  const handleDelete = async (v: ConfigVersionSummary) => {
    setDeleting(true);
    setError(null);
    try {
      const res = await deleteConfigVersion(v.id);
      if ('error' in res) {
        setError(res.error);
      } else {
        setSuccessMsg('Snapshot deleted successfully.');
        setDeleteTarget(null);
        await fetchVersions();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete snapshot';
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredVersions = useMemo(() => {
    if (!search.trim()) return versions;
    const q = search.toLowerCase();
    return versions.filter(
      (v) =>
        (v.label && v.label.toLowerCase().includes(q)) ||
        (v.created_by && v.created_by.toLowerCase().includes(q)) ||
        v.id.toLowerCase().includes(q)
    );
  }, [versions, search]);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getBadgeType = (label: string | null) => {
    if (!label) return { text: 'Snapshot', className: 'bg-muted text-muted-foreground' };
    const l = label.toLowerCase();
    if (l.includes('auto-backup') || l.includes('before restoring')) {
      return { text: 'Safety Backup', className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' };
    }
    if (l.includes('reset')) {
      return { text: 'Pre-Reset', className: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30' };
    }
    return { text: 'Manual', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' };
  };

  return (
    <div className="space-y-6">
      {/* Success banner */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 p-4 text-sm text-emerald-800 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="flex-1">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-7 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* Safety info card */}
      <div className="rounded-xl border border-border bg-accent/30 p-4 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <History className="h-4 w-4 text-primary" />
          <span>Automated Configuration Snapshots</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Snapshots preserve full site configurations across branding, page layouts, safari packages, and booking forms.
          Whenever you <strong>restore</strong> a version or <strong>reset to defaults</strong>, the system automatically takes a safety backup of the active configuration beforehand.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snapshots by label or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchVersions}
            disabled={loading}
            className="h-9 gap-1.5 text-xs"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSnapshotLabel(`Snapshot — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}`);
              setIsSnapshotModalOpen(true);
            }}
            className="h-9 gap-1.5 text-xs text-white"
            style={{ backgroundColor: draft.branding.primaryColor }}
          >
            <Plus className="h-3.5 w-3.5" />
            Take Snapshot Now
          </Button>
        </div>
      </div>

      {/* Versions List */}
      <div className="space-y-3">
        {loading && versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border rounded-xl bg-card">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm">Loading version history…</p>
          </div>
        ) : filteredVersions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-card space-y-3 p-6">
            <History className="h-10 w-10 text-muted-foreground/50" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                {search ? 'No matching snapshots found' : 'No snapshots saved yet'}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                {search
                  ? `No snapshots matched "${search}". Try clearing your search filter.`
                  : 'Create your first snapshot to save the current site configuration as a restore point.'}
              </p>
            </div>
            {!search && (
              <Button
                size="sm"
                onClick={() => {
                  setSnapshotLabel(`Initial snapshot — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}`);
                  setIsSnapshotModalOpen(true);
                }}
                className="gap-1.5 text-xs text-white mt-2"
                style={{ backgroundColor: draft.branding.primaryColor }}
              >
                <Plus className="h-3.5 w-3.5" />
                Create First Snapshot
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border bg-card overflow-hidden">
            {filteredVersions.map((v) => {
              const badge = getBadgeType(v.label);
              return (
                <div
                  key={v.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-accent/40 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                        {badge.text}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {v.label || 'Unnamed Snapshot'}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(v.created_at)}
                      </span>
                      {v.created_by && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {v.created_by}
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-muted-foreground/70">
                        ID: {v.id.slice(0, 8)}…
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInspect(v)}
                      className="h-8 px-2.5 text-xs gap-1.5"
                      title="Inspect Snapshot Details"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      Inspect
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRestoreTarget(v)}
                      className="h-8 px-2.5 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
                      title="Restore this version"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(v)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete snapshot"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal: Create Snapshot ────────────────────────────────────────── */}
      {isSnapshotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Create Configuration Snapshot
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsSnapshotModalOpen(false)}
                disabled={creatingSnapshot}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Save the current live & editor settings into a version snapshot. You can restore back to this point at any time.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="snapshot-lbl">Snapshot Label</Label>
              <Input
                id="snapshot-lbl"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
                placeholder="e.g. Before changing season prices & hero headline"
                className="text-xs"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSnapshotModalOpen(false)}
                disabled={creatingSnapshot}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCreateSnapshot}
                disabled={creatingSnapshot}
                className="text-xs h-8 gap-1.5 text-white"
                style={{ backgroundColor: draft.branding.primaryColor }}
              >
                {creatingSnapshot ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Save Snapshot
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Inspect Snapshot ───────────────────────────────────────── */}
      {inspectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b flex items-center justify-between shrink-0 bg-muted/40">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-primary" />
                  Snapshot Details: {inspectTarget.label || 'Unnamed'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Saved on {formatDate(inspectTarget.created_at)}
                  {inspectTarget.created_by ? ` by ${inspectTarget.created_by}` : ''}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setInspectTarget(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {inspectLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-xs">Loading snapshot data…</p>
                </div>
              ) : inspectConfig ? (
                <div className="space-y-4">
                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">App Name</span>
                      <p className="text-xs font-bold text-foreground truncate">{inspectConfig.branding?.appName || '—'}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Theme Color</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border shrink-0"
                          style={{ backgroundColor: inspectConfig.branding?.primaryColor || '#000' }}
                        />
                        <p className="text-xs font-mono font-medium truncate">{inspectConfig.branding?.primaryColor || '—'}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Safari Packages</span>
                      <p className="text-xs font-bold text-foreground">
                        {inspectConfig.toursPage?.tours?.items?.length || inspectConfig.homepage?.tours?.items?.length || 0} packages
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Nav Links</span>
                      <p className="text-xs font-bold text-foreground">
                        {inspectConfig.navigation?.length || 0} items
                      </p>
                    </div>
                  </div>

                  {/* JSON preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-muted-foreground">Full Configuration JSON</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(inspectConfig, null, 2));
                          setCopiedJson(true);
                          setTimeout(() => setCopiedJson(false), 2000);
                        }}
                      >
                        {copiedJson ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy JSON
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="max-h-64 overflow-y-auto p-3 rounded-lg border bg-muted/30 font-mono text-[11px] leading-relaxed text-foreground">
                      {JSON.stringify(inspectConfig, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Could not load snapshot details.
                </div>
              )}
            </div>

            <div className="p-3 border-t bg-muted/30 flex items-center justify-between shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectTarget(null)}
                className="text-xs h-8"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setRestoreTarget(inspectTarget);
                }}
                className="text-xs h-8 gap-1.5 text-white"
                style={{ backgroundColor: draft.branding.primaryColor }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore this Snapshot
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Restore Confirmation ───────────────────────────────────── */}
      {restoreTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Restore Configuration Version?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are about to restore snapshot: <strong className="text-foreground">{restoreTarget.label || 'Unnamed'}</strong> ({formatDate(restoreTarget.created_at)}).
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Automatic Safety Backup:
              </p>
              <p className="leading-relaxed">
                Before applying this restore, a new backup snapshot of your <strong>current live configuration</strong> will be automatically saved to your database history so nothing will be lost.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRestoreTarget(null)}
                disabled={restoring}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleRestore(restoreTarget)}
                disabled={restoring}
                className="text-xs h-8 gap-1.5 text-white"
                style={{ backgroundColor: draft.branding.primaryColor }}
              >
                {restoring ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Restoring…
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3.5 w-3.5" />
                    Yes, Restore Version
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Delete Confirmation ────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Delete Version Snapshot?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to permanently delete snapshot <strong className="text-foreground">{deleteTarget.label || 'Unnamed'}</strong> ({formatDate(deleteTarget.created_at)})?
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This action cannot be undone. Other snapshots will remain intact.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(deleteTarget)}
                disabled={deleting}
                className="text-xs h-8 gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Snapshot
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
