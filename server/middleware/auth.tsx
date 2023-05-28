import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@server/config.jsx';

export default function authenticateToken(req: Request, res: Response) {
    const token = req.headers.authorization;

    if (!token || !(token as string).trim()) {
        return res.status(401).json({ message: 'No token provided!' });
    }
    jwt.verify(token as string, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token verification failed, send an error response
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Token is valid, you can access the decoded payload if needed
        // const userId = decoded.userId;

        // Perform any additional checks or actions based on the decoded payload

        // Send a success response
        res.status(200).json({ message: 'Token is valid' });

    });
}
