// import validateToken from '@/middleware/auth';
// // import app from "next";

// // app.use("/classmate", validateToken);
// const express = require('express');
// const next = require('next');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// // Your Express server configuration and routes
// const server = express();

// // Apply your JWT authentication middleware here
// // server.use('/protected', verifyJwt);

// // Example route
// server.get('/api/test', (req: Request, res: Response) => {
//     res.json();
// });

// // Proxy requests to Next.js app
// const apiProxy = createProxyMiddleware('/api', {
//     target: 'http://localhost:3000', // Replace with your Express server URL
//     changeOrigin: true,
// });

// server.use(apiProxy);

// // Handle Next.js requests
// // app.prepare().then(() => {
// //   server.get('*', (req, res) => {
// //     return handle(req, res);
// //   });

// //   server.listen(3000, (err) => {
// //     if (err) throw err;
// //     console.log('> Ready on http://localhost:3000');
// //   });
// // });

import express from 'express';
const expressRouter = express.Router();
import authenticateToken from '@server/middleware/auth';

expressRouter.get('/authenticate', authenticateToken);

export default expressRouter;
