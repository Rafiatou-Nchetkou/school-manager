import 'server-only';
import { randomUUID } from 'node:crypto';
import { getDatabasePool } from '@/lib/database';
import type { Classroom, Teacher } from '@/types';

export async function listTeachers(input: { search?: string; status?: string } = {}) {
  const values: unknown[] = [];
  const filters: string[] = [];
  if (input.status && input.status !== 'all') {
    values.push(input.status);
    filters.push(`t.status = $${values.length}`);
  }
  if (input.search?.trim()) {
    values.push(`%${input.search.trim()}%`);
    filters.push(`(t.last_name ILIKE $${values.length} OR t.first_name ILIKE $${values.length} OR COALESCE(t.registration_number, '') ILIKE $${values.length})`);
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await getDatabasePool().query(
    `SELECT t.id, t.last_name AS nom, t.first_name AS prenom, t.phone AS telephone,
            t.status AS statut, t.registration_number AS matricule,
            (SELECT gl.name FROM classrooms c JOIN grade_levels gl ON gl.id = c.grade_level_id
             JOIN school_years sy ON sy.id = c.school_year_id
             WHERE c.head_teacher_id = t.id AND sy.is_active = true LIMIT 1) AS "className"
     FROM teachers t ${where} ORDER BY t.last_name, t.first_name`, values,
  );
  return { data: result.rows as (Teacher & { className: string | null })[], total: result.rowCount ?? 0 };
}

export async function createTeacher(input: Omit<Teacher, 'id'>) {
  const result = await getDatabasePool().query(
    `INSERT INTO teachers (id, last_name, first_name, phone, status, registration_number)
     VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''))
     RETURNING id, last_name AS nom, first_name AS prenom, phone AS telephone, status AS statut, registration_number AS matricule`,
    [randomUUID(), input.nom.trim(), input.prenom.trim(), input.telephone.trim(), input.statut, input.matricule?.trim() ?? ''],
  );
  return result.rows[0] as Teacher;
}

export async function listClassrooms(schoolYear: string) {
  const result = await getDatabasePool().query(
    `SELECT c.id, gl.name AS nom, sy.name AS "anneeScolaire", c.head_teacher_id AS "enseignantTitulaireId",
       t.id AS "teacherId", t.last_name AS "teacherNom", t.first_name AS "teacherPrenom",
       t.phone AS "teacherTelephone", t.status AS "teacherStatut", t.registration_number AS "teacherMatricule",
       count(e.id)::int AS "studentCount"
     FROM classrooms c JOIN grade_levels gl ON gl.id = c.grade_level_id
     JOIN school_years sy ON sy.id = c.school_year_id
     LEFT JOIN teachers t ON t.id = c.head_teacher_id
     LEFT JOIN enrollments e ON e.classroom_id = c.id
     WHERE sy.name = $1 AND gl.is_active = true
     GROUP BY c.id, gl.name, sy.name, t.id ORDER BY gl.position, gl.label`, [schoolYear],
  );
  return result.rows.map(row => ({
    id: row.id, nom: row.nom, anneeScolaire: row.anneeScolaire,
    enseignantTitulaireId: row.enseignantTitulaireId,
    studentCount: row.studentCount,
    teacher: row.teacherId ? {
      id: row.teacherId, nom: row.teacherNom, prenom: row.teacherPrenom,
      telephone: row.teacherTelephone, statut: row.teacherStatut, matricule: row.teacherMatricule ?? undefined,
    } as Teacher : undefined,
  })) as (Classroom & { teacher?: Teacher; studentCount: number })[];
}

export async function assignTeacher(classroomId: string, teacherId: string | null) {
  const result = await getDatabasePool().query(
    `UPDATE classrooms SET head_teacher_id = $2, updated_at = now() WHERE id = $1 RETURNING id`,
    [classroomId, teacherId],
  );
  if (!result.rowCount) throw new Error('Classe introuvable.');
}
