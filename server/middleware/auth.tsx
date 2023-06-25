import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@server/config';

export default function authenticateToken(req: Request, res: Response) {
    const token = req.headers.authorization as string;

    if (!token || !token.trim()) {
        return res.status(401).json({ message: 'No token provided!' });
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        res.status(200).json({
            message: 'Token is valid',
            decoded: decoded
        });
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

