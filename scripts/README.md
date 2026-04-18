# Scripts

Automatizaciones base para que el equipo pueda preparar el entorno y validar el scaffold sin repetir pasos manuales.

## Archivos disponibles

- `setup.ps1`: instala dependencias de `apps/api` y `apps/web`, y crea los `.env` locales a partir de los ejemplos cuando faltan.
- `check.ps1`: ejecuta `typecheck` y `build` del backend, mas `build` del frontend.

## Uso rapido

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\check.ps1
```

## Nota

Los scripts estan pensados para PowerShell en Windows. Si el equipo trabaja desde otro sistema operativo, puede seguir los mismos pasos manualmente desde la documentacion del proyecto.
