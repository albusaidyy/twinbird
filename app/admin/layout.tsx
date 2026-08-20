import { AppHeader } from '@/components/shell/AppHeader';

/** Admin routes have a full-width layout (no app sidebar). */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
