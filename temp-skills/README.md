# Antigravity Skills Requeridas

Para darle continuidad al proyecto ("Scale WhatsApp Bot To SaaS"), la IA que trabaje en esta carpeta debe asegurarse de tener acceso y activar las siguientes *Skills* durante el desarrollo:

1. **`backend-patterns`**: Usada para guiar la re-arquitectura hacia Node.js + TypeScript en un entorno B2B SaaS. (Ayuda con la estructura con Express).
2. **`VibeSec-Skill`**: Para asegurar componentes de la API, tokens y futuras migraciones a plataformas como Supabase garantizando el Multi-tenant y RLS (Row Level Security).
3. **`unknown-unknowns`**: Empleada constantemente para evaluar potenciales "puntos ciegos" (blind spots) en este proyecto al lidiar con alta concurrencia de mensajería (SQLite -> PostgreSQL) y los webhooks oficiales de Meta.
4. **`frontend-design`**: Vital para crear el Dashboard premium B2B usando HTML/CSs y eventualmente React (estilo profesional y dinámico).
5. **`webapp-testing`**: Requerida para verificar localmente las interfaces, botones, APIs simuladas y llamadas al dashboard sin romper código.

*(Nota: Estas skills se encuentran en la carpeta local `~/.gemini/antigravity/skills/` de tu entorno. Si te falta alguna, asegúrate de indicarle a la IA que use el `skill-creator` para generarlas o que las adquiera de la fuente habitual).*
