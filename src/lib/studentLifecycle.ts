import 'server-only';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { getDatabasePool } from '@/lib/database';
import type { Student, StudentStatus } from '@/types';

const gradeLevelSchema = z.string().trim().min(1).max(80);
const enrollmentStatusSchema = z.enum(['Nouveau', 'Passant', 'Redoublant', 'Transféré', 'Candidat Examen', 'Incomplet']);

export const studentEnrollmentSchema = z.object({
  firstName: z.string().trim().max(120).optional().default(''),
  lastName: z.string().trim().max(120).optional().default(''),
  gender: z.enum(['M', 'F']).optional(),
  birthDate: z.string().optional().default(''),
  guardianName: z.string().trim().max(180).optional().default(''),
  guardianPhone: z.string().trim().max(40).optional().default(''),
  previousSchool: z.string().trim().max(180).optional().default(''),
  gradeLevel: gradeLevelSchema,
  schoolYear: z.string().trim().regex(/^\d{4}-\d{4}$/),
  status: enrollmentStatusSchema,
  totalTuition: z.coerce.number().min(0).max(1_000_000_000),
  paidTuition: z.coerce.number().min(0).max(1_000_000_000),
  enteredAt: z.string().date(),
  transferDirection: z.enum(['Entrant', 'Sortant']).optional(),
  transferOrigin: z.string().trim().max(180).optional().default(''),
  transferDestination: z.string().trim().max(180).optional().default(''),
}).refine(value => value.paidTuition <= value.totalTuition, {
  message: 'Le montant payé ne peut pas dépasser les frais totaux.',
  path: ['paidTuition'],
});

export type StudentEnrollmentInput = z.infer<typeof studentEnrollmentSchema>;

export type EnrolledStudentRow = Student & { isIncomplete: boolean };

function toRow(row: Record<string, unknown>): EnrolledStudentRow {
  return {
    id: String(row.student_id),
    matricule: String(row.registration_number),
    nom: String(row.last_name ?? ''),
    prenom: String(row.first_name ?? ''),
    sexe: row.gender === 'M' || row.gender === 'F' ? row.gender : null,
    dateNaissance: row.birth_date ? new Date(String(row.birth_date)).toISOString().slice(0, 10) : '',
    tuteurNom: row.guardian_name ? String(row.guardian_name) : '',
    tuteurTelephone: row.guardian_phone ? String(row.guardian_phone) : '',
    dateInscription: new Date(String(row.entered_at)).toISOString().slice(0, 10),
    anneeScolaire: String(row.school_year),
    classe: String(row.grade_level),
    statut: String(row.status) as StudentStatus,
    fraisScolariteTotal: Number(row.total_tuition),
    fraisScolaritePayes: Number(row.paid_tuition),
    ecolePrecedente: row.previous_school ? String(row.previous_school) : undefined,
    isIncomplete: Boolean(row.is_incomplete),
  };
}

export async function listEnrolledStudents(input: {
  schoolYear: string;
  gradeLevel?: string;
  status?: string;
  incompleteOnly?: boolean;
  search?: string;
  page: number;
  limit: number;
}) {
  const pool = getDatabasePool();
  const filters: string[] = ['sy.name = $1'];
  const values: unknown[] = [input.schoolYear];

  if (input.gradeLevel && input.gradeLevel !== 'all') {
    values.push(input.gradeLevel);
    filters.push(`gl.name = $${values.length}`);
  }
  if (input.status && input.status !== 'all') {
    values.push(input.status);
    filters.push(`e.status = $${values.length}`);
  }
  if (input.incompleteOnly) filters.push('s.is_incomplete = true');
  if (input.search?.trim()) {
    values.push(`%${input.search.trim()}%`);
    filters.push(`(s.first_name ILIKE $${values.length} OR s.last_name ILIKE $${values.length} OR e.registration_number ILIKE $${values.length})`);
  }

  const where = filters.join(' AND ');
  const countResult = await pool.query<{ total: string }>(
    `SELECT count(*)::text AS total
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     JOIN school_years sy ON sy.id = e.school_year_id
     JOIN classrooms c ON c.id = e.classroom_id
     JOIN grade_levels gl ON gl.id = c.grade_level_id
     WHERE ${where}`,
    values,
  );

  const total = Number(countResult.rows[0]?.total ?? 0);
  const offset = (input.page - 1) * input.limit;
  const pageValues = [...values, input.limit, offset];
  const dataResult = await pool.query(
    `SELECT s.id AS student_id, e.registration_number, s.first_name, s.last_name,
            s.gender, s.birth_date, s.guardian_name, s.guardian_phone,
            s.previous_school, e.entered_at, sy.name AS school_year,
            gl.name AS grade_level, e.status, e.total_tuition, e.paid_tuition,
            s.is_incomplete
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     JOIN school_years sy ON sy.id = e.school_year_id
     JOIN classrooms c ON c.id = e.classroom_id
     JOIN grade_levels gl ON gl.id = c.grade_level_id
     WHERE ${where}
     ORDER BY s.last_name, s.first_name
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    pageValues,
  );

  return {
    data: dataResult.rows.map(toRow),
    total,
    totalPages: Math.ceil(total / input.limit),
  };
}

export async function enrollStudent(input: StudentEnrollmentInput) {
  const pool = getDatabasePool();
  const client = await pool.connect();
  const studentId = randomUUID();
  const enrollmentId = randomUUID();
  const registrationNumber = `${input.schoolYear.slice(0, 4)}-${input.gradeLevel}-${studentId.slice(0, 8).toUpperCase()}`;
  const isIncomplete = !input.firstName || !input.lastName || !input.gender || !input.birthDate || !input.guardianName || !input.guardianPhone;

  try {
    await client.query('BEGIN');

    const schoolYearResult = await client.query<{ id: string }>(
      `INSERT INTO school_years (id, name, is_active)
       VALUES ($1, $2, false)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [randomUUID(), input.schoolYear],
    );
    const schoolYearId = schoolYearResult.rows[0].id;

    const gradeResult = await client.query<{ id: string }>(
      `INSERT INTO grade_levels (id, name, label, position)
       VALUES ($1, $2, $2, 0)
       ON CONFLICT (name) DO UPDATE SET is_active = true
       RETURNING id`,
      [randomUUID(), input.gradeLevel],
    );
    const gradeLevelId = gradeResult.rows[0].id;

    const classroomResult = await client.query<{ id: string }>(
      `INSERT INTO classrooms (id, grade_level_id, school_year_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (grade_level_id, school_year_id) DO UPDATE SET grade_level_id = EXCLUDED.grade_level_id
       RETURNING id`,
      [randomUUID(), gradeLevelId, schoolYearId],
    );
    const classroomId = classroomResult.rows[0].id;

    await client.query(
      `INSERT INTO students (
         id, registration_number, first_name, last_name, gender, birth_date,
         guardian_name, guardian_phone, previous_school, is_incomplete
       ) VALUES ($1, $2, $3, $4, $5, NULLIF($6, '')::date, NULLIF($7, ''), NULLIF($8, ''), NULLIF($9, ''), $10)`,
      [studentId, registrationNumber, input.firstName, input.lastName, input.gender ?? null, input.birthDate, input.guardianName, input.guardianPhone, input.previousSchool, isIncomplete],
    );

    await client.query(
      `INSERT INTO enrollments (
         id, student_id, classroom_id, school_year_id, registration_number,
         status, entered_at, total_tuition, paid_tuition, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7::date, $8, $9, $10)`,
      [enrollmentId, studentId, classroomId, schoolYearId, registrationNumber, isIncomplete ? 'Incomplet' : input.status, input.enteredAt, input.totalTuition, input.paidTuition, isIncomplete ? 'Dossier incomplet à compléter' : null],
    );

    if (input.transferDirection) {
      await client.query(
        `INSERT INTO student_transfers (id, student_id, enrollment_id, direction, occurred_at, origin, destination)
         VALUES ($1, $2, $3, $4, $5::date, NULLIF($6, ''), NULLIF($7, ''))`,
        [randomUUID(), studentId, enrollmentId, input.transferDirection, input.enteredAt, input.transferOrigin, input.transferDestination],
      );
    }

    await client.query('COMMIT');
    return { id: studentId, enrollmentId, registrationNumber };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function reEnrollStudent(input: {
  studentId: string;
  schoolYear: string;
  gradeLevel: string;
  status: StudentStatus;
  totalTuition: number;
  paidTuition: number;
  enteredAt: string;
}) {
  const pool = getDatabasePool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const schoolYearResult = await client.query<{ id: string }>(
      `INSERT INTO school_years (id, name)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [randomUUID(), input.schoolYear],
    );
    const gradeResult = await client.query<{ id: string }>(
      `INSERT INTO grade_levels (id, name, label)
       VALUES ($1, $2, $2)
       ON CONFLICT (name) DO UPDATE SET is_active = true
       RETURNING id`,
      [randomUUID(), input.gradeLevel],
    );
    const classroomResult = await client.query<{ id: string }>(
      `INSERT INTO classrooms (id, grade_level_id, school_year_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (grade_level_id, school_year_id) DO UPDATE SET grade_level_id = EXCLUDED.grade_level_id
       RETURNING id`,
      [randomUUID(), gradeResult.rows[0].id, schoolYearResult.rows[0].id],
    );

    const studentResult = await client.query<{ registration_number: string }>(
      'SELECT registration_number FROM students WHERE id = $1 FOR UPDATE',
      [input.studentId],
    );
    if (!studentResult.rowCount) throw new Error('Élève introuvable.');

    const enrollmentId = randomUUID();
    const registrationNumber = `${input.schoolYear.slice(0, 4)}-${input.gradeLevel}-${studentResult.rows[0].registration_number}`;
    await client.query(
      `INSERT INTO enrollments (id, student_id, classroom_id, school_year_id, registration_number, status, entered_at, total_tuition, paid_tuition)
      VALUES ($1, $2, $3, $4, $5, $6, $7::date, $8, $9)`,
      [enrollmentId, input.studentId, classroomResult.rows[0].id, schoolYearResult.rows[0].id, registrationNumber, input.status, input.enteredAt, input.totalTuition, input.paidTuition],
    );

    await client.query('COMMIT');
    return { enrollmentId, registrationNumber };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function recordStudentTransfer(input: {
  studentId: string;
  enrollmentId?: string;
  occurredAt: string;
  destination?: string;
  notes?: string;
}) {
  const pool = getDatabasePool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO student_transfers (id, student_id, enrollment_id, direction, occurred_at, destination, notes)
       VALUES ($1, $2, $3, 'Sortant', $4::date, NULLIF($5, ''), NULLIF($6, ''))`,
      [randomUUID(), input.studentId, input.enrollmentId ?? null, input.occurredAt, input.destination ?? '', input.notes ?? ''],
    );
    if (input.enrollmentId) {
      await client.query(
        `UPDATE enrollments SET status = 'Transféré', updated_at = now() WHERE id = $1`,
        [input.enrollmentId],
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function createEvaluationPeriod(input: {
  schoolYear: string;
  name: string;
  startsOn?: string;
  endsOn?: string;
}) {
  const pool = getDatabasePool();
  const year = await pool.query<{ id: string }>(
    'SELECT id FROM school_years WHERE name = $1',
    [input.schoolYear],
  );
  if (!year.rowCount) throw new Error('Année scolaire inconnue.');

  const period = await pool.query(
    `INSERT INTO evaluation_periods (id, school_year_id, name, starts_on, ends_on)
     VALUES ($1, $2, $3, NULLIF($4, '')::date, NULLIF($5, '')::date)
     ON CONFLICT (school_year_id, name)
     DO UPDATE SET starts_on = EXCLUDED.starts_on, ends_on = EXCLUDED.ends_on, updated_at = now()
     RETURNING id`,
    [randomUUID(), year.rows[0].id, input.name.trim(), input.startsOn ?? '', input.endsOn ?? ''],
  );
  return period.rows[0];
}

export async function listSchoolYears() {
  const result = await getDatabasePool().query(
    'SELECT id, name, starts_on, ends_on, is_active FROM school_years ORDER BY name DESC',
  );
  return result.rows;
}

export async function listStudentsForSchoolYear(schoolYear: string) {
  return listEnrolledStudents({ schoolYear, page: 1, limit: 100_000 });
}

export async function listGradeLevels() {
  const result = await getDatabasePool().query(
    'SELECT id, name, label, position FROM grade_levels WHERE is_active = true ORDER BY position, label',
  );
  return result.rows;
}

export async function saveGradeLevel(input: { name: string; label: string; position?: number }) {
  const pool = getDatabasePool();
  const result = await pool.query(
    `INSERT INTO grade_levels (id, name, label, position, is_active)
     VALUES ($1, $2, $3, $4, true)
     ON CONFLICT (name)
     DO UPDATE SET label = EXCLUDED.label, position = EXCLUDED.position, is_active = true, updated_at = now()
     RETURNING id, name, label, position`,
    [randomUUID(), input.name.trim(), input.label.trim(), input.position ?? 0],
  );
  return result.rows[0];
}
