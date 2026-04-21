import { Router, Request, Response } from 'express';
import { config } from '../config/env';
import { signToken } from '../utils/auth';

export const authRouter = Router();

authRouter.post('/api/login', (req: Request, res: Response) => {
    const { password } = req.body;
    
    console.log(`[AUTH] Intento de login. Recibido: '${password}'`);
    
    if (password?.trim() === config.ADMIN_PASSWORD?.trim()) {
        const token = signToken();
        console.log(`[AUTH] Login exitoso.`);
        res.json({ token });
    } else {
        console.log(`[AUTH] Login fallido.`);
        res.status(401).json({ error: 'Contraseña incorrecta' });
    }
});
