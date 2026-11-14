'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isDatabaseConfigured } from '@/lib/database';
import { createEvaluationPeriod, recordStudentTransfer, reEnrollStudent } from '@/lib/studentLifecycle';
import { requireDirector } from '@/lib/authorization';

const transferSchema = z.object({
  studentId: z.string().min(1),
  enrollmentId: z.string().optional(),
  occurredAt: z.string().date(),
  destination: z.string().trim().max(180).optional(),
  notes: z.string().trim().max(1000).optional(),
});

const reEnrollmentSchema = z.object({
  studentId: z.string().min(1),
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/),
  gradeLevel: z.string().trim().min(1).max(80),
  status: z.enum(['Nouveau', 'Passant', 'Redoublant', 'Transféré', 'Candidat Examen']),
  totalTuition: z.coerce.number().min(0),
  paidTuition: z.coerce.number().min(0),
  enteredAt: z.string().date(),
}).refine(value => value.paidTuition <= value.totalTuition, {
  message: 'Le montant payé ne peut pas dépasser les frais totaux.',
  path: ['paidTuition'],
});

const evaluationPeriodSchema = z.object({
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/),
  name: z.string().trim().min(1).max(100),
  startsOn: z.string().optional(),
  endsOn: z.string().optional(),
}).refine(value => !value.startsOn || !value.endsOn || value.startsOn <= value.endsOn, {
  message: 'La fin de période doit être postérieure au début.',
  path: ['endsOn'],
});

function requireDatabase() {
  if (!isDatabaseConfigured) {
    throw new Error('Cette opération nécessite une base PostgreSQL configurée via DATABASE_URL.');
  }
}

export async function reEnrollStudentAction(rawInput: unknown) {
  await requireDirector();
  requireDatabase();
  const result = await reEnrollStudent(reEnrollmentSchema.parse(rawInput));
  revalidatePath('/eleves');
  revalidatePath('/');
  revalidatePath('/finances');
  return result;
}

export async function recordStudentTransferAction(rawInput: unknown) {
  await requireDirector();
  requireDatabase();
  const result = await recordStudentTransfer(transferSchema.parse(rawInput));
  revalidatePath('/eleves');
  revalidatePath('/');
  return result;
}

export async function saveEvaluationPeriodAction(rawInput: unknown) {
  await requireDirector();
  requireDatabase();
  const result = await createEvaluationPeriod(evaluationPeriodSchema.parse(rawInput));
  revalidatePath('/eleves');
  return result;
}
