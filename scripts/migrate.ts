import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { Pool, type PoolClient } from 'pg';

loadEnvConfig(process.cwd());

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Configurez DATABASE_URL avant npm run db:migrate.');
  }

  const pool = new Pool({ connectionString, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
  let client: PoolClient | undefined;
  let lockAcquired = false;

  try {
    client = await pool.connect();
    const connectedClient = client;
    await connectedClient.query('SELECT pg_advisory_lock($1)', [541_802_202]);
    lockAcquired = true;
    await connectedClient.query(`CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
    const migrations = ['001_student_lifecycle', '002_teachers', '003_auth_users'];

    for (const migrationId of migrations) {
      const current = await connectedClient.query('SELECT id FROM schema_migrations WHERE id = $1', [migrationId]);
      if (current.rowCount) {
        console.log(`${migrationId} already applied`);
        continue;
      }
      const sql = await readFile(path.join(process.cwd(), 'database', 'migrations', `${migrationId}.sql`), 'utf8');
      await connectedClient.query('BEGIN');
      try {
        await connectedClient.query(sql);
        await connectedClient.query('INSERT INTO schema_migrations (id) VALUES ($1)', [migrationId]);
        await connectedClient.query('COMMIT');
        console.log(`${migrationId} applied`);
      } catch (error) {
        await connectedClient.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    try {
      if (client && lockAcquired) await client.query('SELECT pg_advisory_unlock($1)', [541_802_202]);
    } finally {
      client?.release();
      await pool.end();
    }
  }
}

void main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
