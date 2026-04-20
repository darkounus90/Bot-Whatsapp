# AI Handoff - WhatsApp Bot a SaaS (Multi-tenant)

## Contexto General
Este proyecto comenzó como un bot de WhatsApp para un solo e-commerce, integrado con IA (OpenAI) para atención al cliente y ventas. Actualmente, **el objetivo principal es transformar el proyecto en una plataforma SaaS Multi-Tenant** (múltiples inquilinos/empresas), donde cada negocio pueda tener sus propios catálogos, configuraciones, prompts y credenciales separados.

## Estado Actual
1. **Arquitectura WhatsApp**: Se inició la migración de `whatsapp-web.js` (scraping/legacy) a **WhatsApp Cloud API** oficial para mejorar estabilidad y concurencia a gran escala en un entorno SaaS.
2. **Base de Datos**: Actualmente se utiliza `better-sqlite3` con modo WAL activado para concurrencia, con tablas para persistencia de sesiones. **Está en los planes inminentes escalar la infraestructura migrando a Supabase (PostgreSQL)** para soportar una verdadera arquitectura SaaS B2B (alojamiento en la nube, RLS, Auth y bases de datos escalables). Las pruebas iniciales aún persisten en SQLite.
3. **Dashboard (MVP SaaS)**: Se ha integrado un panel básico (`routes/dashboard.ts` y vista en `public/dashboard.html`) que permite:
   - Visualizar e inspeccionar remotamente el historial y las sesiones del bot.
   - Realizar operaciones CRUD sobre los catálogos de los clientes.
4. **Control de Versiones**: Recién configurado y sincronizado con el repositorio oficial (`https://github.com/darkounus90/Bot-Whatsapp.git`). Los archivos de caché basura y la base de datos local fueron correctamente ignorados (`.gitignore`).

## Cambios Recientes
- Incorporación de endpoints API (`/api/sessions`, `/api/products`) en el enrutamiento.
- Separación de la lógica de base de datos (`src/data/database.ts`) y catálogos (`src/data/catalog.ts`) para abrir camino al esquema que aísla las transacciones de cada comercio o *tenant*.
- Resolución de bloqueos de E/O y fugas de memoria reportados en sesiones previas.

## Qué sigue para la Próxima IA (Pendientes Inmediatos)
1. **Migración a Supabase (PostgreSQL)**: Se debe reemplazar `better-sqlite3` usando el cliente oficial de `@supabase/supabase-js`. Esto implica mover las tablas actuales (`sesiones` y `productos`) a la nube.
2. **Paso al Esquema Multi-Tenant Real (en Supabase)**: Crear la tabla `tenants` (negocios), incorporar la columna `tenant_id` obligatorio en productos, sesiones y configuraciones, y posiblemente aplicar políticas de RLS (Row Level Security) para aislar los datos de cada cliente.
3. **Setup Completo WhatsApp Cloud API**: Concluir el modelo de suscripción a webhooks de Meta y reemplazar definitivamente `whatsapp-web.js`.
4. **Configuraciones de Prompt por Cliente**: Permitir que el "System Prompt" (la personalidad y las reglas del sistema) vengan de base de datos (`tenant.system_prompt`) en lugar de estar harcodeados, para que un negocio sea "Andrés el Colombiano" y otro "María la Asesora".
5. **Autenticación (Dashboard)**: Proteger las rutas `/dashboard` con JWT, requiriendo un login para administradores del SaaS.
6. **Testeos**: Levantar el servidor y realizar pruebas concurrentes y llamadas a las APIs para confirmar persistencia.

## Detalles Técnicos
- **Entorno**: Node.js, TypeScript.
- **DB**: SQLite (`better-sqlite3`).
- **AI**: Integración con paquete de `openai`.
- **Enrutamiento**: Express.js (usado para APIs, Dashboard Web, y Webhooks).
