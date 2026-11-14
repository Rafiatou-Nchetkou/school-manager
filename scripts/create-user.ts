import { randomUUID } from 'node:crypto';
import { loadEnvConfig } from '@next/env';
import { Pool } from 'pg';
import { z } from 'zod';
import { hashPassword } from '@/lib/passwords';

loadEnvConfig(process.cwd());

const inputSchema = z.object({
  email: z.string().trim().email().max(254),
  role: z.enum(['director', 'teacher']),
  displayName: z.string().trim().min(2).max(120),
  teacherId: z.string().trim().min(1).optional(),
  password: z.string().min(12).max(256),
}).refine(value => value.role !== 'teacher' || Boolean(value.teacherId), {
  message: 'Un enseignant doit être lié à un profil enseignant existant.',
  path: ['teacherId'],
}).refine(value => value.role !== 'director' || !value.teacherId, {
  message: 'Le compte Directrice ne doit pas avoir de teacherId.',
  path: ['teacherId'],
});

async function main() {
  const [email, role, displayName, teacherId] = process.argv.slice(2);
  const parsed = inputSchema.safeParse({
    email,
    role,
    displayName,
    teacherId: teacherId || undefined,
    password: process.env.SCHOOL_USER_PASSWORD,
  });

  if (!parsed.success) {
    console.error('Usage: SCHOOL_USER_PASSWORD=<mot-de-passe-long> npm run user:create -- <email> <director|teacher> <nom-affiché> [teacherId]');
    console.error(parsed.error.issues.map(issue => issue.message).join('\n'));
    process.exitCode = 1;
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Configurez DATABASE_URL.');
  const pool = new Pool({ connectionString: databaseUrl, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
  try {
    const passwordHash = await hashPassword(parsed.data.password);
    await pool.query(
      `INSERT INTO app_users (id, email, display_name, password_hash, role, teacher_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [randomUUID(), parsed.data.email.toLowerCase(), parsed.data.displayName, passwordHash, parsed.data.role, parsed.data.teacherId ?? null],
    );
    console.log(`Compte ${parsed.data.role} créé pour ${parsed.data.email.toLowerCase()}.`);
  } finally {
    await pool.end();
  }
}

void main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
