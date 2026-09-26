# Database Security & Row Level Security (RLS) Guide

This guide explains how to secure the application's configuration tables (`site_config` and `site_config_versions`) and storage buckets in Supabase using **Row Level Security (RLS)**.

---

## 1. Security Architecture Overview

In this application:
- **Client (Frontend)**: Reads the site configuration to render pages, navigation, branding, and content.
- **Server Actions & Server Components**: Run inside Next.js using `SUPABASE_SERVICE_KEY` (service role) via [`lib/supabase.ts`](file:///c:/Users/Albusaidy/dev/Work/twinbird/lib/supabase.ts).
- **Service Role Key Privilege**: The `service_role` key in PostgreSQL automatically bypasses Row Level Security.
- **Why RLS is Required**: By default, Supabase exposes a public PostgREST API (`/rest/v1/*`) to anyone with your project URL and public `anon` key. Without RLS, unauthorized users could send `PATCH` or `DELETE` requests directly to Supabase to overwrite or delete your live site configuration.

With RLS enabled:
1. **`site_config`**: Publicly readable (`SELECT`), but **all public writes (`INSERT`, `UPDATE`, `DELETE`) are blocked**.
2. **`site_config_versions`**: Fully private (no public policies). Only server actions can create or inspect snapshots.
3. **Admin Writes**: Handled securely through authenticated Next.js Server Actions ([`saveAppConfig`](file:///c:/Users/Albusaidy/dev/Work/twinbird/lib/config/saveAppConfig.ts) and [`actions.ts`](file:///c:/Users/Albusaidy/dev/Work/twinbird/app/admin/config/actions.ts)) after session verification via Better Auth.

---

## 2. Complete SQL Migration Script

Execute the following script in the **Supabase Dashboard → SQL Editor**:

```sql
-- ==============================================================================
-- 1. Enable Row Level Security (RLS)
-- ==============================================================================
alter table public.site_config enable row level security;
alter table public.site_config_versions enable row level security;

-- ==============================================================================
-- 2. Drop existing policies if any (Ensures script is idempotent and safe to re-run)
-- ==============================================================================
drop policy if exists "Allow public read access to site_config" on public.site_config;
drop policy if exists "Block public writes to site_config" on public.site_config;
drop policy if exists "Deny all public access to site_config_versions" on public.site_config_versions;

-- ==============================================================================
-- 3. Policy: Allow public read access to active site config
-- ==============================================================================
create policy "Allow public read access to site_config"
  on public.site_config
  for select
  to anon, authenticated
  using (true);

-- Note on writes:
-- In PostgreSQL, when RLS is active and NO policies exist for INSERT/UPDATE/DELETE,
-- all write operations from anon or regular clients are automatically REJECTED (403 Forbidden).
--
-- Only Next.js server-side code using SUPABASE_SERVICE_KEY can insert/update/delete.
```

---

## 3. Why `DROP POLICY IF EXISTS` is Used

When writing PostgreSQL scripts, `DROP POLICY IF EXISTS "policy_name" ON table_name;` is standard practice for several reasons:

1. **Idempotency (Safe Re-execution)**:
   PostgreSQL throws an error (`ERROR: policy "..." for table "..." already exists`) if you attempt to create a policy that already exists. Dropping it first ensures the script can be run multiple times safely.
2. **Updating Rules**:
   If policy logic changes in the future, dropping the old definition allows the new definition to take effect cleanly.
3. **Zero Risk**:
   The `IF EXISTS` clause ensures PostgreSQL silently skips the drop statement if the policy does not yet exist.

---

## 4. Securing Supabase Storage (`media` bucket)

For uploaded media assets:

```sql
-- Allow public read access to media images
create policy "Public media read access"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Direct client-side uploads and deletions from the browser remain blocked.
-- Uploads and deletions are mediated by Next.js Server Actions (uploadImage, deleteUploadedImage).
```

---

## 5. Verification & Testing

### Test 1: Verify Public Read Access
Visit your site or run a GET request using your Supabase anon key:
```bash
curl -X GET "https://<your-project>.supabase.co/rest/v1/site_config?id=eq.main" \
  -H "apikey: <your-anon-key>" \
  -H "Authorization: Bearer <your-anon-key>"
```
*Expected*: Returns the `site_config` JSON with HTTP `200 OK`.

### Test 2: Verify Public Write is Blocked
Attempt a PATCH request using the anon key:
```bash
curl -X PATCH "https://<your-project>.supabase.co/rest/v1/site_config?id=eq.main" \
  -H "apikey: <your-anon-key>" \
  -H "Authorization: Bearer <your-anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"config": {}}'
```
*Expected*: Rejected by Supabase with HTTP `403 Forbidden` (`new row violates row-level security policy`).

### Test 3: Verify Admin Saves Continue to Work
1. Log in to `/admin/config`.
2. Edit any field (e.g., site name or contact number).
3. Click **Save Changes**.
4. The update succeeds because Server Actions run with `SUPABASE_SERVICE_KEY`.
