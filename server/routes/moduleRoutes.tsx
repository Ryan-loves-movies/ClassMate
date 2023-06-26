import express from 'express';
const expressRouter = express.Router();
import moduleController from '@controllers/moduleController';
const { addModule, removeModule, updateLesson } = moduleController;

expressRouter.put('/modules', addModule);
expressRouter.delete('/modules', removeModule);
expressRouter.put('/lessons', updateLesson);
