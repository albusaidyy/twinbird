'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AppConfig } from '@/types/app-config';

interface AppConfigContextValue {
  config: AppConfig;
  /** Update the in-memory config (triggers live preview). Call saveAppConfig separately to persist. */
  updateConfig: (config: AppConfig) => void;
}

const AppConfigContext = createContext<AppConfigContextValue | null>(null);

export function useAppConfig(): AppConfigContextValue {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error('useAppConfig must be used within <AppConfigProvider>');
  return ctx;
}

interface AppConfigProviderProps {
  /** Server-fetched config — used as the initial value. */
  config: AppConfig;
  children: React.ReactNode;
}

export function AppConfigProvider({ config: serverConfig, children }: AppConfigProviderProps) {
  const [config, setConfig] = useState<AppConfig>(serverConfig);

  // localStorage override has been removed in favor of GitHub API

  // Apply CSS custom properties whenever branding changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.branding.primaryColor);
    root.style.setProperty('--color-accent', config.branding.accentColor);
    if (config.branding.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    if (config.branding.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = config.branding.faviconUrl;
    }
  }, [config.branding]);

  const updateConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <AppConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </AppConfigContext.Provider>
  );
}
