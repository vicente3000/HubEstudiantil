# Podman

Archivos base para levantar el entorno de desarrollo del proyecto con contenedores.

## Servicios incluidos

- `web`: contenedor del frontend
- `api`: contenedor del backend
- `db-init`: inicializacion de migraciones y seeds
- `postgres`: base de datos principal
- `valkey`: cache y sesiones

## Archivos principales

- `podman-compose.yml`: orquestacion de servicios
- `Containerfile.web`: imagen base del frontend
- `Containerfile.api`: imagen base del backend
- `.env.example`: variables de entorno sugeridas
- `../../scripts/setup.ps1`: bootstrap local de dependencias
- `../../scripts/check.ps1`: verificacion rapida del scaffold

## Uso base

1. Copiar `infra/podman/.env.example` a `infra/podman/.env` si se quieren personalizar variables.
2. Levantar los servicios con:

```bash
podman compose -f infra/podman/podman-compose.yml up --build
```

3. Detener los servicios con:

```bash
podman compose -f infra/podman/podman-compose.yml down
```

## Preparar la base de datos

Para inicializar el esquema y los catalogos base:

```bash
podman compose -f infra/podman/podman-compose.yml run --rm db-init
```

## Verificar Valkey

Con el servicio `valkey` levantado, el backend puede verificar la conectividad con:

```bash
cd apps/api
npm run cache:check
```

## Estado actual

El scaffold ya incluye:

- frontend React + Vite con rutas, layout y modulos base
- backend Express + TypeScript con middlewares, health check y rutas por modulo
- migraciones y seeds de PostgreSQL
- capa de cache con Valkey

## Flujo recomendado

1. Ejecutar `scripts/setup.ps1` para instalar dependencias y generar `.env` locales.
2. Levantar `postgres` y `valkey` con Podman.
3. Ejecutar `db-init` o correr `npm run db:setup` en `apps/api`.
4. Iniciar `api` y `web` con `podman compose` o en modo local con `npm run dev`.
