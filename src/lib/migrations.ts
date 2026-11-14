import 'server-only';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getDatabasePool } from '@/lib/database';

const migrationLockId = 541_802_202;

export async function applySchoolMigrations() {
  const pool = getDatabasePool();
  const client = await pool.connect();

  try {
    await client.query('SELECT pg_advisory_lock($1)', [migrationLockId]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const migrations = ['001_student_lifecycle', '002_teachers'];
    const applied: string[] = [];
    for (const migrationId of migrations) {
      const existing = await client.query('SELECT id FROM schema_migrations WHERE id = $1', [migrationId]);
      if (existing.rowCount) continue;

      const sql = await readFile(path.join(process.cwd(), 'database', 'migrations', `${migrationId}.sql`), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [migrationId]);
        await client.query('COMMIT');
        applied.push(migrationId);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    return { applied };
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [migrationLockId]);
    client.release();
  }
}

export async function addEvaluationResult(input: {
  enrollmentId: string;
  periodId: string;
  subject: string;
  score?: number;
  result?: string;
  notes?: string;
}) {
  const pool = getDatabasePool();
  const id = randomUUID();
  await pool.query(
    `INSERT INTO assessment_results (id, enrollment_id, evaluation_period_id, subject, score, result, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (enrollment_id, evaluation_period_id, subject)
     DO UPDATE SET score = EXCLUDED.score, result = EXCLUDED.result, notes = EXCLUDED.notes, updated_at = now()`,
    [id, input.enrollmentId, input.periodId, input.subject, input.score ?? null, input.result ?? null, input.notes ?? null],
  );
}
