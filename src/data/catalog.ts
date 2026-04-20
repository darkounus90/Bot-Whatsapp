import Database from 'better-sqlite3';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

// Asegurar que el directorio data exista
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'database.sqlite'));

// Crear tabla de productos si no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL DEFAULT '',
        descripcion_corta TEXT NOT NULL DEFAULT '',
        descripcion_larga TEXT NOT NULL DEFAULT '',
        precio REAL NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        colores TEXT NOT NULL DEFAULT '[]',
        tallas TEXT NOT NULL DEFAULT '[]',
        tags TEXT NOT NULL DEFAULT '[]',
        link TEXT NOT NULL DEFAULT '',
        imagen_url TEXT NOT NULL DEFAULT '',
        activo INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Migrar productos del JSON estático si la tabla está vacía
const count = (db.prepare('SELECT COUNT(*) as c FROM products').get() as any).c;
if (count === 0) {
    const jsonPath = path.join(__dirname, './catalog.json');
    if (fs.existsSync(jsonPath)) {
        const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const insertStmt = db.prepare(`
            INSERT INTO products (id, nombre, categoria, descripcion_corta, descripcion_larga, precio, stock, colores, tallas, tags, link, activo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', 1)
        `);
        for (const p of raw) {
            insertStmt.run(
                p.id, p.nombre, p.categoria || '', p.descripcion_corta || '', p.descripcion_larga || '',
                p.precio || 0, p.stock || 0,
                JSON.stringify(p.colores || []),
                JSON.stringify(p.tallas || []),
                JSON.stringify(p.tags || [])
            );
        }
        logger.info(`✅ Migrados ${raw.length} productos del JSON al SQLite.`);
    }
}

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

function rowToProduct(row: any): Product {
    return {
        id: row.id,
        nombre: row.nombre,
        categoria: row.categoria,
        descripcion_corta: row.descripcion_corta,
        descripcion_larga: row.descripcion_larga,
        precio: row.precio,
        stock: row.stock,
        colores: JSON.parse(row.colores || '[]'),
        tallas: JSON.parse(row.tallas || '[]'),
        tags: JSON.parse(row.tags || '[]'),
        link: row.link || '',
        imagen_url: row.imagen_url || '',
        activo: row.activo === 1
    };
}

/**
 * Busca productos activos en el catálogo.
 */
export async function searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const rows = db.prepare(`
        SELECT * FROM products 
        WHERE activo = 1 AND (
            LOWER(nombre) LIKE ? OR 
            LOWER(categoria) LIKE ? OR 
            LOWER(descripcion_corta) LIKE ? OR 
            LOWER(tags) LIKE ?
        )
        LIMIT 5
    `).all(lowerQuery, lowerQuery, lowerQuery, lowerQuery) as any[];
    return rows.map(rowToProduct);
}

/**
 * Obtiene un producto por su ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    return row ? rowToProduct(row) : null;
}

/**
 * Obtiene todos los productos (incluidos inactivos) para el panel de admin.
 */
export function getAllProducts(): Product[] {
    const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all() as any[];
    return rows.map(rowToProduct);
}

/**
 * Crea un nuevo producto.
 */
export function createProduct(product: Partial<Product>): Product {
    const id = product.id || product.nombre!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    db.prepare(`
        INSERT INTO products (id, nombre, categoria, descripcion_corta, descripcion_larga, precio, stock, colores, tallas, tags, link, imagen_url, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        id,
        product.nombre || '',
        product.categoria || '',
        product.descripcion_corta || '',
        product.descripcion_larga || '',
        product.precio || 0,
        product.stock || 0,
        JSON.stringify(product.colores || []),
        JSON.stringify(product.tallas || []),
        JSON.stringify(product.tags || []),
        product.link || '',
        product.imagen_url || '',
        product.activo !== false ? 1 : 0
    );
    return getProductByIdSync(id)!;
}

function getProductByIdSync(id: string): Product | null {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    return row ? rowToProduct(row) : null;
}

/**
 * Actualiza un producto existente.
 */
export function updateProduct(id: string, updates: Partial<Product>): Product | null {
    const existing = getProductByIdSync(id);
    if (!existing) return null;

    db.prepare(`
        UPDATE products SET 
            nombre = ?, categoria = ?, descripcion_corta = ?, descripcion_larga = ?,
            precio = ?, stock = ?, colores = ?, tallas = ?, tags = ?,
            link = ?, imagen_url = ?, activo = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        updates.nombre ?? existing.nombre,
        updates.categoria ?? existing.categoria,
        updates.descripcion_corta ?? existing.descripcion_corta,
        updates.descripcion_larga ?? existing.descripcion_larga,
        updates.precio ?? existing.precio,
        updates.stock ?? existing.stock,
        JSON.stringify(updates.colores ?? existing.colores),
        JSON.stringify(updates.tallas ?? existing.tallas),
        JSON.stringify(updates.tags ?? existing.tags),
        updates.link ?? existing.link,
        updates.imagen_url ?? existing.imagen_url,
        (updates.activo ?? existing.activo) ? 1 : 0,
        id
    );
    return getProductByIdSync(id);
}

/**
 * Elimina un producto por su ID.
 */
export function deleteProduct(id: string): boolean {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
}
