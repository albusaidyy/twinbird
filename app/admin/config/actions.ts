'use server';
import type { AppConfig } from '@/types/app-config';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const MEDIA_BUCKET = 'media';

// ─── Image file listing ────────────────────────────────────────────────────────

export async function getLogoFiles(): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list('brand/logos', { limit: 50 });

    if (error || !data) return [];

    return data
      .filter(f => /\.(png|jpe?g|svg|webp|gif)$/i.test(f.name))
      .map(f => {
        const { data: urlData } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(`brand/logos/${f.name}`);
        return urlData.publicUrl;
      });
  } catch {
    return [];
  }
}

export async function getFaviconFiles(): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list('brand/favicons', { limit: 50 });

    if (error || !data) return [];

    return data
      .filter(f => /\.(png|ico|svg|webp|gif)$/i.test(f.name))
      .map(f => {
        const { data: urlData } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(`brand/favicons/${f.name}`);
        return urlData.publicUrl;
      });
  } catch {
    return [];
  }
}

export async function getMediaFiles(folder: string = 'uploads'): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error || !data) return [];

    return data
      .filter(f => /\.(png|jpe?g|svg|webp|gif|avif|ico)$/i.test(f.name))
      .map(f => {
        const { data: urlData } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(`${folder}/${f.name}`);
        return urlData.publicUrl;
      });
  } catch {
    return [];
  }
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

