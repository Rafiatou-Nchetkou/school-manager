CREATE TABLE IF NOT EXISTS school_years (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  starts_on date,
  ends_on date,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT school_year_dates_valid CHECK (starts_on IS NULL OR ends_on IS NULL OR starts_on <= ends_on)
);

CREATE UNIQUE INDEX IF NOT EXISTS school_years_one_active_idx
  ON school_years (is_active) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS grade_levels (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  registration_number text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  gender char(1) CHECK (gender IS NULL OR gender IN ('M', 'F')),
  birth_date date,
  guardian_name text,
  guardian_phone text,
  previous_school text,
  is_incomplete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS students_name_idx ON students (last_name, first_name);

CREATE TABLE IF NOT EXISTS classrooms (
  id text PRIMARY KEY,
  grade_level_id text NOT NULL REFERENCES grade_levels(id) ON DELETE RESTRICT,
  school_year_id text NOT NULL REFERENCES school_years(id) ON DELETE RESTRICT,
  head_teacher_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (grade_level_id, school_year_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id text PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  classroom_id text NOT NULL REFERENCES classrooms(id) ON DELETE RESTRICT,
  school_year_id text NOT NULL REFERENCES school_years(id) ON DELETE RESTRICT,
  registration_number text NOT NULL,
  status text NOT NULL CHECK (status IN ('Nouveau', 'Passant', 'Redoublant', 'Transféré', 'Candidat Examen', 'Incomplet')),
  entered_at date NOT NULL DEFAULT CURRENT_DATE,
  total_tuition numeric(12, 2) NOT NULL DEFAULT 0 CHECK (total_tuition >= 0),
  paid_tuition numeric(12, 2) NOT NULL DEFAULT 0 CHECK (paid_tuition >= 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, school_year_id),
  UNIQUE (registration_number)
);

CREATE INDEX IF NOT EXISTS enrollments_year_class_idx ON enrollments (school_year_id, classroom_id);
CREATE INDEX IF NOT EXISTS enrollments_status_idx ON enrollments (school_year_id, status);

CREATE TABLE IF NOT EXISTS student_transfers (
  id text PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  enrollment_id text REFERENCES enrollments(id) ON DELETE SET NULL,
  direction text NOT NULL CHECK (direction IN ('Entrant', 'Sortant')),
  occurred_at date NOT NULL,
  origin text,
  destination text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS student_transfers_student_date_idx ON student_transfers (student_id, occurred_at);

CREATE TABLE IF NOT EXISTS evaluation_periods (
  id text PRIMARY KEY,
  school_year_id text NOT NULL REFERENCES school_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  starts_on date,
  ends_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_year_id, name),
  CONSTRAINT evaluation_period_dates_valid CHECK (starts_on IS NULL OR ends_on IS NULL OR starts_on <= ends_on)
);

CREATE TABLE IF NOT EXISTS assessment_results (
  id text PRIMARY KEY,
  enrollment_id text NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  evaluation_period_id text NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
  subject text NOT NULL,
  score numeric(6, 2),
  result text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id, evaluation_period_id, subject)
);

INSERT INTO grade_levels (id, name, label, position)
VALUES
  ('grade-sil', 'SIL', 'SIL', 1),
  ('grade-cp', 'CP', 'CP', 2),
  ('grade-ce1', 'CE1', 'CE1', 3),
  ('grade-ce2', 'CE2', 'CE2', 4),
  ('grade-cm1', 'CM1', 'CM1', 5),
  ('grade-cm2', 'CM2', 'CM2', 6)
ON CONFLICT (name) DO NOTHING;

INSERT INTO school_years (id, name, is_active)
VALUES ('school-year-2026-2027', '2026-2027', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO classrooms (id, grade_level_id, school_year_id)
SELECT 'classroom-' || gl.name || '-2026-2027', gl.id, sy.id
FROM grade_levels gl
CROSS JOIN school_years sy
WHERE sy.name = '2026-2027' AND gl.is_active = true
ON CONFLICT (grade_level_id, school_year_id) DO NOTHING;
