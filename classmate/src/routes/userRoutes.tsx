import express from 'express';
const expressRouter = express.Router();
import controller from '../database/controllers/userController';
const { createUser, logIn, logOut, getProfile, updateProfile, resetPassword, verifyEmail, deleteUser } = controller;

expressRouter.post('/register', createUser);
expressRouter.post('/login', logIn);
expressRouter.post('/logout', logOut);
expressRouter.get('/profile', getProfile);
expressRouter.put('/profile', updateProfile);
expressRouter.post('/reset-password', resetPassword);
expressRouter.get('/verify-email/:token', verifyEmail);
expressRouter.delete('/delete-profile', deleteUser);

export default expressRouter;
