import { AppSidebar } from '@/components/shell/AppSidebar';
import { AppHeader } from '@/components/shell/AppHeader';

/**
 * Shared app shell layout — used by (app) route group and admin routes.
 * Provides sidebar + header + scrollable main content area.
 */
export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
