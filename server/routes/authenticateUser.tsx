import express from 'express';
import authenticateToken from '@server/middleware/auth';

const expressRouter = express.Router();
expressRouter.get('/authenticate', authenticateToken);

export default expressRouter;
