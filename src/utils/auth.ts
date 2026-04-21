import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export function signToken(): string {
    // Firmamos un token simple sin datos de usuario, ya que es un admin genérico
    return jwt.sign({ role: 'admin' }, config.JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado: Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, config.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado' });
    }
}
