import express from 'express';
const expressRouter = express.Router();
import validateRequest from '@controllers/authController';

expressRouter.get('/user', validateRequest);

export default expressRouter;
