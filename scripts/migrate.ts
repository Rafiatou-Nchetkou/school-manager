import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Configurez DATABASE_URL avant npm run db:migrate.');
}

const pool = new Pool({ connectionString, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
const client = await pool.connect();
const migrations = ['001_student_lifecycle', '002_teachers', '003_auth_users'];

try {
  await client.query('SELECT pg_advisory_lock($1)', [541_802_202]);
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  for (const migrationId of migrations) {
    const current = await client.query('SELECT id FROM schema_migrations WHERE id = $1', [migrationId]);
    if (current.rowCount) {
      console.log(`${migrationId} already applied`);
      continue;
    }
    const sql = await readFile(path.join(process.cwd(), 'database', 'migrations', `${migrationId}.sql`), 'utf8');
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [migrationId]);
      await client.query('COMMIT');
      console.log(`${migrationId} applied`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
} finally {
  await client.query('SELECT pg_advisory_unlock($1)', [541_802_202]);
  client.release();
  await pool.end();
}
