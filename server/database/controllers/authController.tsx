import { Request, Response } from 'express';
import { AxiosError } from "axios";
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

    if (!token) {
        res.status(404).json({ message: 'No token provided' });
        throw new AxiosError('No token provided');
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return decoded;
    } catch {
        res.status(401).json({ message: 'Invalid token' });
        throw new AxiosError('Invalid token');
    }
}

export default validateRequest;
