# Backend Plan — Configurable UI System (Supabase Integration)

> **Status: FUTURE PHASE**
> The frontend is built first with a local static config (see `frontend-plan.md`).
> This plan is executed when you are ready to connect the backend.
> All frontend code is already written to support this — only the two swap-point files need updating.

---

## Overview

Replace the local `defaultConfig` file with a **Supabase-backed config store**. Admins edit the UI config through the existing admin panel — changes persist to Supabase and propagate to all sessions within 60 seconds (via cache revalidation).

Each deployment has its own Supabase project. There is no cross-deployment data sharing.

---

## What Changes vs What Stays the Same

| Item | Status |
|------|--------|
| `lib/config/getAppConfig.ts` | **REPLACE** (~5 lines) — fetch from Supabase |
| `lib/config/saveAppConfig.ts` | **REPLACE** (~5 lines) — upsert to Supabase |
| `middleware.ts` | **ADD** — protect `/admin/*` with Supabase Auth |
| `app/admin/login/page.tsx` | **ADD** — email/password login form |
| All other frontend files | **UNCHANGED** |

---

## Tech Stack (additions)

| Addition | Purpose |
|---|---|
| `@supabase/supabase-js` | Supabase JS client |
| `@supabase/ssr` | Cookie-based auth for Next.js App Router |
| Supabase Auth | Admin authentication |
| Supabase PostgreSQL | `app_config` table (single row per deployment) |
| Supabase Storage | Logo image uploads (optional) |

---

## Install Commands

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Environment Variables

Add to `.env.local` (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never expose to client
```

---

## Supabase Project Setup

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (one per deployment)
3. Copy the **Project URL** and **anon key** from Project Settings → API

### Step 2 — Run the Schema SQL

Paste into your Supabase SQL Editor and run:

```sql
-- Single-row app config table (exactly one row per deployment)
create table public.app_config (
  id           uuid primary key default gen_random_uuid(),
  branding     jsonb not null default '{}',
  navigation   jsonb not null default '[]',
  features     jsonb not null default '{}',
  layout       jsonb not null default '{}',
  labels       jsonb not null default '{}',
  updated_at   timestamptz default now(),
  updated_by   uuid references auth.users(id)
);

-- Enforce singleton (only one row ever allowed)
create unique index app_config_singleton on public.app_config ((true));

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger app_config_updated_at
  before update on public.app_config
  for each row execute function update_updated_at();

-- RLS: public READ, authenticated admins WRITE
alter table public.app_config enable row level security;

create policy "Public can read config"
  on public.app_config for select
  using (true);

create policy "Authenticated admins can write config"
  on public.app_config for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

### Step 3 — Seed the Default Config

```sql
-- Tourism/Safari default (edit as needed per deployment)
insert into public.app_config (branding, navigation, features, layout, labels)
values (
  '{
    "appName":      "Safari & Tourism",
    "primaryColor": "#2D6A4F",
    "accentColor":  "#B7E4C7",
    "font":         "Inter",
    "logoUrl":      null,
    "darkMode":     false
  }',
  '[
    {"key":"dashboard","label":"Dashboard","href":"/",        "icon":"LayoutDashboard","enabled":true},
    {"key":"tours",    "label":"Tours",    "href":"/tours",   "icon":"MapPin",          "enabled":true},
    {"key":"bookings", "label":"Bookings", "href":"/bookings","icon":"CalendarCheck",   "enabled":true},
    {"key":"clients",  "label":"Clients",  "href":"/clients", "icon":"Users",           "enabled":true},
    {"key":"reports",  "label":"Reports",  "href":"/reports", "icon":"BarChart3",       "enabled":true}
  ]',
  '{"bookings":true,"tours":true,"reports":true,"clientPortal":false,"notifications":true}',
  '{"sidebarCollapsed":false,"dashboardWidgets":["stats","recent_bookings","revenue","map"]}',
  '{
    "welcomeMessage":   "Welcome to Safari & Tourism",
    "entityName":       "Tour",
    "entityNamePlural": "Tours",
    "primaryActionLabel":"Create Tour"
  }'
);
```

### Step 4 — Create an Admin User

In Supabase Dashboard → Authentication → Users → **Invite user** (or create via the Auth API).

---

## Supabase Client Files

### [NEW] `lib/supabase/client.ts`
Browser-side singleton client:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### [NEW] `lib/supabase/server.ts`
Server-side client (reads cookies for session):

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  );
}
```

---

## Swap Point Updates

### UPDATE `lib/config/getAppConfig.ts`

Replace the body completely:

```typescript
import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { AppConfig } from '@/types/app-config';

export const getAppConfig = unstable_cache(
  async (): Promise<AppConfig> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('app_config')
      .select('branding, navigation, features, layout, labels')
      .single();

    if (error || !data) throw new Error('Failed to fetch app config');
    return data as AppConfig;
  },
  ['app-config'],
  { revalidate: 60 }  // cache for 60 seconds
);
```

### UPDATE `lib/config/saveAppConfig.ts`

Replace the body completely:

```typescript
import { createClient } from '@/lib/supabase/client';
import type { AppConfig } from '@/types/app-config';

export async function saveAppConfig(config: AppConfig): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('app_config')
    .upsert({ ...config, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  // Bust the server-side cache so changes appear within seconds
  await fetch('/api/config/revalidate', { method: 'POST' });
}
```

---

## New Files (Backend Phase Only)

### [NEW] `app/api/config/revalidate/route.ts`
Cache busting endpoint — called after admin saves config:

```typescript
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  revalidateTag('app-config');
  return NextResponse.json({ revalidated: true });
}
```

### [NEW] `middleware.ts`
Protects `/admin/*` — unauthenticated users redirected to `/admin/login`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### [NEW] `app/admin/login/page.tsx`
Simple email/password login form using `supabase.auth.signInWithPassword()`. On success, redirects to `/admin/config`.

---

## Storage (Optional — Logo Uploads)

If you want admins to upload a logo image:

1. Create a **Storage bucket** in Supabase named `logos` (public)
2. In `saveAppConfig.ts`, upload the file first:
   ```typescript
   const { data } = await supabase.storage.from('logos').upload('logo.png', file);
   config.branding.logoUrl = supabase.storage.from('logos').getPublicUrl('logo.png').data.publicUrl;
   ```
3. `AppConfigProvider` already reads `branding.logoUrl` — no other change needed

---

## Deployment Replication Workflow

When deploying to a new machine / account / client:

```
1. git clone <repo>               # same codebase, no changes
2. Create new Supabase project    # supabase.com → New Project
3. Run schema SQL                 # paste into SQL Editor
4. Run seed SQL                   # customize for this deployment
5. Create admin user              # Supabase Auth → Invite
6. Set .env.local                 # point at new Supabase project
7. npm run dev (or deploy)
8. Admin logs in → /admin/config  # fine-tune branding/nav/features
```

No code changes needed. Each deployment is fully independent.

---

## Security Notes

- **RLS is enabled** on `app_config` — unauthenticated users can only read, never write
- **Service Role Key** must never be exposed to the browser (`SUPABASE_SERVICE_ROLE_KEY` is server-only)
- **Middleware** ensures all `/admin/*` routes require an authenticated Supabase session
- **Anon key** is safe to expose — it's scoped to public read-only operations by RLS

---

## Verification

```bash
npm run build   # zero errors
```

Manual:
1. Visit `/admin` without logging in → redirected to `/admin/login`
2. Log in → redirected to `/admin/config`
3. Change branding color → Save → hard refresh homepage → new color applies (within 60s cache window)
4. Open a second browser tab (unauthenticated) → can see the UI but cannot access `/admin`
5. Supabase Dashboard → Table Editor → `app_config` → verify the saved config row is correct
