# Migrations

Migraciones SQL versionadas de PostgreSQL.

## Convencion

- Se ejecutan en orden alfabetico.
- Cada archivo debe ser idempotente dentro de lo razonable o depender de `schema_migrations`.
- El primer archivo crea el esquema base del MVP.
