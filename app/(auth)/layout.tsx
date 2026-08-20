import type { ReactNode } from 'react';

/**
 * Minimal layout for auth routes (/login).
 * No AppHeader, no sidebar — just a centered page.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
