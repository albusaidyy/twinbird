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
  let uploadedUrls: string[] = [];
  try {
    const foldersToFetch: string[] = [];
    if (includeAll) {
      foldersToFetch.push('uploads', 'hero', 'brand/logos', 'brand/favicons', 'tours', 'gallery', 'whyus', 'contact-hero');
    } else {
      if (folder) foldersToFetch.push(folder);
      if (folder && !folder.startsWith('images/') && !folder.startsWith('brand/')) {
        foldersToFetch.push(`images/${folder}`);
      }
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
            return urlData.publicUrl;
          });
      })
    );

    for (const res of results) {
      if (res.status === 'fulfilled') {
        uploadedUrls.push(...res.value);
      }
    }
  } catch {
    // Supabase storage query fails gracefully
  }

  uploadedUrls = Array.from(new Set(uploadedUrls));

  const items: MediaItem[] = [
    ...uploadedUrls.map((url) => ({
      url,
      name: url.split('/').pop() || 'uploaded-image',
      source: 'uploaded' as const,
      folder: url.includes('/uploads/') ? 'uploads' : folder,
    })),
    ...localImages.map((url) => ({
      url,
      name: url.split('/').pop() || 'local-image',
      source: 'local' as const,
      folder: url.split('/').slice(1, -1).join('/') || folder,
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
): Promise<{ url: string } | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  const file = formData.get('file') as File | null;
  if (!file) return { error: 'No file provided' };

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl };
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


