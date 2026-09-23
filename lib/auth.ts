import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const getTrustedOrigins = () => {
  const origins = new Set<string>([
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:*',
    'http://127.0.0.1:*',
    'http://192.168.*:*',
    'https://twinbirdtravel.co.ke',
    'https://www.twinbirdtravel.co.ke',
    'https://*.twinbirdtravel.co.ke',
    'https://*.vercel.app',
  ]);

  const envUrls = [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ];

  for (const raw of envUrls) {
    if (!raw) continue;
    try {
      const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
      origins.add(u.origin);
      if (u.hostname.startsWith('www.')) {
        origins.add(`${u.protocol}//${u.hostname.slice(4)}${u.port ? `:${u.port}` : ''}`);
      } else if (!u.hostname.includes('localhost') && !u.hostname.startsWith('127.')) {
        origins.add(`${u.protocol}//www.${u.hostname}${u.port ? `:${u.port}` : ''}`);
      }
    } catch {
      origins.add(raw);
    }
  }

  return Array.from(origins);
};

const getBaseURL = () => {
  const url =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : undefined);
  return url ? url.replace(/\/$/, '') : undefined;
};

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: getBaseURL(),
  trustedOrigins: getTrustedOrigins(),
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

