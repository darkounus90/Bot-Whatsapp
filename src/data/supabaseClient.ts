import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

// Advertencia si faltan variables
if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    console.warn("⚠️ ADVERTENCIA: Faltan SUPABASE_URL o SUPABASE_KEY en las variables de entorno.");
}

// Inicializar el cliente Supabase
export const supabase = createClient(
    config.SUPABASE_URL || 'https://tu-proyecto.supabase.co',
    config.SUPABASE_KEY || 'tu-llave'
);
