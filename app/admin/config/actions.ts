'use server';
import type { AppConfig } from '@/types/app-config';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

const MEDIA_BUCKET = 'media';
const IMAGE_EXTENSIONS = /\.(png|jpe?g|svg|webp|gif|avif|ico|bmp)$/i;

// ─── Local /public Image Scanning ─────────────────────────────────────────────

function getPublicDir(): string {
  return path.join(process.cwd(), 'public');
}

export async function scanLocalPublicImages(subDir: string = ''): Promise<string[]> {
  try {
    const publicDir = getPublicDir();
    const targetDir = path.join(publicDir, subDir);
    if (!fs.existsSync(targetDir)) return [];

    const results: string[] = [];

    function scan(currentPath: string, relativePrefix: string) {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const nextRelative = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
        const nextFull = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          scan(nextFull, nextRelative);
        } else if (IMAGE_EXTENSIONS.test(entry.name)) {
          results.push(`/${nextRelative.replace(/\\/g, '/')}`);
        }
      }
    }

    scan(targetDir, subDir.replace(/\\/g, '/'));
    return results;
  } catch {
    return [];
  }
}

// ─── Media Library & Image Listing ────────────────────────────────────────────

export interface MediaItem {
  url: string;
  name: string;
  source: 'local' | 'uploaded';
  folder?: string;
  storagePath?: string;
  size?: number;
}

export interface MediaLibraryResult {
  items: MediaItem[];
  local: string[];
  uploaded: string[];
  all: string[];
}

export async function getLocalImagesForFolder(folder: string = 'uploads'): Promise<string[]> {
  const norm = folder.toLowerCase().replace(/^\/+|\/+$/g, '');

  if (!norm || norm === 'all') {
    return scanLocalPublicImages('');
  }

  if (norm === 'brand/logos' || norm === 'logos' || norm === 'logo') {
    const logos = await scanLocalPublicImages('brand/logos');
    const rootLogos = await scanLocalPublicImages('logos');
    const brandAll = (await scanLocalPublicImages('brand')).filter((f) => /logo/i.test(f));
    return Array.from(new Set([...logos, ...rootLogos, ...brandAll]));
  }

  if (
    norm === 'brand/favicons' ||
    norm === 'favicons' ||
    norm === 'favicon' ||
    norm === 'icons' ||
    norm === 'icon'
  ) {
    const favicons = await scanLocalPublicImages('brand/favicons');
    const icons = await scanLocalPublicImages('icons');
    const brandIcons = (await scanLocalPublicImages('brand')).filter((f) =>
      /(favicon|icon)/i.test(f)
    );
    return Array.from(new Set([...favicons, ...icons, ...brandIcons]));
  }

  // Check direct subfolder in public (e.g. public/hero, public/tours, public/gallery)
  const direct = await scanLocalPublicImages(norm);
  // Check in public/images/<folder> (e.g. public/images/hero, public/images/tours)
  const underImages = await scanLocalPublicImages(`images/${norm}`);
  // Check in public/brand/<folder>
  const underBrand = await scanLocalPublicImages(`brand/${norm}`);

  const combined = Array.from(new Set([...direct, ...underImages, ...underBrand]));
  if (combined.length > 0) {
    return combined;
  }

  // If no direct folder match, search for files whose path contains the folder keyword
  const all = await scanLocalPublicImages('');
  const matched = all.filter((p) => {
    const lower = p.toLowerCase();
    return lower.includes(`/${norm}/`) || lower.includes(`/${norm}.`);
  });

  return matched;
}

export async function getLogoFiles(): Promise<string[]> {
  const localLogos = await getLocalImagesForFolder('brand/logos');

  let uploadedLogos: string[] = [];
  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list('brand/logos', { limit: 50 });

    if (!error && data) {
      uploadedLogos = data
        .filter((f) => IMAGE_EXTENSIONS.test(f.name))
        .map((f) => {
          const { data: urlData } = supabase.storage
            .from(MEDIA_BUCKET)
            .getPublicUrl(`brand/logos/${f.name}`);
          return urlData.publicUrl;
        });
    }
  } catch {
    // Supabase storage query fails gracefully
  }

  return Array.from(new Set([...localLogos, ...uploadedLogos]));
}

export async function getFaviconFiles(): Promise<string[]> {
  const localFavicons = await getLocalImagesForFolder('brand/favicons');

  let uploadedFavicons: string[] = [];
  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list('brand/favicons', { limit: 50 });

    if (!error && data) {
      uploadedFavicons = data
        .filter((f) => /\.(png|ico|svg|webp|gif)$/i.test(f.name))
        .map((f) => {
          const { data: urlData } = supabase.storage
            .from(MEDIA_BUCKET)
            .getPublicUrl(`brand/favicons/${f.name}`);
          return urlData.publicUrl;
        });
    }
  } catch {
    // Supabase storage query fails gracefully
  }

  return Array.from(new Set([...localFavicons, ...uploadedFavicons]));
}

export async function getMediaLibrary(
  folder: string = 'uploads',
  includeAll: boolean = false
): Promise<MediaLibraryResult> {
  // 1. Scan local images (either scoped to folder or all if includeAll is requested)
  const localImages = includeAll
    ? await scanLocalPublicImages('')
    : await getLocalImagesForFolder(folder);

  // 2. Fetch uploaded images from Supabase Storage for this folder
  interface UploadedItemRecord {
    url: string;
    name: string;
    folder: string;
    storagePath: string;
    size?: number;
  }
  const uploadedRecords: UploadedItemRecord[] = [];

  try {
    const foldersToFetch: string[] = [];
    if (includeAll) {
      foldersToFetch.push(
        'uploads',
        'global',
        'hero',
        'brand/logos',
        'brand/favicons',
        'tours',
        'excursions',
        'gallery',
        'whyus',
        'contact-hero',
        'about',
        'team',
        'air-ticketing',
        'transfers'
      );
      try {
        const { data: rootList } = await supabase.storage.from(MEDIA_BUCKET).list('', { limit: 100 });
        if (rootList) {
          for (const item of rootList) {
            if (!item.id || item.metadata === null || !IMAGE_EXTENSIONS.test(item.name)) {
              if (item.name && !item.name.includes('.')) {
                foldersToFetch.push(item.name);
              }
            }
          }
        }
      } catch {
        // gracefully ignore
      }
    } else {
      if (folder) foldersToFetch.push(folder);
      if (folder && !folder.startsWith('images/') && !folder.startsWith('brand/')) {
        foldersToFetch.push(`images/${folder}`);
      }
      // Always include global uploads so global images can be viewed across all sections
      foldersToFetch.push('uploads', 'global');
    }

    const uniqueFolders = Array.from(new Set(foldersToFetch));

    const results = await Promise.allSettled(
      uniqueFolders.map(async (f) => {
        const { data, error } = await supabase.storage
          .from(MEDIA_BUCKET)
          .list(f, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (error || !data) return [];
        return data
          .filter((item) => IMAGE_EXTENSIONS.test(item.name))
          .map((item) => {
            const { data: urlData } = supabase.storage
              .from(MEDIA_BUCKET)
              .getPublicUrl(`${f}/${item.name}`);
            const size =
              typeof item.metadata?.size === 'number'
                ? item.metadata.size
                : typeof item.metadata?.contentLength === 'number'
                  ? item.metadata.contentLength
                  : undefined;
            return {
              url: urlData.publicUrl,
              name: item.name,
              folder: f,
              storagePath: `${f}/${item.name}`,
              size,
            };
          });
      })
    );

    for (const res of results) {
      if (res.status === 'fulfilled') {
        uploadedRecords.push(...res.value);
      }
    }
  } catch {
    // Supabase storage query fails gracefully
  }

  // Deduplicate records by URL
  const seenUrls = new Set<string>();
  const uniqueRecords = uploadedRecords.filter((rec) => {
    if (seenUrls.has(rec.url)) return false;
    seenUrls.add(rec.url);
    return true;
  });

  const uploadedUrls = uniqueRecords.map((r) => r.url);

  function getLocalFileSize(relPath: string): number | undefined {
    try {
      const cleanRel = relPath.replace(/^\/+/, '');
      const fullPath = path.join(getPublicDir(), cleanRel);
      if (fs.existsSync(fullPath)) {
        return fs.statSync(fullPath).size;
      }
    } catch {
      // ignore
    }
    return undefined;
  }

  const items: MediaItem[] = [
    ...uniqueRecords.map((rec) => ({
      url: rec.url,
      name: rec.name || rec.url.split('/').pop() || 'uploaded-image',
      source: 'uploaded' as const,
      folder: rec.folder,
      storagePath: rec.storagePath,
      size: rec.size,
    })),
    ...localImages.map((url) => ({
      url,
      name: url.split('/').pop() || 'local-image',
      source: 'local' as const,
      folder: url.split('/').slice(1, -1).join('/') || folder,
      size: getLocalFileSize(url),
    })),
  ];

  const all = Array.from(new Set([...uploadedUrls, ...localImages]));

  return {
    items,
    local: localImages,
    uploaded: uploadedUrls,
    all,
  };
}

export async function getMediaFiles(folder: string = 'uploads'): Promise<string[]> {
  const lib = await getMediaLibrary(folder);
  return lib.all;
}

// ─── Image upload ──────────────────────────────────────────────────────────────

/**
 * Uploads an image to Supabase Storage and returns its public URL.
 * Requires an active admin session.
 */
export async function uploadImage(
  formData: FormData,
  folder: string = 'uploads'
): Promise<{ url: string; storagePath?: string; size?: number } | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  const file = formData.get('file') as File | null;
  if (!file) return { error: 'No file provided' };

  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const contentType = file.type || (ext === 'webp' ? 'image/webp' : 'application/octet-stream');

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(fileName, buffer, {
      contentType,
      upsert: false,
    });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl, storagePath: fileName, size: file.size };
}

/**
 * Uploads multiple images to Supabase Storage and returns their details.
 * Requires an active admin session.
 */
export async function uploadMultipleImages(
  formData: FormData,
  folder: string = 'uploads'
): Promise<{ items: Array<{ url: string; storagePath: string; size?: number; name: string }>; errors: string[] }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { items: [], errors: ['Unauthorized'] };

  const rawFiles = formData.getAll('files') as File[];
  const files: File[] = [];
  for (const f of rawFiles) {
    if (f && typeof f === 'object' && 'name' in f && f.size > 0) {
      files.push(f);
    }
  }

  const singleFile = formData.get('file') as File | null;
  if (singleFile && singleFile.size > 0 && !files.includes(singleFile)) {
    files.push(singleFile);
  }

  if (files.length === 0) {
    return { items: [], errors: ['No files provided'] };
  }

  const items: Array<{ url: string; storagePath: string; size?: number; name: string }> = [];
  const errors: string[] = [];

  const uploadPromises = files.map(async (file) => {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const cleanBase = file.name
        .substring(0, file.name.lastIndexOf('.') > 0 ? file.name.lastIndexOf('.') : file.name.length)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase()
        .slice(0, 30);
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${cleanBase}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const contentType = file.type || (ext === 'webp' ? 'image/webp' : 'application/octet-stream');

      const { error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(fileName, buffer, {
          contentType,
          upsert: false,
        });

      if (error) {
        errors.push(`${file.name}: ${error.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(fileName);

      items.push({
        url: urlData.publicUrl,
        storagePath: fileName,
        size: file.size,
        name: file.name,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      errors.push(`${file.name}: ${msg}`);
    }
  });

  await Promise.all(uploadPromises);

  return { items, errors };
}

/**
 * Extracts the storage object path relative to the bucket from a public URL or raw path.
 */
function extractStoragePath(urlOrPath: string, bucket: string = MEDIA_BUCKET): string {
  if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) {
    return urlOrPath.replace(/^\/+/, '');
  }

  try {
    const parsed = new URL(urlOrPath);
    const pathname = decodeURIComponent(parsed.pathname);

    // Look for /storage/v1/object/(?:public|sign)/<bucket>/(.+)
    const prefixMatch = pathname.match(new RegExp(`/storage/v1/object/(?:public|sign)/${bucket}/(.+)$`));
    if (prefixMatch && prefixMatch[1]) {
      return prefixMatch[1];
    }

    // Look for /<bucket>/(.+)
    const bucketIdx = pathname.indexOf(`/${bucket}/`);
    if (bucketIdx !== -1) {
      return pathname.substring(bucketIdx + bucket.length + 2);
    }
  } catch {
    // fallback
  }

  return urlOrPath.replace(/^\/+/, '');
}

/**
 * Deletes an uploaded image from Supabase Storage.
 * Requires an active admin session.
 */
export async function deleteUploadedImage(
  urlOrPath: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  if (!urlOrPath) return { error: 'No image path provided' };

  const storagePath = extractStoragePath(urlOrPath);
  if (!storagePath) return { error: 'Could not resolve storage path' };

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .remove([storagePath]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// ─── Config helpers ────────────────────────────────────────────────────────────

/** Returns the current config from Supabase for server-side use in the admin page. */
export async function getAdminConfig(): Promise<AppConfig | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { data } = await supabase
    .from('site_config')
    .select('config')
    .eq('id', 'main')
    .single();

  return (data?.config as AppConfig) ?? null;
}

/**
 * Saves a versioned snapshot of the given config to `site_config_versions`.
 *
 * Run once in your Supabase SQL Editor to create the table:
 *
 *   create table if not exists site_config_versions (
 *     id          uuid        primary key default gen_random_uuid(),
 *     config      jsonb       not null,
 *     label       text,
 *     created_at  timestamptz not null default now(),
 *     created_by  text
 *   );
 */
export async function saveConfigVersion(
  config: AppConfig,
  label?: string
): Promise<{ id: string; created_at: string } | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('site_config_versions')
    .insert({
      config,
      label: label ?? `Snapshot before reset — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}`,
      created_by: session.user.email,
    })
    .select('id, created_at')
    .single();

  if (error) return { error: error.message };
  return { id: data.id as string, created_at: data.created_at as string };
}

export interface ConfigVersionSummary {
  id: string;
  label: string | null;
  created_at: string;
  created_by: string | null;
}

/** Returns the list of config version snapshots, newest first. */
export async function getConfigVersions(): Promise<ConfigVersionSummary[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const { data, error } = await supabase
    .from('site_config_versions')
    .select('id, label, created_at, created_by')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data as ConfigVersionSummary[];
}

/** Returns the full config snapshot for a given version id. */
export async function getConfigVersion(id: string): Promise<AppConfig | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { data, error } = await supabase
    .from('site_config_versions')
    .select('config')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data.config as AppConfig;
}

/**
 * Restores a specific version snapshot:
 * 1. Automatically snapshots current live config to `site_config_versions` before restoring.
 * 2. Updates `site_config` with the target snapshot's config.
 * 3. Returns the restored AppConfig.
 */
export async function restoreConfigVersion(
  versionId: string,
  currentConfigToBackup?: AppConfig
): Promise<{ success: true; config: AppConfig; backupId?: string } | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  // 1. Fetch the target version to restore
  const { data: targetVersion, error: fetchErr } = await supabase
    .from('site_config_versions')
    .select('id, config, label, created_at')
    .eq('id', versionId)
    .single();

  if (fetchErr || !targetVersion) {
    return { error: 'Target version not found' };
  }

  const restoredConfig = targetVersion.config as AppConfig;

  // 2. Backup current config before restoring
  let currentConfig = currentConfigToBackup;
  if (!currentConfig) {
    const { data: liveData } = await supabase
      .from('site_config')
      .select('config')
      .eq('id', 'main')
      .single();
    if (liveData?.config) {
      currentConfig = liveData.config as AppConfig;
    }
  }

  let backupId: string | undefined;
  if (currentConfig) {
    const timeStr = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' });
    const targetLabel = targetVersion.label || `Snapshot ${new Date(targetVersion.created_at).toLocaleDateString()}`;
    const { data: backupData } = await supabase
      .from('site_config_versions')
      .insert({
        config: currentConfig,
        label: `Auto-backup before restoring [${targetLabel}] — ${timeStr}`,
        created_by: session.user.email,
      })
      .select('id')
      .single();

    if (backupData) {
      backupId = backupData.id as string;
    }
  }

  // 3. Update live site_config
  const { error: updateErr } = await supabase
    .from('site_config')
    .upsert({
      id: 'main',
      config: restoredConfig,
      updated_at: new Date().toISOString(),
      updated_by: session.user.email,
    });

  if (updateErr) {
    return { error: `Failed to restore config: ${updateErr.message}` };
  }

  return { success: true, config: restoredConfig, backupId };
}

/** Deletes a version snapshot by ID. */
export async function deleteConfigVersion(id: string): Promise<{ success: boolean } | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('site_config_versions')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}



