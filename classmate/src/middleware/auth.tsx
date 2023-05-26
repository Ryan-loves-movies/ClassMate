import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// import config from '../config';
import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default function authenticateToken(req: NextApiRequest, res: NextApiResponse, next: any) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // const decoded = jwt.verify(token, config.JWT_SECRET);
    // req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
  authenticateToken,
};

