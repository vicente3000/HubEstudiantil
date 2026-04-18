# Hub Estudiantil

Hub Estudiantil es un proyecto web orientado a centralizar la comunicacion entre los CEALES de la Escuela de Ingenieria, los estudiantes y las jefaturas. Su proposito es reemplazar canales dispersos e informales por una plataforma unica donde sea posible publicar informacion oficial, mantener conversaciones, registrar solicitudes y gestionar documentos de forma ordenada.

## De que trata el proyecto

El proyecto busca resolver un problema concreto: hoy gran parte de los avisos, actividades, inquietudes y peticiones estudiantiles se manejan por medios separados, lo que dificulta la trazabilidad, el acceso oportuno a la informacion y la coordinacion entre actores.

Hub Estudiantil propone una solucion web con acceso autenticado, organizada por roles, que permita:

- publicar avisos, noticias y actividades
- abrir y responder hilos de conversacion
- registrar peticiones y hacer seguimiento de su estado
- compartir documentos entre CEAL y jefatura
- mantener un espacio privado de documentacion para cada CEAL
- administrar accesos basicos segun perfil

## Objetivo general

Desarrollar un MVP web funcional, claro y escalable que fortalezca la comunicacion entre los CEALES y la comunidad estudiantil mediante una plataforma centralizada, segura y facil de usar.

## Usuarios principales

| Rol | Funcion dentro del sistema |
| --- | --- |
| Estudiante | Consulta avisos, participa en hilos y registra peticiones. |
| Representante CEAL | Publica contenido, responde hilos, gestiona peticiones y administra documentos. |
| Jefe de Carrera | Revisa informacion, participa en espacios compartidos y accede al repositorio comun con CEAL. |
| Administrador | Controla usuarios autorizados, perfiles y accesos del sistema. |

## Modulos principales del sistema

- autenticacion de acceso
- panel principal por rol
- avisos, noticias y actividades
- hilos estudiantiles
- peticiones con seguimiento basico
- repositorio compartido CEAL / Jefatura
- repositorio privado CEAL
- gestion de usuarios

## Stack tecnologico propuesto

La arquitectura del proyecto esta pensada con tecnologias modernas, ampliamente utilizadas y con licencias permisivas para la base del sistema.

| Capa | Tecnologia | Uso dentro del proyecto | Licencia o tipo |
| --- | --- | --- | --- |
| Frontend | React | Construccion de la interfaz principal como SPA. | MIT |
| Frontend | Vite | Entorno de desarrollo y build rapido para la aplicacion. | MIT |
| Frontend | Tailwind CSS | Estilos utilitarios para construir una interfaz consistente y responsive. | MIT |
| Frontend | React Router | Navegacion entre vistas y modulos segun el rol. | MIT |
| Frontend | Axios | Cliente HTTP para comunicacion con la API backend. | MIT |
| Backend | Node.js | Entorno de ejecucion del servidor. | MIT |
| Backend | TypeScript | Tipado estatico y mejor mantenibilidad para el backend modular. | Apache 2.0 |
| Backend | Express | Framework para exponer la API REST del sistema. | MIT |
| Backend | JWT | Base para autenticacion y validacion de sesiones mediante tokens. | Estandar abierto |
| Cache / sesiones | Valkey | Almacenamiento temporal de sesiones, tokens y cache de consultas. | BSD-3-Clause |
| Base de datos | PostgreSQL | Persistencia principal del sistema y de la informacion operativa. | PostgreSQL License |
| Infraestructura | Podman | Gestion de contenedores para levantar frontend, backend y servicios de apoyo en entornos locales o de despliegue. | Apache 2.0 |

## Integraciones consideradas

Ademas de la base tecnologica libre o permisiva, el proyecto contempla integraciones externas para autenticacion institucional y manejo documental:

| Integracion | Proposito |
| --- | --- |
| Google OAuth 2.0 | Inicio de sesion institucional con cuentas autorizadas. |
| Google Drive API | Gestion y almacenamiento de documentos vinculados al sistema. |
| Google Picker API | Seleccion y carga de archivos desde el entorno de Google. |

Estas integraciones funcionan como servicios complementarios. La base principal del sistema se sostiene sobre tecnologias free o de licencia permisiva.

## Contenedores y despliegue

Para la ejecucion del proyecto se utilizara `Podman` como tecnologia de contenedores. Esto permitira:

- levantar servicios de forma aislada y reproducible
- ejecutar frontend, backend, base de datos y cache en contenedores separados
- facilitar la configuracion del entorno de desarrollo
- simplificar futuras pruebas y despliegues

El uso de Podman se alinea con el enfoque del proyecto de utilizar herramientas libres o con licencias permisivas.

La base de contenedores queda organizada en:

- `web`: frontend
- `api`: backend
- `postgres`: base de datos principal
- `valkey`: cache y sesiones

La configuracion principal se encuentra en `infra/podman/podman-compose.yml`, junto con `Containerfile.web`, `Containerfile.api` y `infra/podman/.env.example`.

## Arquitectura general

El flujo tecnico del sistema se organiza de la siguiente forma:

1. El cliente web consume la API mediante solicitudes HTTP/JSON.
2. El backend gestiona autenticacion, reglas de acceso, logica de negocio y validacion de datos.
3. PostgreSQL almacena usuarios, avisos, actividades, peticiones, hilos y metadatos documentales.
4. Valkey se utiliza para sesiones, cache y posibles funciones futuras como rate limiting.
5. Las integraciones con Google permiten autenticacion institucional y acceso controlado a documentos.

La base de datos PostgreSQL queda preparada con migraciones SQL versionadas, seeds base y una capa de conexion en TypeScript para que el equipo implemente modulos sobre un esquema ya definido.

La capa de cache y sesiones queda preparada con Valkey, helpers reutilizables, convencion de claves y configuracion lista para ser usada por los modulos que necesiten cachear consultas o administrar sesiones.

## Arquitectura de software recomendada

Para Hub Estudiantil se recomienda una arquitectura **monolitica modular**.

Esto significa que el sistema se implementa como una sola aplicacion backend, pero internamente organizada por modulos funcionales independientes. Esta decision es la mas adecuada para el proyecto porque:

- el alcance corresponde a un MVP
- el equipo es reducido
- varios modulos comparten autenticacion, usuarios, roles y base de datos
- permite crecer sin incorporar la complejidad de microservicios

Los modulos principales del backend quedan separados por dominio:

- `auth`
- `users`
- `roles`
- `avisos`
- `actividades`
- `hilos`
- `peticiones`
- `documentos`
- `admin`

Cada modulo puede crecer despues con sus propias rutas, controladores, servicios, repositorios y validaciones, manteniendo orden sin partir el sistema en servicios separados.

El backend se trabaja sobre `apps/api` con archivos `.ts`, `tsconfig.json` y scripts base para compilacion y verificacion de tipos.

## Funcionalidades esperadas del MVP

- inicio y cierre de sesion
- control de acceso por rol
- publicacion y visualizacion de avisos
- difusion de actividades y noticias
- creacion y respuesta de hilos
- ingreso de peticiones estudiantiles
- seguimiento basico del estado de peticiones
- soporte para multiples CEALES
- carga y visualizacion de documentos
- panel administrativo de usuarios y permisos
- visualizacion responsive en escritorio y movil

## Beneficios esperados

- centralizacion de la comunicacion estudiantil
- mayor trazabilidad de solicitudes y respuestas
- mejor orden en la difusion de informacion oficial
- separacion clara entre espacios compartidos y privados
- base escalable para futuras mejoras del sistema

## Alcance actual

El proyecto se encuentra definido a nivel de requisitos, alcance funcional, casos de uso y propuesta visual. Ademas, este repositorio ya incluye un scaffold funcional de frontend y backend para que el equipo pueda comenzar a implementar modulos sobre una base tecnica comun.

## Estado actual del scaffold

Actualmente el repositorio ya deja listo:

- frontend con React + Vite, rutas base, layout principal y pantallas modulares conectadas a la API
- backend con Express + TypeScript, middlewares, rutas modulares y endpoints de `health`
- base de datos PostgreSQL preparada con migraciones y seeds iniciales
- cache y sesiones preparadas con Valkey
- contenedores Podman para desarrollo local
- variables de entorno de ejemplo para `apps/api` y `apps/web`
- scripts de bootstrap y verificacion en `scripts/setup.ps1` y `scripts/check.ps1`

Esto permite que los desarrolladores se enfoquen en implementar logica de negocio, validaciones, consultas y vistas reales, sin tener que partir desde cero con la infraestructura del proyecto.

## Puesta en marcha para desarrollo

### Opcion 1: entorno local

1. Ejecutar el bootstrap:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

2. Revisar y ajustar si hace falta:

- `apps/api/.env`
- `apps/web/.env`

3. Levantar Postgres y Valkey con Podman o con servicios locales equivalentes.

4. Preparar base de datos:

```powershell
cd apps/api
npm run db:setup
```

5. Iniciar backend:

```powershell
cd apps/api
npm run dev
```

6. Iniciar frontend en otra terminal:

```powershell
cd apps/web
npm run dev
```

### Opcion 2: con Podman

```powershell
podman compose -f infra/podman/podman-compose.yml up --build
```

Para inicializar el esquema y los catalogos base:

```powershell
podman compose -f infra/podman/podman-compose.yml run --rm db-init
```

## Comandos utiles

```powershell
cd apps/api
npm run typecheck
npm run build
npm run db:check
npm run cache:check

cd ../web
npm run build
```

## Estructura de carpetas recomendada

```text
HubEstudiantil/
|- apps/
|  |- web/
|  |  |- public/
|  |  `- src/
|  |     |- app/
|  |     |- assets/
|  |     |- components/
|  |     |- features/
|  |     |  |- auth/
|  |     |  |- dashboard/
|  |     |  |- avisos/
|  |     |  |- actividades/
|  |     |  |- hilos/
|  |     |  |- peticiones/
|  |     |  |- documentos/
|  |     |  `- admin/
|  |     |- layouts/
|  |     |- pages/
|  |     |- routes/
|  |     |- services/
|  |     |- styles/
|  |     `- utils/
|  `- api/
|     `- src/
|        |- app/
|        |- cache/
|        |- config/
|        |- database/
|        |  |- migrations/
|        |  `- seeds/
|        |- middlewares/
|        |- modules/
|        |  |- auth/
|        |  |- users/
|        |  |- roles/
|        |  |- avisos/
|        |  |- actividades/
|        |  |- hilos/
|        |  |- peticiones/
|        |  |- documentos/
|        |  `- admin/
|        |- shared/
|        |  |- errors/
|        |  |- utils/
|        |  `- validators/
|        `- tests/
|- docs/
|  |- architecture/
|  `- api/
|- infra/
|  |- nginx/
|  `- podman/
|- scripts/
|- Mackups/
|- README.md
```

## Criterio de organizacion

- `apps/web`: contiene la aplicacion frontend.
- `apps/api`: contiene el backend monolitico modular.
- `cache`: concentra la capa base de Valkey para sesiones y cache reutilizable.
- `modules`: separa la logica por dominios del negocio.
- `shared`: concentra utilidades reutilizables y validaciones comunes.
- `database`: guarda migraciones y semillas.
- `infra/podman`: contiene archivos relacionados con contenedores y orquestacion local.
- `docs`: concentra decisiones tecnicas y documentacion de arquitectura o API.

Esta estructura permite partir simple, mantener claridad tecnica y escalar el sistema sin rehacer la base del proyecto.

## Por que esta estructura

La estructura fue elegida para que el proyecto pueda crecer de forma ordenada desde el inicio, sin agregar complejidad innecesaria al MVP.

Aunque la arquitectura recomendada es **monolitica modular**, eso no significa que todo deba quedar en una sola carpeta. En este caso se separa `apps/web` de `apps/api` porque frontend y backend:

- usan herramientas distintas
- tienen procesos de desarrollo y build diferentes
- se despliegan como piezas separadas, aunque formen parte del mismo sistema

Dentro del backend se usa una organizacion por modulos para evitar mezclar toda la logica en carpetas genericas. Por eso existen dominios como `auth`, `avisos`, `hilos`, `peticiones` o `documentos`: cada uno puede contener sus rutas, servicios, validaciones y acceso a datos sin interferir con los demas.

En el frontend se replica una idea similar mediante `features`, de modo que cada funcionalidad quede agrupada junto a sus componentes y logica de interfaz. Esto facilita mantener consistencia entre lo que existe en backend y lo que se muestra en pantalla.

Las carpetas compartidas tambien cumplen un proposito claro:

- `shared` concentra piezas reutilizables por varios modulos
- `database` separa migraciones y seeds de la logica del negocio
- `infra` aísla la configuracion tecnica de contenedores y despliegue
- `docs` guarda decisiones de arquitectura y documentacion tecnica fuera del codigo fuente
