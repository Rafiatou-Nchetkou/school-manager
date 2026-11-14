'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isDatabaseConfigured } from '@/lib/database';
import { createTeacher } from '@/lib/schoolDirectory';
import { schoolService } from '@/services/schoolService';
import { requireDirector } from '@/lib/authorization';

const teacherSchema = z.object({
  nom: z.string().trim().min(1).max(120),
  prenom: z.string().trim().min(1).max(120),
  telephone: z.string().trim().min(1).max(40),
  statut: z.enum(['Fonctionnaire', 'Contractuel']),
  matricule: z.string().trim().max(80).optional().default(''),
});

export async function createTeacherAction(rawInput: unknown) {
  await requireDirector();
  const teacher = teacherSchema.parse(rawInput);
  const created = isDatabaseConfigured
    ? await createTeacher(teacher)
    : await schoolService.addTeacher(teacher);
  revalidatePath('/enseignants');
  revalidatePath('/classes');
  return created;
}
