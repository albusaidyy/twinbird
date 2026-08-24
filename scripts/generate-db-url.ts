/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive DATABASE_URL Connection String Helper
 * ─────────────────────────────────────────────────────────────────────────────
 * Prompts for your plain Supabase database password, URL-encodes special
 * characters, and formats the exact `DATABASE_URL=...` line for your `.env`.
 *
 * 📌 HOW TO RUN:
 *   npx tsx scripts/generate-db-url.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\n--- Supabase DATABASE_URL Generator ---');
console.log('Project Reference: zkrrshkjdhdyzfzyjtmt');

rl.question('Paste your plain database password: ', (password) => {
  const cleanPassword = password.trim().replace(/^\[|\]$/g, ''); // strip accidental brackets
  const encodedPassword = encodeURIComponent(cleanPassword);

  const directUrl = `postgresql://postgres:${encodedPassword}@db.zkrrshkjdhdyzfzyjtmt.supabase.co:5432/postgres`;
  const poolerUrl = `postgresql://postgres.zkrrshkjdhdyzfzyjtmt:${encodedPassword}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

  console.log('\n✅ Copy this exact line into your .env:\n');
  console.log(`DATABASE_URL=${directUrl}`);
  console.log('\n----------------------------------------\n');
  rl.close();
});
