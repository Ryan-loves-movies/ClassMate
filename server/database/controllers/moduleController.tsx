import { Request, Response } from 'express';
import Users from '@models/Users';
import Modules from '@models/Modules';
import Users_Modules from '@models/Users_Modules';
import Lessons from '@models/Lessons';

interface lesson {
    lessonId: string;
    lessonType: string;
}

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        *   body: {
            *   username: string,
            *   moduleCode: string,
            *   lessons: [{
                *   lessonId: string,
                *   lessonType: string
                *   },
                *   ...]
                *   }
                * }
                * Adds the module to the user and the lessons associated with it
                    * */
async function addModule(req: Request, res: Response) {
    const { username, moduleCode, lessons } = req.body;
    await Users.findByPk(username, {
        include: [
            {
                model: Modules,
            }]
    })
        .then((user) => {
            Modules.findByPk(moduleCode)
                .then((module) => {
                    user?.addModule(module as Modules);
                })
        });
    await Users.findByPk(username, {
        include: [{
            model: Users_Modules
        }]
    })
        .then((user) => {
            lessons.map((lesson: lesson) => {
                Lessons.findOne({
                    where: {
                        moduleCode: moduleCode,
                        lessonType: lesson.lessonType,
                        lessonId: lesson.lessonId
                    }
                })
                    .then((lesson) => {
                        user?.users_modules
                            ?.find((user_module) => user_module.moduleCode === moduleCode)
                            ?.addLesson(lesson as Lessons);
                    })
            })
        })
}

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        *   body: {
            *   username: string,
            *   moduleCode: string (new lectureCode)
            *   }
            * }
            * Remove specific module taken by user (and all related lessons)
                * */
async function removeModule(req: Request, res: Response) {
    const { username, moduleCode } = req.body;
    await Users.findByPk(username, {
        include: [
            {
                model: Modules,
            }]
    })
        .then((user) => {
            Modules.findByPk(moduleCode)
                .then((module) => {
                    user?.removeModule(module as Modules);
                })
        });
}

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        *   body: {
            *   username: string,
            *   moduleCode: string,
            *   lessonId: string (e.g. G03),
            *   lessonType: string,
            *   }
            * }
            * Replaces the lesson being taken by the user for particular module in the database and returns the number of values updated
                * */
async function updateLesson(req: Request, res: Response) {
    const { username, moduleCode, lessonId, lessonType } = req.body;
    await Users.findByPk(username, {
        include: [
            {
                model: Users_Modules,
                include: [
                    {
                        model: Lessons
                    },
                    {
                        model: Modules
                    }]
            }]
    })
        .then((user) => {
            const user_module = user?.users_modules
                ?.find((user_module) => user_module.moduleCode === moduleCode);
            user_module?.getLessons()
                .then((lessons) => {
                    const lessonToRemove = lessons.find((lesson) => (lesson.moduleCode === moduleCode &&
                        lesson.lessonType === lessonType));
                    user_module.removeLesson(lessonToRemove);
                    Lessons.findOne({
                        where: {
                            lessonId: lessonId,
                            lessonType: lessonType,
                            moduleCode: moduleCode
                        }
                    })
                        .then((lessonToAdd) => {
                            user_module.addLesson(lessonToAdd as Lessons);
                        })
                });
        });
}

export default { addModule, removeModule, updateLesson };
