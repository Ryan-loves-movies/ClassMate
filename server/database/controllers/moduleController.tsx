import { Request, Response } from 'express';
import Users from '@models/Users';
import Modules from '@models/Modules';
import Users_Modules from '@models/Users_Modules';
import Lessons from '@models/Lessons';
import { EmptyResultError, Op } from 'sequelize';
import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosRateLimit from 'axios-rate-limit';

interface lesson {
    lessonId: string;
    lessonType: string;
}

interface lessonResponse {
    classNo: string;
    startTime: string;
    endTime: string;
    weeks: number[];
    venue: string;
    day: string;
    lessonType: string;
    size: number;
    covidZone: string;
}

interface semesterDataResponse {
    semester: number;
    timetable: lessonResponse[];
    covidZones: string[];
}

interface ModuleResponse {
    moduleCode: string;
    title: string;
    semesters: number[];
}

interface Module {
    code: string;
    name: string;
}

/** 
    req: {
    headers: {
        Authorization: ~token~
    }
}
Adds the module to the user and the lessons associated with it
**/
async function populateModules(req: Request, res: Response) {
    await Modules.sync();
    // Fetch module list data from NUSMods API
    await axios
        .get<ModuleResponse[]>(
            `https://api.nusmods.com/v2/${req.body.ay}/moduleList.json`
        )
        .then((axiosRes: AxiosResponse) => {
            const modules = axiosRes.data
                .filter((module: ModuleResponse) => module.moduleCode !== null)
                .map((module: ModuleResponse) => ({
                    code: module.moduleCode,
                    name: module.title
                }))
                .map((module: Module, index: number) => {
                    if ((index + 1) % 1000 === 0) {
                        console.log('Another 1000 records updated');
                    }
                    Modules.create(module, { ignoreDuplicates: true }).catch(
                        (err) => {
                            if (err instanceof EmptyResultError) {
                                console.log('Entry already exists');
                            }
                        }
                    );
                });
            Promise.all(modules)
                .then(() => {
                    return res
                        .status(200)
                        .json({ message: 'database updated!' });
                })
                .catch((err) => {
                    return res.status(500).json({ message: err });
                });
        })
        .catch((err: AxiosError) => {
            console.error('Error populating database:', err.message);
            return res.status(500).json({ message: err });
        });
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    params: {
        ay: '2023-2024'
    }
}
Adds the module to the user and the lessons associated with it
**/
async function populateLessons(req: Request, res: Response) {
    await Modules.sync();
    let counter = 0;
    const axiosPromises: Promise<Response | void>[] = [];
    const axiosRateLimited = axiosRateLimit(axios.create(), { maxRPS: 50 });
    const fakeModules: string[] = [];
    await Modules.findAll().then((modules) => {
        modules.forEach((module) => {
            const axiosPromise = axiosRateLimited
                .get<ModuleResponse[]>(
                    `https://api.nusmods.com/v2/${req.body.ay}/modules/${module.code}.json`
                )
                .then((axiosRes: AxiosResponse) => {
                    const modData = axiosRes.data;
                    modData.semesterData.forEach(
                        (semData: semesterDataResponse) => {
                            semData.timetable.forEach(async (timetable) => {
                                await Lessons.create(
                                    {
                                        moduleCode: modData.moduleCode,
                                        lessonId: timetable.classNo,
                                        lessonType: timetable.lessonType,
                                        sem: semData.semester,
                                        day: timetable.day,
                                        startTime: timetable.startTime,
                                        endTime: timetable.endTime
                                    },
                                    { ignoreDuplicates: true }
                                ).catch((err) => {
                                    if (err instanceof EmptyResultError) {
                                        console.log('Entry already exists!');
                                    }
                                });
                                counter++;
                                console.log(counter);
                            });
                        }
                    );
                })
                .catch((err: AxiosError) => {
                    console.log("Axios Error: Module doesn't exist", err);
                    fakeModules.push(module.code);
                });
            axiosPromises.push(axiosPromise);
        });
    });
    await Promise.all(axiosPromises)
        .then(() => {
            console.log('lessons updated!');
            return res
                .status(200)
                .json({ message: 'database updated!', fakeModules });
        })
        .catch((err) => {
            console.log('Error populating database:', err);
            return res.status(500).json({ message: err });
        });
}

async function hasModule(req: Request, res: Response) {
    const moduleCode = req.query.moduleCode as string;
    return await Modules.findOne({
        where: {
            code: {
                [Op.iLike]: `%${moduleCode}%`
            }
        }
    })
        .then((module) => {
            if (module) {
                return res.status(200).json({ message: 'Module exists!' });
            } else {
                throw Error;
            }
        })
        .catch(() => {
            return res.status(404).json({ message: 'Module does not exist!' });
        });
}

async function searchModules(req: Request, res: Response) {
    const query = req.query.query as string;
    const limit = parseInt(req.query.limit as string);

    if (limit === 0) {
        return await Modules.findAll({
            where: {
                [Op.or]: [
                    {
                        code: {
                            [Op.iLike]: `%${query}%`
                        }
                    },
                    {
                        name: {
                            [Op.iLike]: `%${query}%`
                        }
                    }
                ]
            }
        })
            .then((modules) => {
                return res
                    .status(200)
                    .json({ modules: modules.map((model) => model.toJSON()) });
            })
            .catch((err) => {
                return res.status(401).json({ message: err });
            });
    }
    return await Modules.findAll({
        limit: limit,
        where: {
            [Op.or]: [
                {
                    code: {
                        [Op.iLike]: `%${query}%`
                    }
                },
                {
                    name: {
                        [Op.iLike]: `%${query}%`
                    }
                }
            ]
        }
    })
        .then((modules) => {
            res.status(200).json({
                modules: modules.map((model) => model.toJSON())
            });
        })
        .catch((err) => {
            res.status(401).json({ message: err });
        });
}

/**
 * @returns
 * {
 *     username: string,
 *     modules: [
 *         {
 *             code: string,
 *             name: string,
 *             lessons: [
 *                 {
 *                     id: number,
 *                     lessonId: number,
 *                     moduleCode: string,
 *                     lessonType: string,
 *                     sem: number,
 *                     day: string,
 *                     startTime: string,
 *                     endTime: string
 *                 },
 *                 ...
 *             ]
 *         }, ...
 *     ]
 * }
 * */
async function getLessons(req: Request, res: Response) {
    const query = req.query.query as string;
    const limit = parseInt(req.query.limit as string);

<<<<<<< Updated upstream
    const ans = await Modules.findAll({
        limit: limit,
        where: {
            [Op.or]: [
                {
                    code: {
                        [Op.like]: `%${query}%`
                    }
                },
                {
                    name: {
                        [Op.like]: `%${query}%`
                    }
                }
            ]
        }
    });

    res.status(200).json({ modules: ans.map((model) => model.toJSON()) });
    return ans;
=======
    return await Users.findByPk(username, {
        attributes: ['username'],
        include: [
            {
                model: Users_Modules
            }
        ]
    })
        .then((user) => {
            return user?.getUsers_Modules().then(async (user_modules) => {
                const mods = await Promise.all(
                    user_modules.map(async (user_module) => {
                        const mod = await user_module.getModule();
                        const lesses = await user_module.getLessons();
                        return {
                            code: mod.code,
                            name: mod.name,
                            lessons: lesses.map((less) => less.toJSON())
                        };
                    })
                );
                return res.status(200).json({
                    username: user.username,
                    modules: mods
                });
            });
        })
        .catch((err) =>
            res.status(404).json({ message: 'User not found!', error: err })
        );
>>>>>>> Stashed changes
}

async function getAllPossibleLessons(req: Request, res: Response) {
    const username = req.query.username as string;
    Users.findByPk(username, {
        attributes: ['username'],
        include: [
            {
                model: Modules
            }
        ]
    })
        .then((user) => {
            return user?.getModules().then(async (mods) => {
                const modWithLessons = await Promise.all(
                    mods.map(async (mod) => {
                        return {
                            code: mod.code,
                            name: mod.name,
                            lessons: await mod.getLessons()
                        };
                    })
                );
                return res.status(200).json({
                    username: user.username,
                    modules: modWithLessons
                });
            });
        })
        .catch((err) => {
            return res
                .status(404)
                .json({ message: 'User not found!', error: err });
        });
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        moduleCode: string,
        lessons: [{
            lessonId: string,
            lessonType: string
        },
        ...]
    }
}
Adds the module to the user and the lessons associated with it
**/
async function addModule(req: Request, res: Response) {
    const { username, moduleCode, lessons } = req.body;
    await Users.findByPk(username, {
        include: [
            {
                model: Modules
            }
        ]
    }).then((user) => {
        Modules.findByPk(moduleCode).then((module) => {
            user?.addModule(module as Modules);
        });
    });
    await Users.findByPk(username, {
        include: [
            {
                model: Users_Modules
            }
        ]
    }).then((user) => {
        lessons.map((lesson: lesson) => {
            Lessons.findOne({
                where: {
                    moduleCode: moduleCode,
                    lessonType: lesson.lessonType,
                    lessonId: lesson.lessonId
                }
            }).then((lesson) => {
                user?.users_modules
                    ?.find(
                        (user_module) => user_module.moduleCode === moduleCode
                    )
                    ?.addLesson(lesson as Lessons);
            });
        });
    });
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        moduleCode: string (new lectureCode)
    }
}
Remove specific module taken by user (and all related lessons)
**/
async function removeModule(req: Request, res: Response) {
    const { username, moduleCode } = req.body;
    await Users.findByPk(username, {
        include: [
            {
                model: Modules
            }
        ]
    }).then((user) => {
        Modules.findByPk(moduleCode).then((module) => {
            user?.removeModule(module as Modules);
        });
    });
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        moduleCode: string,
        lessonId: string (e.g. G03),
        lessonType: string,
    }
}
Replaces the lesson being taken by the user for particular module in the database and returns the number of values updated
    **/
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
                    }
                ]
            }
        ]
    }).then((user) => {
        const user_module = user?.users_modules?.find(
            (user_module) => user_module.moduleCode === moduleCode
        );
        user_module?.getLessons().then((lessons) => {
            const lessonToRemove = lessons.find(
                (lesson) =>
                    lesson.moduleCode === moduleCode &&
                    lesson.lessonType === lessonType
            );
            user_module.removeLesson(lessonToRemove);
            Lessons.findOne({
                where: {
                    lessonId: lessonId,
                    lessonType: lessonType,
                    moduleCode: moduleCode
                }
            }).then((lessonToAdd) => {
                user_module.addLesson(lessonToAdd as Lessons);
            });
        });
    });
}

export default {
    populateLessons,
    populateModules,
    hasModule,
    searchModules,
    getLessons,
    getAllPossibleLessons,
    addModule,
    removeModule,
    updateLesson
};
