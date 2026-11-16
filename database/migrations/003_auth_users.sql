CREATE TABLE IF NOT EXISTS app_users (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('director', 'teacher')),
  teacher_id text REFERENCES teachers(id) ON DELETE RESTRICT,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT app_users_teacher_role_check CHECK (
    (role = 'teacher' AND teacher_id IS NOT NULL) OR
    (role = 'director' AND teacher_id IS NULL)
  )
);
