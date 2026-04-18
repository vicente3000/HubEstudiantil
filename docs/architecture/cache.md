# Cache y Sesiones

La capa de cache del backend se apoya en Valkey usando el protocolo compatible con Redis.

## Objetivo

Dejar una base lista para que el equipo use cache y sesiones sin tener que volver a diseñar la conexion, los helpers o la convencion de claves.

## Variables principales

- `VALKEY_URL`
- `VALKEY_KEY_PREFIX`
- `VALKEY_DEFAULT_TTL_SECONDS`
- `VALKEY_CONNECTION_RETRIES`
- `VALKEY_CONNECTION_RETRY_DELAY_MS`

## Scripts disponibles

Desde `apps/api`:

```bash
npm run cache:check
```

## Utilidades disponibles

- `ensureCacheReady()`
- `getCache()`
- `getCacheJson()`
- `setCache()`
- `setCacheJson()`
- `deleteCache()`
- `deleteCacheByPattern()`
- `rememberCacheJson()`

## Namespaces sugeridos

- sesiones
- perfiles de usuario
- avisos
- actividades
- hilos
- peticiones
- dashboard

## Observacion

Valkey ya queda listo para cache y sesiones, pero la aplicacion aun no conecta esta capa a controladores o servicios especificos. La base queda preparada para que los programadores la usen en los modulos relevantes.
