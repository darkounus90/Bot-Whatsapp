import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';
import { config } from '../config/env';
import OpenAI from 'openai';

export async function getMemory(sessionId: string): Promise<OpenAI.Chat.ChatCompletionMessageParam[] | null> {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('history_json')
            .eq('session_id', sessionId)
            .eq('tenant_id', config.DEFAULT_TENANT_ID)
            .single();

        if (error || !data) return null;
        return data.history_json;
    } catch (error: any) {
        logger.error(`Error obteniendo memoria de DB para ${sessionId}: ${error.message}`);
        return null;
    }
}

export async function saveMemory(sessionId: string, history: OpenAI.Chat.ChatCompletionMessageParam[]) {
    try {
        const { error } = await supabase
            .from('sessions')
            .upsert({
                session_id: sessionId,
                tenant_id: config.DEFAULT_TENANT_ID,
                history_json: history,
                updated_at: new Date().toISOString()
            });

        if (error) {
            logger.error(`Supabase error saving memory: ${error.message}`);
        }
    } catch (error: any) {
        logger.error(`Error guardando memoria en DB para ${sessionId}: ${error.message}`);
    }
}

export async function getAllSessions(): Promise<{ sessionId: string, history: OpenAI.Chat.ChatCompletionMessageParam[], updatedAt: string }[]> {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('session_id, history_json, updated_at')
            .eq('tenant_id', config.DEFAULT_TENANT_ID)
            .order('updated_at', { ascending: false });

        if (error || !data) return [];
        return data.map((r: any) => ({
            sessionId: r.session_id,
            history: r.history_json,
            updatedAt: r.updated_at
        }));
    } catch (error: any) {
        logger.error(`Error obteniendo todas las sesiones: ${error.message}`);
        return [];
    }
}

