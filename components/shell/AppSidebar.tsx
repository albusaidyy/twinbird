'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const { config } = useAppConfig();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = config.navigation.filter(
    (item) => item.enabled && config.features[item.key] !== false,
  );

  return (
    <aside
      className={cn(
        'relative flex h-screen shrink-0 flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo / App Name */}
      <div
        className={cn(
          'flex h-16 items-center gap-3 border-b border-border px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: config.branding.primaryColor }}
        >
          {config.branding.appName.charAt(0)}
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-foreground">
            {config.branding.appName}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {visibleNav.map((item) => {
          const Icon = getIcon(item.icon);
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              style={isActive ? { backgroundColor: config.branding.primaryColor } : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin settings link */}
      <div className="border-t border-border p-2">
        <Link
          href="/admin/config"
          title={collapsed ? 'App Config' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>App Config</span>}
        </Link>
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed((c: boolean) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}
