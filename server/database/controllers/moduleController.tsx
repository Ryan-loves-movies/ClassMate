import { Request, Response } from 'express';
import Users from '@models/Users';
import Modules from '@models/Modules';
import Users_Modules from '@models/Users_Modules';
import Users_Modules_Lessons from '@models/Users_Modules_Lessons';
import Lessons from '@models/Lessons';
import { EmptyResultError, Op } from 'sequelize';
import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosRateLimit from 'axios-rate-limit';

import module from '@interfaces/module';
import lesson from '@interfaces/lesson';

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
                .map((mod: module, index: number) => {
                    if ((index + 1) % 1000 === 0) {
                        console.log('Another 1000 records updated');
                    }
                    Modules.create(mod, { ignoreDuplicates: true }).catch(
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
                .catch((err: Error) => {
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
                                        weeks: timetable.weeks,
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
        .catch((err: Error) => {
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
async function getLessons(
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>> | undefined> {
    const username = req.query.username as string;
    const semester = parseInt(req.query.semester as string);

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
                        const lesses = await user_module
                            .getLessons()
                            .then((lessons) =>
                                lessons.filter((less) => less.sem == semester)
                            );
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
}

async function getAllPossibleLessons(req: Request, res: Response) {
    const username = req.query.username as string;
    const semester = parseInt(req.query.semester as string);

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
                            lessons: await mod
                                .getLessons()
                                .then((lesses) =>
                                    lesses.filter(
                                        (less) => less.sem === semester
                                    )
                                )
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
If lessons === [], handler will add the default lessons associated with the module
**/
async function addModule(req: Request, res: Response) {
    const { username, moduleCode, lessons, semester } = req.body;
    return await Users.findByPk(username, {
        include: [
            {
                model: Modules
            }
        ]
    })
        .then(async (user) => {
            return await Modules.findByPk(moduleCode).then((module) => {
                return user?.addModule(module as Modules);
            });
        })
        .then(() => {
            Users.findByPk(username, {
                include: [
                    {
                        model: Users_Modules
                    }
                ]
            }).then(async (user) => {
                if (lessons.length === 0) {
                    const mod = await Modules.findByPk(moduleCode, {
                        include: [
                            {
                                model: Lessons
                            }
                        ]
                    });
                    const lessonTypes = [
                        ...new Set(
                            await mod
                                ?.getLessons()
                                .then((lesses) =>
                                    lesses
                                        .filter((less) => less.sem === semester)
                                        .map((less) => less.lessonType)
                                )
                        )
                    ];
                    await Promise.all(
                        lessonTypes.map(async (lessonType) => {
                            const lesses = await mod
                                ?.getLessons()
                                .then((lessons) =>
                                    lessons.filter(
                                        (less) => less.sem === semester
                                    )
                                );
                            const user_modules = await user?.getUsers_Modules();
                            const user_module = user_modules?.find(
                                (user_module) =>
                                    user_module.moduleCode === moduleCode
                            );
                            const less = lesses?.find(
                                (less) => less.lessonType === lessonType
                            );
                            await user_module?.addLessons(
                                lesses?.filter(
                                    (lesson) =>
                                        less?.lessonId === lesson.lessonId
                                )
                            );
                        })
                    );
                    return res.status(200).json({ message: 'Module added!' });
                }

                await Promise.all(
                    lessons.map(async (lesson: lesson) => {
                        return await Lessons.findOne({
                            where: {
                                moduleCode: moduleCode,
                                lessonType: lesson.lessonType,
                                lessonId: lesson.lessonId,
                                sem: lesson.sem,
                                startTime: lesson.startTime
                            }
                        }).then((lesson) => {
                            user?.getUsers_Modules().then((user_modules) => {
                                return user_modules
                                    .find(
                                        (user_module) =>
                                            user_module.moduleCode ===
                                            moduleCode
                                    )
                                    ?.addLesson(lesson as Lessons);
                            });
                        });
                    })
                );
                return res.status(200).json({ message: 'Module added!' });
            });
        })
        .catch((err) =>
            res.status(404).json({
                message: 'User not found or module already exists!',
                error: err
            })
        );
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
    const username = req.query.username as string;
    const moduleCode = req.query.moduleCode as string;
    return await Users.findByPk(username, {
        include: [
            {
                model: Modules
            }
        ]
    })
        .then(async (user) => {
            // First delete all lessons associated with the user_module entry
            const user_module = await Users_Modules.findOne({
                where: {
                    username: username,
                    moduleCode: moduleCode
                }
            });
            await Users_Modules_Lessons.destroy({
                where: {
                    userId: user_module?.id
                }
            });

            // Finally delete the module
            await Modules.findByPk(moduleCode).then(async (module) => {
                await user?.removeModule(module as Modules);
            });

            return res.status(200).json({ message: 'Module removed!' });
        })
        .catch((err) =>
            res.status(404).json({ message: 'User not found!', error: err })
        );
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
    const { username, moduleCode, lessonId, lessonType, semester } = req.body;
    return await Users.findByPk(username, {
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
    })
        .then(async (user) => {
            const user_module = await user
                ?.getUsers_Modules()
                .then((user_modules) =>
                    user_modules.find(
                        (user_module) => user_module.moduleCode === moduleCode
                    )
                );

            // Delete all lessons related to the lesson type and module to be updated
            const lessons = await user_module?.getLessons();
            const lessonToRemove = lessons?.find(
                (lesson) =>
                    lesson.moduleCode === moduleCode &&
                    lesson.lessonType === lessonType
            );
            await user_module?.removeLesson(lessonToRemove);

            // Finally add the lesson passed as param
            Lessons.findAll({
                where: {
                    lessonId: lessonId,
                    lessonType: lessonType,
                    moduleCode: moduleCode,
                    sem: semester
                }
            }).then((lessonToAdd) => {
                user_module?.addLessons(lessonToAdd);
            });
            return res.status(200).json({ message: 'Lesson updated!' });
        })
        .catch((err) =>
            res.status(404).json({ message: 'User not found!', error: err })
        );
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
