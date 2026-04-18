# Base de Datos

La base de datos principal del proyecto se implementa sobre PostgreSQL y queda preparada con migraciones SQL versionadas y seeds idempotentes.

## Objetivo

Dejar una base estable para que el equipo de desarrollo pueda concentrarse en la logica de negocio sin tener que diseñar desde cero el esquema principal del MVP.

## Scripts disponibles

Desde `apps/api`:

```bash
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:setup
```

## Modulos y tablas principales

| Modulo | Tablas principales |
| --- | --- |
| Autenticacion y usuarios | `roles`, `users` |
| Estructura academica | `carreras`, `ceals` |
| Avisos | `avisos` |
| Actividades | `actividades` |
| Hilos | `hilos`, `hilo_mensajes` |
| Peticiones | `peticion_estados`, `peticiones`, `peticion_historial` |
| Documentos | `repositorios`, `documentos` |

## Criterios del esquema

- claves primarias UUID con `gen_random_uuid()`
- nombres en `snake_case`
- timestamps `created_at` y `updated_at`
- catalogos separados para roles y estados
- indices en columnas de consulta frecuente
- seeds re-ejecutables

## Datos iniciales incluidos

- roles del sistema
- carreras base
- CEALES iniciales
- estados base de peticiones
- repositorios compartidos y privados por CEAL
