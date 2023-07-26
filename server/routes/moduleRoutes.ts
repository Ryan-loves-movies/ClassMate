import express from 'express';
const expressRouter = express.Router();
import moduleController from '@controllers/moduleController';

const {
    populateModules,
    populateLessons,
    hasModule,
    searchModules,
    getLessons,
    getPossibleLessonsForModule,
    getAllPossibleLessons,
    addModule,
    removeModule,
    updateLesson,
    addFixedLesson,
    removeFixedLesson
} = moduleController;

expressRouter.post('/allModules', populateModules);
expressRouter.post('/allLessons', populateLessons);
expressRouter.get('/search/modules', searchModules);
expressRouter.get('/module', hasModule);
expressRouter.put('/module', addModule);
expressRouter.delete('/module', removeModule);
expressRouter.put('/lessons', updateLesson);
expressRouter.get('/lessons', getLessons);
expressRouter.get('/module/lessons', getPossibleLessonsForModule);
expressRouter.get('/all/lessons', getAllPossibleLessons);
expressRouter.post('/fixed/lesson', addFixedLesson);
expressRouter.delete('/fixed/lesson', removeFixedLesson);

export default expressRouter;
