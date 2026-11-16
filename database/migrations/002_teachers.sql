CREATE TABLE IF NOT EXISTS teachers (
  id text PRIMARY KEY,
  last_name text NOT NULL,
  first_name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL CHECK (status IN ('Fonctionnaire', 'Contractuel')),
  registration_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS teachers_registration_number_idx
  ON teachers (registration_number) WHERE registration_number IS NOT NULL AND registration_number <> '';

DO $$ BEGIN
  ALTER TABLE classrooms ADD CONSTRAINT classrooms_head_teacher_fk
    FOREIGN KEY (head_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
