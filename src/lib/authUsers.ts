import 'server-only';
import { getDatabasePool } from '@/lib/database';
import { verifyPassword } from '@/lib/passwords';

export type SchoolRole = 'director' | 'teacher';

export async function authenticateSchoolUser(login: string, password: string) {
  const result = await getDatabasePool().query<{
    id: string;
    email: string | null;
    login_identifier: string;
    display_name: string;
    password_hash: string;
    role: SchoolRole;
    teacher_id: string | null;
  }>(
    `SELECT id, email, login_identifier, display_name, password_hash, role, teacher_id
     FROM app_users WHERE login_identifier = $1 AND is_active = true`,
    [login.toLowerCase()],
  );
  const user = result.rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.display_name,
    role: user.role,
    teacherId: user.teacher_id,
  };
}
