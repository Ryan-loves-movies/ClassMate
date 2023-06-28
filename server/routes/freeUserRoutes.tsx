import express from 'express';
const expressRouter = express.Router();
import userController from '@controllers/userController';

const { createUser, logIn } = userController;

// User routes
expressRouter.post('/register', createUser);
expressRouter.post('/login', logIn);

export default expressRouter;
