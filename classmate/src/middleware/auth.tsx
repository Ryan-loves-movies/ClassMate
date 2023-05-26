import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import config from '@/config';
import { NextFunction } from 'express';

declare module 'express' {
  interface Request {
    headers: any;
    user: any;
  }
  interface Response {
    status: any;
  }
}

interface Config {
  JWT_SECRET: string;
  // Other properties...
}


export default function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.get('authorization');

  if (!token || !token.trim()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // Commented out bc user property is only defined on the JwtPayload interface
    //req.user = decoded.user;
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
  authenticateToken,
};
