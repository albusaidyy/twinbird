/**
 * One-time script to create the initial admin user in Supabase via Better Auth.
 * Run once after setup: npx tsx scripts/seed-admin.ts
 *
 * Set these env vars before running:
 *   DATABASE_URL=...
 *   BETTER_AUTH_SECRET=...
 *   BETTER_AUTH_URL=http://localhost:3000
 *   ADMIN_EMAIL=your@email.com
 *   ADMIN_PASSWORD=yourpassword
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
