import { Router, Request, Response } from 'express';
import { getAllSessions } from '../data/database';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../data/catalog';
import path from 'path';

export const dashboardRouter = Router();

// ============ SESIONES / CHATS ============
dashboardRouter.get('/api/sessions', (req: Request, res: Response) => {
    const sessions = getAllSessions();
    res.json(sessions);
});

// ============ PRODUCTOS (CRUD) ============

// Listar todos los productos
dashboardRouter.get('/api/products', (req: Request, res: Response) => {
    const products = getAllProducts();
    res.json(products);
});

// Crear un producto nuevo
dashboardRouter.post('/api/products', (req: Request, res: Response) => {
    try {
        const product = createProduct(req.body);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto
dashboardRouter.put('/api/products/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updated = updateProduct(id, req.body);
    if (!updated) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }
    res.json(updated);
});

// Eliminar un producto
dashboardRouter.delete('/api/products/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = deleteProduct(id);
    if (!deleted) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }
    res.json({ success: true });
});

// ============ SERVIR HTML ============
dashboardRouter.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public/dashboard.html'));
});

dashboardRouter.get('', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public/dashboard.html'));
});
