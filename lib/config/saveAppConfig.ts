'use server';
import type { AppConfig } from '@/types/app-config';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function saveAppConfig(config: AppConfig): Promise<void> {
  // Validate session server-side before saving
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase.from('site_config').upsert({
    id: 'main',
    config,
    updated_at: new Date().toISOString(),
    updated_by: session.user.email,
  });

  if (error) throw new Error(`Failed to save config: ${error.message}`);
}


