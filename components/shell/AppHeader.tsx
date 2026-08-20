'use client';

import Link from 'next/link';
import { Moon, Settings, Sun, LogOut } from 'lucide-react';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { saveAppConfig } from '@/lib/config/saveAppConfig';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { config, updateConfig } = useAppConfig();
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const toggleDarkMode = async () => {
    const next = {
      ...config,
      branding: { ...config.branding, darkMode: !config.branding.darkMode },
    };
    updateConfig(next);
    await saveAppConfig(next);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  // Derive avatar initial from session email or fall back to 'A'
  const initial = session?.user?.email?.[0]?.toUpperCase() ?? 'A';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Left: App name */}
      <p className="text-sm font-semibold text-foreground">{config.branding.appName}</p>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Dark / light toggle */}
        <button
          id="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {config.branding.darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Admin config shortcut */}
        <Link
          id="admin-config-link"
          href="/admin/config"
          aria-label="App Config"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="h-4 w-4" />
        </Link>

        {/* Sign out */}
        <button
          id="sign-out-btn"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>

        {/* User avatar — shows email initial from session */}
        <div
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: config.branding.primaryColor }}
          aria-label="User avatar"
        >
          {initial}
        </div>
      </div>
    </header>
  );
}

