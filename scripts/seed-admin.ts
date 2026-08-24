/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Seed Initial Admin User Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates the initial admin account in Supabase using Better Auth.
 *
 * 📌 HOW TO RUN:
 *   npx tsx scripts/seed-admin.ts
 *
 * 📋 PREREQUISITES / REQUIRED ENV VARS (in your .env or .env.local):
 *   DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
 *   BETTER_AUTH_SECRET=your-secret-key-at-least-32-chars
 *   BETTER_AUTH_URL=http://localhost:3000   (or your production URL)
 *   ADMIN_EMAIL=admin@example.com
 *   ADMIN_PASSWORD=your_secure_password
 *   ADMIN_NAME="Admin"                     (optional, defaults to "Admin")
 *
 * 💡 WHAT IT DOES:
 *   - Calls Better Auth signUpEmail to insert the admin user and hash the password.
 *   - If the user already exists, it safely detects it and skips re-creation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
