-- Contraseña de demostración para todos: demo1234
UPDATE users
SET password_hash = crypt('demo1234', gen_salt('bf')),
    updated_at = NOW()
WHERE institutional_email IN (
  'student.demo@ucn.cl',
  'ceal.demo@ucn.cl',
  'jefatura.demo@ucn.cl',
  'admin.demo@ucn.cl'
);
