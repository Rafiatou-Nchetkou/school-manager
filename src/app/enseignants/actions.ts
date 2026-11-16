'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isDatabaseConfigured } from '@/lib/database';
import { createTeacherWithAccount } from '@/lib/schoolDirectory';
import { requireDirector } from '@/lib/authorization';

const teacherSchema = z.object({
  nom: z.string().trim().min(1).max(120),
  prenom: z.string().trim().min(1).max(120),
  telephone: z.string().trim().min(1).max(40),
  email: z.preprocess(value => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().email().max(254).optional()),
  statut: z.enum(['Fonctionnaire', 'Contractuel']),
  matricule: z.string().trim().max(80).optional().default(''),
  password: z.string().min(12).max(256),
});

export type CreateTeacherState = { error?: string; success?: string; loginIdentifier?: string } | undefined;

export async function createTeacherAction(rawInput: unknown): Promise<CreateTeacherState> {
  await requireDirector();
  const parsed = teacherSchema.safeParse(rawInput);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Vérifiez les informations saisies.' };
  if (!isDatabaseConfigured) return { error: 'Configurez PostgreSQL avant de créer un compte enseignant.' };
  try {
    const created = await createTeacherWithAccount(parsed.data);
    revalidatePath('/enseignants');
    revalidatePath('/classes');
    return { success: 'La fiche et le compte enseignant ont été créés.', loginIdentifier: created.loginIdentifier };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return { error: 'Cette adresse e-mail ou ce matricule est déjà utilisé.' };
    }
    throw error;
  }
}
