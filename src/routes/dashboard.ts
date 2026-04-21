import { Router, Request, Response } from 'express';
import { getAllSessions } from '../data/database';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../data/catalog';
import { verifyToken } from '../utils/auth';
import path from 'path';

export const dashboardRouter = Router();

// Proteger todas las rutas que comiencen con /api
dashboardRouter.use('/api', verifyToken);

// ============ SESIONES / CHATS ============
dashboardRouter.get('/api/sessions', async (req: Request, res: Response) => {
    const sessions = await getAllSessions();
    res.json(sessions);
});

// ============ PRODUCTOS (CRUD) ============

// Listar todos los productos
dashboardRouter.get('/api/products', async (req: Request, res: Response) => {
    const products = await getAllProducts();
    res.json(products);
});

// Crear un producto nuevo
dashboardRouter.post('/api/products', async (req: Request, res: Response) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto
dashboardRouter.put('/api/products/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updated = await updateProduct(id, req.body);
    if (!updated) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }
    res.json(updated);
});

// Eliminar un producto
dashboardRouter.delete('/api/products/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await deleteProduct(id);
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
