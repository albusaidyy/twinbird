/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Database Migration: Config & Version Tables
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates required configuration tables in PostgreSQL/Supabase:
 *   1. `site_config`          : Single-row store (id = 'main') for live app config.
 *   2. `site_config_versions` : Versioned history snapshots for backup & restore.
 *
 * 📌 HOW TO RUN:
 *   npx tsx scripts/create-config-versions-table.ts
 *
 * 📋 PREREQUISITES / REQUIRED ENV VARS (in .env):
 *   DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
 *
 * 💡 BEHAVIOR:
 *   - Safe to run multiple times (uses `create table if not exists` and checks public schema).
 *   - Skips any table that already exists.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { config } from 'dotenv';
config(); // load .env

import { Pool, PoolClient } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌  Missing DATABASE_URL in your .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

// ─── Table definitions (run in order) ────────────────────────────────────────

const migrations: { name: string; sql: string }[] = [
  {
    name: 'site_config',
    sql: `
      create table if not exists site_config (
        id          text        primary key,
        config      jsonb       not null,
        updated_at  timestamptz not null default now(),
        updated_by  text
      );
      comment on table site_config is
        'Single-row store (id = ''main'') for the live site configuration.';
    `,
  },
  {
    name: 'site_config_versions',
    sql: `
      create table if not exists site_config_versions (
        id          uuid        primary key default gen_random_uuid(),
        config      jsonb       not null,
        label       text,
        created_at  timestamptz not null default now(),
        created_by  text
      );
      comment on table site_config_versions is
        'Versioned snapshots of site_config, created before resets or major changes.';
      comment on column site_config_versions.config     is 'Full AppConfig JSON snapshot.';
      comment on column site_config_versions.label      is 'Human-readable label for this snapshot.';
      comment on column site_config_versions.created_at is 'Timestamp when this snapshot was captured.';
      comment on column site_config_versions.created_by is 'Email of the admin who triggered the snapshot.';
    `,
  },
];

// ─── Helper: check if a table exists in public schema ────────────────────────

async function tableExists(
  client: PoolClient,
  tableName: string
): Promise<boolean> {
  const { rows } = await client.query<{ exists: boolean }>(
    `select exists (
       select 1 from information_schema.tables
       where table_schema = 'public'
         and table_name   = $1
     ) as exists`,
    [tableName]
  );
  return rows[0]?.exists === true;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔧  Running config table migrations…\n');

  const client = await pool.connect();

  try {
    for (const { name, sql } of migrations) {
      const exists = await tableExists(client, name);

      if (exists) {
        console.log(`⏭️   ${name} — already exists, skipping.`);
        continue;
      }

      console.log(`➕  Creating table: ${name}…`);
      await client.query(sql);

      const created = await tableExists(client, name);
      if (created) {
        console.log(`✅  ${name} created successfully.`);
      } else {
        console.error(`❌  ${name} was not found after creation — something went wrong.`);
        process.exit(1);
      }
    }

    console.log('\n🎉  All tables are ready.');
  } finally {
    client.release();
    await pool.end();
  }

  process.exit(0);
}

main().catch(err => {
  console.error('❌  Unexpected error:', err?.message ?? err);
  process.exit(1);
});
