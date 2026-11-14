'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isDatabaseConfigured } from '@/lib/database';
import { enrollStudent, reEnrollStudent, studentEnrollmentSchema } from '@/lib/studentLifecycle';
import { schoolService } from '@/services/schoolService';
import { requireDirector } from '@/lib/authorization';

const reEnrollmentSchema = z.object({
  studentId: z.string().min(1),
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/),
  gradeLevel: z.string().min(1).max(80),
  status: z.enum(['Nouveau', 'Passant', 'Redoublant', 'Transféré', 'Candidat Examen']),
  totalTuition: z.coerce.number().min(0).max(1_000_000_000),
  paidTuition: z.coerce.number().min(0).max(1_000_000_000),
  enteredAt: z.string().date(),
}).refine(value => value.paidTuition <= value.totalTuition, {
  message: 'Le montant payé ne peut pas dépasser les frais totaux.',
  path: ['paidTuition'],
});

export async function createStudentEnrollmentAction(rawInput: unknown) {
  await requireDirector();
  const input = studentEnrollmentSchema.parse(rawInput);

  if (isDatabaseConfigured) {
    const created = await enrollStudent(input);
    revalidatePath('/eleves');
    revalidatePath('/');
    revalidatePath('/finances');
    return created;
  }

  const student = schoolService.addStudent({
    nom: input.lastName,
    prenom: input.firstName,
    sexe: input.gender ?? 'M',
    dateNaissance: input.birthDate,
    tuteurNom: input.guardianName,
    tuteurTelephone: input.guardianPhone,
    dateInscription: input.enteredAt,
    anneeScolaire: input.schoolYear,
    classe: input.gradeLevel as import('@/types').GradeLevel,
    statut: input.status as import('@/types').StudentStatus,
    fraisScolariteTotal: input.totalTuition,
    fraisScolaritePayes: input.paidTuition,
    ecolePrecedente: input.previousSchool || undefined,
  });
  revalidatePath('/eleves');
  revalidatePath('/');
  revalidatePath('/finances');
  return { id: student.id, registrationNumber: student.matricule };
}

export async function reEnrollStudentAction(rawInput: unknown) {
  await requireDirector();
  if (!isDatabaseConfigured) {
    throw new Error('La réinscription annuelle nécessite une base PostgreSQL configurée.');
  }

  const input = reEnrollmentSchema.parse(rawInput);
  const result = await reEnrollStudent(input);
  revalidatePath('/eleves');
  revalidatePath('/');
  revalidatePath('/finances');
  return result;
}
