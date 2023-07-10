import express from "express";
const expressRouter = express.Router();
import moduleController from "@controllers/moduleController";

const {
    populateModules,
    populateLessons,
    hasModule,
    searchModules,
    getLessons,
    addModule,
    removeModule,
    updateLesson,
} = moduleController;

expressRouter.post("/allModules", populateModules);
expressRouter.post("/allLessons", populateLessons);
expressRouter.get("/search/modules", searchModules);
expressRouter.get("/module", hasModule);
expressRouter.put("/module", addModule);
expressRouter.delete("/module", removeModule);
expressRouter.put("/lessons", updateLesson);
expressRouter.get("/lessons", getLessons);

export default expressRouter;
