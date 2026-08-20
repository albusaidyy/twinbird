# Better Auth & Supabase Database Setup Guide

This document records the complete setup, debugging, migrations, and admin seeding performed for **Better Auth** with **Supabase PostgreSQL** in Next.js.

---

## 1. Database Connection & URL Encoding

When connecting to Supabase PostgreSQL using a connection string in `.env`:

```env
DATABASE_URL=postgresql://postgres:[ENCODED_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
BETTER_AUTH_SECRET=your_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
ADMIN_EMAIL=designhives.ke@gmail.com
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Admin
```

### Key Considerations:
* **Special Characters in Database Password**: If the password contains symbols like `+`, `/`, `%`, or `@`, they must be percent-encoded (e.g. `+` -> `%2B`, `/` -> `%2F`, `%` -> `%25`) to prevent connection parsing errors (`ENOTFOUND`).

---

## 2. Core Auth Configuration

### `lib/auth.ts` (Server Configuration)
Initializes Better Auth using the `pg` connection pool:

```typescript
import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-minute client-side cache
    },
  },
});
```

### `app/api/auth/[...all]/route.ts` (Next.js Route Handler)
Exposes the Better Auth API endpoints to Next.js App Router:

```typescript
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth.api);
```

### `lib/auth-client.ts` (Client Hook & SDK)
Provides React client hooks (`useSession`, `signIn`, `signOut`, `signUp`):

```typescript
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});
```

---

## 3. Database Schema & Migrations (`npx auth@latest`)

Better Auth requires 4 core tables: `user`, `session`, `account`, and `verification`.

### Recommended 2-Step Workflow

Instead of relying on locally pinned CLI packages, use the official `auth@latest` runner:

#### Step 1: Generate the Migration SQL
Generates the exact schema migration diff matching your installed `better-auth` version into the `better-auth_migrations/` folder:

```bash
npx auth@latest generate
```

This creates a migration SQL file (e.g. `better-auth_migrations/2026-08-19T...sql`) specifying any missing tables, columns, or indexes (such as the `issuer` column and unique constraint on `account`).

#### Step 2: Apply the Migration Directly to Supabase
Applies the generated schema directly to your Supabase PostgreSQL database using the connection string from `lib/auth.ts`:

```bash
npx auth@latest migrate
```

### Schema Structure:
1. **`user`**: `id` (PK), `name`, `email` (unique), `emailVerified`, `image`, `createdAt`, `updatedAt`
2. **`session`**: `id` (PK), `expiresAt`, `token` (unique), `createdAt`, `updatedAt`, `ipAddress`, `userAgent`, `userId` (FK -> user)
3. **`account`**: `id` (PK), `issuer`, `accountId`, `providerId`, `userId` (FK -> user), `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`, `createdAt`, `updatedAt`
4. **`verification`**: `id` (PK), `identifier`, `value`, `expiresAt`, `createdAt`, `updatedAt`

> **Key Insight**: Running `npx auth@latest generate` followed by `npx auth@latest migrate` automatically detects and adds the required `issuer` column on `account` (`alter table "account" add column "issuer" text not null;`) and creates the composite index `account_issuer_accountId_uidx` on `("issuer", "accountId")`.

---

## 4. Route Protection (`proxy.ts`)

In Next.js 16+, the `middleware.ts` convention is superseded by **`proxy.ts`** with the `export function proxy(req: NextRequest)` entry point.

### `proxy.ts` (Edge-compatible Optimistic Guard)
Protects `/admin/*` routes and redirects unauthenticated users to `/login?callbackUrl=...`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy (Middleware): protects all /admin/* routes.
 *
 * Uses an optimistic cookie-based check — the Better Auth recommended approach
 * for Edge-compatible middleware/proxy. Full session validation (DB lookup) happens
 * in Server Actions via auth.api.getSession().
 */
export function proxy(req: NextRequest) {
  const sessionCookie =
    req.cookies.get('better-auth.session_token') ??
    req.cookies.get('__Secure-better-auth.session_token');

  if (!sessionCookie) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

> **Migration Tip**: If migrating an existing project from `middleware.ts` to `proxy.ts`, run:
> ```bash
> npx @next/codemod@canary middleware-to-proxy .
> ```

---

## 5. Admin Seeding Script

The script at `scripts/seed-admin.ts` provides one-time initial admin creation with **idempotency** (safely skips creation if the admin already exists).

### `scripts/seed-admin.ts`
```typescript
import { config } from 'dotenv';
config(); // load .env

import { auth } from '../lib/auth';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    console.error('❌  Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before running this script.');
    process.exit(1);
  }

  console.log(`Creating admin user: ${email}`);

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
    console.log('✅  Admin user created successfully!');
    console.log(`    Email: ${email}`);
    console.log('    You can now log in at /login');
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : '';
    if (/already/i.test(message)) {
      console.warn(`⚠️  User "${email}" already exists. Skipping creation.`);
      process.exit(0);
    }
    throw err;
  }

  process.exit(0);
}

main().catch(err => {
  console.error('❌  Failed to create user / unexpected error:', err.message ?? err);
  process.exit(1);
});
```

### Running the Seed Script:
```bash
npx tsx scripts/seed-admin.ts
```

---

## 6. Vercel Deployment & Environment Variables

When deploying the application to **Vercel**, configure the project linkage and production environment variables.

### 1. Link to Vercel Project
```bash
npx vercel link
```
Select your team (`design-hives-ke`) and project (`safari-app`).

### 2. Push Environment Variables via CLI
Add each environment variable for `Production` (and `Preview` if applicable):

```bash
# Supabase URL
npx vercel env add SUPABASE_URL

# Supabase Service Role Key
npx vercel env add SUPABASE_SERVICE_KEY

# PostgreSQL Database Connection String (Pooler or Direct)
npx vercel env add DATABASE_URL

# Better Auth Encryption Secret
npx vercel env add BETTER_AUTH_SECRET

# Better Auth Production Domain
npx vercel env add BETTER_AUTH_URL
```

### Environment Variable Reference:

| Variable | Description / Example | Environment |
| :--- | :--- | :--- |
| **`SUPABASE_URL`** | `https://[PROJECT_REF].supabase.co` | Production, Preview |
| **`SUPABASE_SERVICE_KEY`** | Supabase Service Role secret JWT key | Production, Preview |
| **`DATABASE_URL`** | `postgresql://postgres.[REF]:[ENCODED_PW]@[HOST]:6543/postgres` | Production, Preview |
| **`BETTER_AUTH_SECRET`** | Secret key generated for session hashing | Production, Preview |
| **`BETTER_AUTH_URL`** | Production domain (e.g. `https://safari-app-design-hives-ke.vercel.app`) | Production |

> **Important**: `BETTER_AUTH_URL` must match your live deployment domain in production (not `localhost`) so that session cookies, callbacks, and redirects work properly across domains.

### 3. Deploy to Production
```bash
npx vercel --prod
```

---

## 7. Verification & Build Commands

To verify that the entire system is healthy and types are valid:

```bash
# 1. Verify TypeScript types
npm run typecheck

# 2. Test local dev server
npm run dev

# 3. Build production bundle locally
npm run build
```


