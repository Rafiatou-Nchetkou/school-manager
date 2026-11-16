ALTER TABLE app_users ALTER COLUMN email DROP NOT NULL;
ALTER TABLE app_users ADD COLUMN login_identifier text;
UPDATE app_users SET login_identifier = lower(email);
ALTER TABLE app_users ALTER COLUMN login_identifier SET NOT NULL;

CREATE UNIQUE INDEX app_users_login_identifier_idx ON app_users (login_identifier);
CREATE UNIQUE INDEX app_users_teacher_id_idx ON app_users (teacher_id) WHERE teacher_id IS NOT NULL;

ALTER TABLE teachers ADD COLUMN email text;
CREATE UNIQUE INDEX teachers_email_idx ON teachers (lower(email)) WHERE email IS NOT NULL AND email <> '';
