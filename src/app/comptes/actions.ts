'use server';

import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { requireDirector } from '@/lib/authorization';
import { getDatabasePool } from '@/lib/database';
import { hashPassword } from '@/lib/passwords';

export type CreateAccountState = { error?: string; success?: string; loginIdentifier?: string } | undefined;

const createAccountSchema = z.object({
  email: z.preprocess(value => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().email().max(254).optional()),
  displayName: z.string().trim().min(2).max(120),
  role: z.enum(['director', 'teacher']),
  teacherId: z.preprocess(value => value === '' ? undefined : value, z.string().trim().min(1).optional()),
  password: z.string().min(12).max(256),
}).refine(value => value.role !== 'teacher' || Boolean(value.teacherId), {
  message: 'Sélectionnez le profil enseignant correspondant.',
  path: ['teacherId'],
}).refine(value => value.role !== 'director' || !value.teacherId, {
  message: 'Un compte Directrice ne peut pas être lié à un profil enseignant.',
  path: ['teacherId'],
}).refine(value => value.role !== 'director' || Boolean(value.email), {
  message: 'Une adresse e-mail est requise pour le compte Directrice.',
  path: ['email'],
});

export async function createAccountAction(_state: CreateAccountState, formData: FormData): Promise<CreateAccountState> {
  await requireDirector();
  const parsed = createAccountSchema.safeParse({
    email: formData.get('email'),
    displayName: formData.get('displayName'),
    role: formData.get('role'),
    teacherId: formData.get('teacherId'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Vérifiez les informations saisies.' };

  const { email, displayName, role, teacherId, password } = parsed.data;
  const normalizedEmail = email?.toLowerCase() ?? null;
  const loginIdentifier = normalizedEmail ?? `ens-${randomUUID().slice(0, 12)}`;
  const pool = getDatabasePool();
  const existing = await pool.query('SELECT 1 FROM app_users WHERE login_identifier = $1', [loginIdentifier]);
  if (existing.rowCount) return { error: 'Un compte utilise déjà cet e-mail ou identifiant.' };

  try {
    await pool.query(
      `INSERT INTO app_users (id, email, login_identifier, display_name, password_hash, role, teacher_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [randomUUID(), normalizedEmail, loginIdentifier, displayName, await hashPassword(password), role, teacherId ?? null],
    );
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return { error: 'Un compte ou ce profil enseignant est déjà associé à une adresse.' };
    }
    throw error;
  }

  return { success: `Le compte ${role === 'director' ? 'Directrice' : 'Enseignant'} a été créé.`, loginIdentifier };
}
