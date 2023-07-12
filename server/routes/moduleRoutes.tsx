import express from 'express';
const expressRouter = express.Router();
import moduleController from '@controllers/moduleController';

const {
    populateModules,
    populateLessons,
    hasModule,
    searchModules,
    getLessons,
    getAllPossibleLessons,
    addModule,
    removeModule,
    updateLesson
} = moduleController;

<<<<<<< Updated upstream
expressRouter.post("/allModules", populateModules);
expressRouter.post("/allLessons", populateLessons);
expressRouter.get("/search/modules", searchModules);
expressRouter.get("/module", hasModule);
expressRouter.put("/modules", addModule);
expressRouter.delete("/modules", removeModule);
expressRouter.put("/lessons", updateLesson);
expressRouter.get("/lessons", getLessons);
=======
expressRouter.post('/allModules', populateModules);
expressRouter.post('/allLessons', populateLessons);
expressRouter.get('/search/modules', searchModules);
expressRouter.get('/module', hasModule);
expressRouter.put('/module', addModule);
expressRouter.delete('/module', removeModule);
expressRouter.put('/lessons', updateLesson);
expressRouter.get('/lessons', getLessons);
expressRouter.get('/all/lessons', getAllPossibleLessons);
>>>>>>> Stashed changes

export default expressRouter;
