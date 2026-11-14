import 'server-only';
import { Pool } from 'pg';

declare global {
  var schoolDatabasePool: Pool | undefined;
}

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

export function getDatabasePool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL n’est pas configurée.');
  }

  globalThis.schoolDatabasePool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  });

  return globalThis.schoolDatabasePool;
}
