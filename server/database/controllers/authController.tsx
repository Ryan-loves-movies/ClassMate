import { Request, Response } from 'express';
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
function validateRequest(req: Request, res: Response) {
    const token = req.headers.authorization as string;

    if (!token || !token.trim()) {
        return res.status(404).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return res.status(200).json({ message: 'authorized' });
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default validateRequest;
