'use server';

import { schoolService } from '@/services/schoolService';
import { revalidatePath } from 'next/cache';

export async function assignClassTeacherAction(classId: string, teacherId: string) {
  // Si l'ID est "none", on met null (retirer l'enseignant)
  const idToAssign = teacherId === 'none' ? null : teacherId;
  
  await schoolService.assignClassTeacher(classId, idToAssign);
  
  // On demande à Next.js de rafraîchir les données de la page
  revalidatePath('/classes');
}