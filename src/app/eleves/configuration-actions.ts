'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isDatabaseConfigured } from '@/lib/database';
import { createEvaluationPeriod, saveGradeLevel } from '@/lib/studentLifecycle';

const gradeLevelSchema = z.object({
  name: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
  position: z.coerce.number().int().min(0).max(10_000).default(0),
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
  if (!isDatabaseConfigured) throw new Error('Cette configuration nécessite DATABASE_URL.');
}

export async function saveGradeLevelAction(rawInput: unknown) {
  requireDatabase();
  const result = await saveGradeLevel(gradeLevelSchema.parse(rawInput));
  revalidatePath('/eleves');
  revalidatePath('/classes');
  return result;
}

export async function saveEvaluationPeriodAction(rawInput: unknown) {
  requireDatabase();
  const result = await createEvaluationPeriod(evaluationPeriodSchema.parse(rawInput));
  revalidatePath('/eleves');
  return result;
}
