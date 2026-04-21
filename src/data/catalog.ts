import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export interface Product {
    id: string;
    nombre: string;
    categoria: string;
    descripcion_corta: string;
    descripcion_larga: string;
    precio: number;
    stock: number;
    colores?: string[];
    tallas?: number[];
    tags: string[];
    link: string;
    imagen_url: string;
    activo: boolean;
}

/**
 * Busca productos activos en el catálogo.
 */
export async function searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', config.DEFAULT_TENANT_ID)
        .eq('activo', true)
        .or(`nombre.ilike.${lowerQuery},categoria.ilike.${lowerQuery},descripcion_corta.ilike.${lowerQuery}`)
        .limit(5);

    if (error || !data) return [];
    return data as Product[];
}

/**
 * Obtiene un producto por su ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', config.DEFAULT_TENANT_ID)
        .single();
    if (error || !data) return null;
    return data as Product;
}

/**
 * Obtiene todos los productos (incluidos inactivos) para el panel de admin.
 */
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', config.DEFAULT_TENANT_ID)
        .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as Product[];
}

/**
 * Crea un nuevo producto.
 */
export async function createProduct(product: Partial<Product>): Promise<Product | null> {
    const id = product.id || product.nombre!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const toInsert = {
        id,
        tenant_id: config.DEFAULT_TENANT_ID,
        nombre: product.nombre || '',
        categoria: product.categoria || '',
        descripcion_corta: product.descripcion_corta || '',
        descripcion_larga: product.descripcion_larga || '',
        precio: product.precio || 0,
        stock: product.stock || 0,
        colores: product.colores || [],
        tallas: product.tallas || [],
        tags: product.tags || [],
        link: product.link || '',
        imagen_url: product.imagen_url || '',
        activo: product.activo !== false
    };

    const { data, error } = await supabase
        .from('products')
        .insert(toInsert)
        .select()
        .single();

    if (error) {
        logger.error(`Error creando producto: ${error.message}`);
        throw new Error(error.message);
    }
    return data as Product;
}

/**
 * Actualiza un producto existente.
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('tenant_id', config.DEFAULT_TENANT_ID)
        .select()
        .single();

    if (error) {
        logger.error(`Error actualizando producto: ${error.message}`);
        return null;
    }
    return data as Product;
}

/**
 * Elimina un producto por su ID.
 */
export async function deleteProduct(id: string): Promise<boolean> {
    const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('tenant_id', config.DEFAULT_TENANT_ID);

    if (error) {
        logger.error(`Error borrando producto: ${error.message}`);
        return false;
    }
    return (count || 0) > 0;
}
