import Database from 'better-sqlite3';
import { logger } from '../utils/logger';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Asegurar que el directorio data exista
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'database.sqlite'));

// Inicializar tabla de sesiones
db.pragma('journal_mode = WAL'); // Mejor rendimiento y concurrencia
db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        history_json TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

const stmtGetMemory = db.prepare('SELECT history_json FROM sessions WHERE session_id = ?');
const stmtSaveMemory = db.prepare(`
    INSERT INTO sessions (session_id, history_json, updated_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP) 
    ON CONFLICT(session_id) DO UPDATE SET 
    history_json = excluded.history_json,
    updated_at = excluded.updated_at
`);

export function getMemory(sessionId: string): OpenAI.Chat.ChatCompletionMessageParam[] | null {
    try {
        const row: any = stmtGetMemory.get(sessionId);
        if (row && row.history_json) {
            return JSON.parse(row.history_json);
        }
        return null;
    } catch (error: any) {
        logger.error(`Error obteniendo memoria de DB para ${sessionId}: ${error.message}`);
        return null;
    }
}

export function saveMemory(sessionId: string, history: OpenAI.Chat.ChatCompletionMessageParam[]) {
    try {
        stmtSaveMemory.run(sessionId, JSON.stringify(history));
    } catch (error: any) {
        logger.error(`Error guardando memoria en DB para ${sessionId}: ${error.message}`);
    }
}

export function getAllSessions(): { sessionId: string, history: OpenAI.Chat.ChatCompletionMessageParam[], updatedAt: string }[] {
    try {
        const rows = db.prepare('SELECT session_id, history_json, updated_at FROM sessions ORDER BY updated_at DESC').all() as any[];
        return rows.map(r => ({
            sessionId: r.session_id,
            history: JSON.parse(r.history_json),
            updatedAt: r.updated_at
        }));
    } catch (error: any) {
        logger.error(`Error obteniendo todas las sesiones: ${error.message}`);
        return [];
    }
}
