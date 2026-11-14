'use server';

import { schoolService } from '@/services/schoolService';
import { revalidatePath } from 'next/cache';
import { isDatabaseConfigured } from '@/lib/database';
import { assignTeacher } from '@/lib/schoolDirectory';
import { z } from 'zod';

export async function assignClassTeacherAction(classId: string, teacherId: string) {
  const classroomId = z.string().min(1).max(100).parse(classId);
  const selectedTeacherId = z.union([z.literal('none'), z.string().min(1).max(100)]).parse(teacherId);
  // Si l'ID est "none", on met null (retirer l'enseignant)
  const idToAssign = selectedTeacherId === 'none' ? null : selectedTeacherId;
  
  if (isDatabaseConfigured) {
    await assignTeacher(classroomId, idToAssign);
  } else {
    await schoolService.assignClassTeacher(classroomId, idToAssign);
  }
  
  // On demande à Next.js de rafraîchir les données de la page
  revalidatePath('/classes');
}
