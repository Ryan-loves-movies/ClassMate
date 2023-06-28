import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@server/config';

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
}
Verifies the JSON web token passed in request headers
**/
function authorizeToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;

    if (!token || !token.trim()) {
        res.status(404).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        /* res.status(200).json({
            message: 'Token is valid',
            decoded: decoded
        }); */
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export default authorizeToken;
