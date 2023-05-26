import express from 'express';
// import createUser from '@/database/controllers/userController';
import controller from '@/database/controllers/userController';
// import { createUser, logIn, logOut, getProfile, updateProfile, resetPassword, verifyEmail, deleteUser } from '@/database/controllers/userController';

const expressRouter = express.Router();

expressRouter.post('/register', controller.createUser);
// expressRouter.post('/login', logIn);
// expressRouter.post('/logout', logOut);
// expressRouter.get('/profile', getProfile);
// expressRouter.put('/profile', updateProfile);
// expressRouter.post('/reset-password', resetPassword);
// expressRouter.get('/verify-email/:token', verifyEmail);
// expressRouter.delete('/delete-profile', deleteUser);

export default expressRouter;
