import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || '',
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    STORE_NAME: process.env.STORE_NAME || 'nuestro ecommerce',
    PORT: process.env.PORT || 3000,
    META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || '',
    META_PHONE_ID: process.env.META_PHONE_ID || '',
    META_VERIFY_TOKEN: process.env.META_VERIFY_TOKEN || 'mi_token_secreto_ecommerce',
    
    // Configuración de Supabase
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_KEY || '', // Service Role Key recomendada
    DEFAULT_TENANT_ID: process.env.DEFAULT_TENANT_ID || '00000000-0000-0000-0000-000000000000',

    // Configuración de Seguridad para el Dashboard
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    JWT_SECRET: process.env.JWT_SECRET || 'super_secreto_para_tokens_12345'
};

// Validación simple
if (!config.OPENAI_API_KEY) {
    console.warn("⚠️ ADVERTENCIA: No se ha configurado OPENAI_API_KEY en el archivo .env!");
}
if (!config.META_ACCESS_TOKEN) {
    console.warn("⚠️ ADVERTENCIA: No se ha configurado META_ACCESS_TOKEN para la WhatsApp Cloud API.");
}
if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    console.warn("⚠️ ADVERTENCIA: Faltan credenciales de Supabase. El bot fallará si intenta usar la DB.");
}
