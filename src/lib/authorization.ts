import 'server-only';
import { auth } from '@/auth';

export async function requireRole(...allowedRoles: Array<'director' | 'teacher'>) {
  const session = await auth();
  if (!session?.user || !allowedRoles.includes(session.user.role)) {
    throw new Error('Accès refusé.');
  }
  return session.user;
}

export async function requireDirector() {
  return requireRole('director');
}
