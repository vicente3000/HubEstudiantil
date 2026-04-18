CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE carreras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  school_name TEXT NOT NULL DEFAULT 'Escuela de Ingenieria',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ceals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrera_id UUID NOT NULL REFERENCES carreras(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  institutional_email TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE peticion_estados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub TEXT UNIQUE,
  institutional_email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  carrera_id UUID REFERENCES carreras(id) ON DELETE SET NULL,
  ceal_id UUID REFERENCES ceals(id) ON DELETE SET NULL,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE avisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  ceal_id UUID REFERENCES ceals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  visibility_scope TEXT NOT NULL DEFAULT 'public',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT avisos_visibility_scope_check CHECK (visibility_scope IN ('public', 'ceal', 'internal')),
  CONSTRAINT avisos_status_check CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE TABLE actividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  ceal_id UUID REFERENCES ceals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  place TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  capacity INTEGER,
  registration_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT actividades_capacity_check CHECK (capacity IS NULL OR capacity > 0),
  CONSTRAINT actividades_status_check CHECK (status IN ('draft', 'published', 'cancelled', 'completed'))
);

CREATE TABLE hilos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  ceal_id UUID REFERENCES ceals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT hilos_status_check CHECK (status IN ('open', 'closed'))
);

CREATE TABLE hilo_mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hilo_id UUID NOT NULL REFERENCES hilos(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE peticiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_ceal_id UUID REFERENCES ceals(id) ON DELETE SET NULL,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  elevated_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  current_status_id UUID NOT NULL REFERENCES peticion_estados(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  resolution_notes TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT peticiones_priority_check CHECK (priority IN ('low', 'medium', 'high'))
);

CREATE TABLE peticion_historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peticion_id UUID NOT NULL REFERENCES peticiones(id) ON DELETE CASCADE,
  status_id UUID NOT NULL REFERENCES peticion_estados(id) ON DELETE RESTRICT,
  changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE repositorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ceal_id UUID NOT NULL REFERENCES ceals(id) ON DELETE CASCADE,
  scope TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repositorios_scope_check CHECK (scope IN ('shared', 'private_ceal')),
  CONSTRAINT repositorios_scope_unique UNIQUE (ceal_id, scope)
);

CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repositorio_id UUID NOT NULL REFERENCES repositorios(id) ON DELETE CASCADE,
  uploaded_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  drive_file_id TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  version_label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT documentos_size_bytes_check CHECK (size_bytes IS NULL OR size_bytes >= 0)
);

CREATE INDEX idx_ceals_carrera_id ON ceals(carrera_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_carrera_id ON users(carrera_id);
CREATE INDEX idx_users_ceal_id ON users(ceal_id);
CREATE INDEX idx_avisos_ceal_id ON avisos(ceal_id);
CREATE INDEX idx_avisos_status_published_at ON avisos(status, published_at DESC);
CREATE INDEX idx_actividades_ceal_id ON actividades(ceal_id);
CREATE INDEX idx_actividades_status_starts_at ON actividades(status, starts_at);
CREATE INDEX idx_hilos_status_created_at ON hilos(status, created_at DESC);
CREATE INDEX idx_hilo_mensajes_hilo_id_created_at ON hilo_mensajes(hilo_id, created_at);
CREATE INDEX idx_peticiones_requester_user_id ON peticiones(requester_user_id);
CREATE INDEX idx_peticiones_assigned_ceal_id ON peticiones(assigned_ceal_id);
CREATE INDEX idx_peticiones_current_status_id ON peticiones(current_status_id);
CREATE INDEX idx_peticion_historial_peticion_id_created_at ON peticion_historial(peticion_id, created_at);
CREATE INDEX idx_documentos_repositorio_id_created_at ON documentos(repositorio_id, created_at DESC);

CREATE TRIGGER trg_carreras_set_updated_at
BEFORE UPDATE ON carreras
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_ceals_set_updated_at
BEFORE UPDATE ON ceals
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_avisos_set_updated_at
BEFORE UPDATE ON avisos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_actividades_set_updated_at
BEFORE UPDATE ON actividades
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_hilos_set_updated_at
BEFORE UPDATE ON hilos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_hilo_mensajes_set_updated_at
BEFORE UPDATE ON hilo_mensajes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_peticiones_set_updated_at
BEFORE UPDATE ON peticiones
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_repositorios_set_updated_at
BEFORE UPDATE ON repositorios
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_documentos_set_updated_at
BEFORE UPDATE ON documentos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
