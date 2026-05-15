INSERT INTO users (
  google_sub,
  institutional_email,
  first_name,
  last_name,
  display_name,
  role_id,
  carrera_id,
  ceal_id,
  is_active
)
SELECT
  NULL,
  v.institutional_email,
  v.first_name,
  v.last_name,
  v.display_name,
  roles.id,
  carreras.id,
  ceals.id,
  TRUE
FROM (
  VALUES
    ('student.demo@ucn.cl', 'Demo', 'Estudiante', 'Estudiante demo', 'student'::text, NULL::text),
    ('ceal.demo@ucn.cl', 'Demo', 'CEAL', 'Representante CEAL demo', 'ceal', 'ceal-informatica'),
    ('jefatura.demo@ucn.cl', 'Demo', 'Jefatura', 'Jefatura demo', 'jefatura', NULL::text),
    ('admin.demo@ucn.cl', 'Demo', 'Admin', 'Administrador demo', 'admin', NULL::text)
) AS v(institutional_email, first_name, last_name, display_name, role_code, ceal_code)
JOIN roles ON roles.code = v.role_code
LEFT JOIN carreras ON carreras.code = 'informatica'
LEFT JOIN ceals ON ceals.code = v.ceal_code
ON CONFLICT (institutional_email) DO UPDATE
SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  display_name = EXCLUDED.display_name,
  role_id = EXCLUDED.role_id,
  carrera_id = EXCLUDED.carrera_id,
  ceal_id = EXCLUDED.ceal_id,
  is_active = EXCLUDED.is_active;
