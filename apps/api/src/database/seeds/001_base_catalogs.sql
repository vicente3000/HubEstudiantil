INSERT INTO roles (code, name, description)
VALUES
  ('student', 'Estudiante', 'Usuario final que consulta avisos, participa en hilos y registra peticiones.'),
  ('ceal', 'Representante CEAL', 'Usuario autorizado que publica contenido y administra solicitudes y documentos.'),
  ('jefatura', 'Jefe de Carrera', 'Usuario autorizado que revisa informacion, documentos compartidos y casos elevados.'),
  ('admin', 'Administrador', 'Perfil con control operativo de accesos y configuracion minima del sistema.')
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO carreras (code, name, school_name)
VALUES
  ('informatica', 'Ingenieria Civil en Computacion e Informatica', 'Escuela de Ingenieria'),
  ('industrial', 'Ingenieria Civil Industrial', 'Escuela de Ingenieria'),
  ('minas', 'Ingenieria Civil de Minas', 'Escuela de Ingenieria'),
  ('mecanica', 'Ingenieria Civil Mecanica', 'Escuela de Ingenieria'),
  ('electrica', 'Ingenieria Civil Electrica', 'Escuela de Ingenieria')
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  school_name = EXCLUDED.school_name,
  is_active = TRUE;

INSERT INTO ceals (carrera_id, code, name, institutional_email)
SELECT
  carreras.id,
  seed.code,
  seed.name,
  seed.institutional_email
FROM (
  VALUES
    ('ceal-informatica', 'CEAL Informatica', 'ceal.informatica@ucn.cl', 'informatica'),
    ('ceal-industrial', 'CEAL Industrial', 'ceal.industrial@ucn.cl', 'industrial'),
    ('ceal-minas', 'CEAL Minas', 'ceal.minas@ucn.cl', 'minas'),
    ('ceal-mecanica', 'CEAL Mecanica', 'ceal.mecanica@ucn.cl', 'mecanica'),
    ('ceal-electrica', 'CEAL Electrica', 'ceal.electrica@ucn.cl', 'electrica')
) AS seed(code, name, institutional_email, carrera_code)
JOIN carreras ON carreras.code = seed.carrera_code
ON CONFLICT (code) DO UPDATE
SET
  carrera_id = EXCLUDED.carrera_id,
  name = EXCLUDED.name,
  institutional_email = EXCLUDED.institutional_email,
  is_active = TRUE;

INSERT INTO peticion_estados (code, name, description, sort_order, is_terminal)
VALUES
  ('ingresada', 'Ingresada', 'Peticion registrada por un estudiante y pendiente de revision.', 1, FALSE),
  ('en_revision', 'En revision', 'Peticion en analisis por parte del CEAL.', 2, FALSE),
  ('elevada_jc', 'Elevada a Jefatura', 'Peticion escalada a Jefatura de Carrera para su resolucion.', 3, FALSE),
  ('resuelta', 'Resuelta', 'Peticion con respuesta o solucion entregada al solicitante.', 4, FALSE),
  ('cerrada', 'Cerrada', 'Peticion finalizada sin nuevas acciones pendientes.', 5, TRUE)
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_terminal = EXCLUDED.is_terminal;

INSERT INTO repositorios (ceal_id, scope, name, description)
SELECT
  ceals.id,
  'shared',
  CONCAT('Repositorio compartido ', ceals.name),
  CONCAT('Espacio documental compartido entre ', ceals.name, ' y la Jefatura de Carrera.')
FROM ceals
ON CONFLICT (ceal_id, scope) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = TRUE;

INSERT INTO repositorios (ceal_id, scope, name, description)
SELECT
  ceals.id,
  'private_ceal',
  CONCAT('Repositorio privado ', ceals.name),
  CONCAT('Espacio documental de uso exclusivo para ', ceals.name, '.')
FROM ceals
ON CONFLICT (ceal_id, scope) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = TRUE;
