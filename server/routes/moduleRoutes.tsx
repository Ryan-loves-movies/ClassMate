import express from 'express';
const expressRouter = express.Router();
import moduleController from '@controllers/moduleController';

const { populateModules, populateLessons, searchModules, getModules, addModule, removeModule, updateLesson } = moduleController;

expressRouter.post('/allModules', populateModules);
expressRouter.post('/allLessons', populateLessons);
expressRouter.get('/search/modules', searchModules)
expressRouter.get('/modules', getModules);
expressRouter.put('/modules', addModule);
expressRouter.delete('/modules', removeModule);
expressRouter.put('/lessons', updateLesson);

export default expressRouter;
