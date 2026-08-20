import { defaultConfig } from '@/config/default-config';
import type { AppConfig } from '@/types/app-config';
import { supabase } from '@/lib/supabase';

export async function getAppConfig(): Promise<AppConfig> {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('config')
      .eq('id', 'main')
      .single();

    if (error || !data?.config) return defaultConfig;

    const config = data.config as AppConfig;
    if (!config.branding) return defaultConfig;

    return config;
  } catch {
    return defaultConfig;
  }
}
