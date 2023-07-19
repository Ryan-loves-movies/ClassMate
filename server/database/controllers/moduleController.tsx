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
    const ay = parseInt(req.body.ay as string);
    const ayReq = `${ay}-${ay + 1}`;

    // Fetch module list data from NUSMods API
    await axios
        .get<ModuleResponse[]>(
            `https://api.nusmods.com/v2/${ayReq}/moduleList.json`
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
    const ay = parseInt(req.body.ay as string);
    const ayReq = `${ay}-${ay + 1}`;
    const axiosRateLimited = axiosRateLimit(axios.create(), { maxRPS: 50 });
    const fakeModules: string[] = [];
    await Modules.findAll()
        .then(async (modules) => {
            await Promise.all(
                modules.map(async (module) => {
                    return await axiosRateLimited
                        .get<ModuleResponse[]>(
                            `https://api.nusmods.com/v2/${ayReq}/modules/${module.code}.json`
                        )
                        .then((axiosRes: AxiosResponse) => {
                            const modData = axiosRes.data;
                            modData.semesterData.map(
                                async (semData: semesterDataResponse) => {
                                    await Promise.all(
                                        semData.timetable.map(
                                            async (timetable) => {
                                                await Lessons.create(
                                                    {
                                                        ay: ay,
                                                        moduleCode:
                                                            modData.moduleCode,
                                                        lessonId:
                                                            timetable.classNo,
                                                        lessonType:
                                                            timetable.lessonType,
                                                        sem: semData.semester,
                                                        weeks: timetable.weeks,
                                                        venue: timetable.venue,
                                                        day: timetable.day,
                                                        startTime:
                                                            timetable.startTime,
                                                        endTime:
                                                            timetable.endTime,
                                                        size: timetable.size
                                                    },
                                                    { ignoreDuplicates: true }
                                                ).catch((err) => {
                                                    if (
                                                        err instanceof
                                                        EmptyResultError
                                                    ) {
                                                        console.log(
                                                            'Entry already exists!'
                                                        );
                                                    }
                                                });
                                                counter++;
                                                console.log(counter);
                                            }
                                        )
                                    );
                                }
                            );
                        })
                        .catch((err: AxiosError) => {
                            console.log(
                                "Axios Error: Module doesn't exist",
                                err
                            );
                            fakeModules.push(module.code);
                        });
                })
            );
        })
        .then(() => {
            console.log('All lessons updated!');
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
    const ay = parseInt(req.query.ay as string);
    const semester = parseInt(req.query.semester as string);

    return await Modules.findOne({
        where: {
            code: {
                [Op.iLike]: `%${moduleCode}%`
            }
        }
    })
        .then(async (module) => {
            const lessons = await module
                ?.getLessons()
                .then((lesses) =>
                    lesses.filter(
                        (less) => less.sem === semester && less.ay === ay
                    )
                );
            if (module && (lessons?.length as number) > 0) {
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
    const ay = parseInt(req.query.ay as string);
    const semester = parseInt(req.query.semester as string);

    if (limit === 0) {
        return await Modules.findAll({
            where: {
                [Op.or]: [
                    {
                        code: {
                            [Op.iLike]: `${query}%`
                        }
                    },
                    {
                        name: {
                            [Op.iLike]: `%${query}%`
                        }
                    }
                ]
            },
            order: [
                ['code', 'ASC'] // Replace "en_US" with a case-insensitive collation of your choice
            ]
        })
            .then((modules) => {
                const possibleMods = modules
                    .filter(
                        async (mod) =>
                            (
                                await mod
                                    .getLessons()
                                    .then((lessons) =>
                                        lessons.filter(
                                            (less) =>
                                                less.sem === semester &&
                                                less.ay === ay
                                        )
                                    )
                            ).length > 0
                    )
                    .map((mod) => mod.toJSON());
                return res.status(200).json({ modules: possibleMods });
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
                        [Op.iLike]: `${query}%`
                    }
                },
                {
                    name: {
                        [Op.iLike]: `%${query}%`
                    }
                }
            ]
        },
        order: [
            ['code', 'ASC'] // Replace "en_US" with a case-insensitive collation of your choice
        ]
    })
        .then((modules) => {
            const possibleMods = modules
                .filter(
                    async (mod) =>
                        (
                            await mod
                                .getLessons()
                                .then((lessons) =>
                                    lessons.filter(
                                        (less) =>
                                            less.sem === semester &&
                                            less.ay === ay
                                    )
                                )
                        ).length > 0
                )
                .map((mod) => mod.toJSON());
            return res.status(200).json({ modules: possibleMods });
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
    const ay = parseInt(req.query.ay as string);
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
                                lessons.filter(
                                    (less) =>
                                        less.sem == semester && less.ay === ay
                                )
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
    const ay = parseInt(req.query.ay as string);
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
                                        (less) =>
                                            less.sem === semester &&
                                            less.ay === ay
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
    const {
        username,
        moduleCode,
        lessons,
        ay,
        semester
    }: {
        username: string;
        moduleCode: string;
        lessons: lesson[];
        ay: string;
        semester: string;
    } = req.body;
    const actAy = parseInt(ay);
    const actSemester = parseInt(semester);
    return await Users.findByPk(username, {
        include: [
            {
                model: Modules
            },
            {
                model: Users_Modules
            }
        ]
    })
        .then(async (user) => {
            // Find module
            const modToAdd = await Modules.findByPk(moduleCode, {
                include: [
                    {
                        model: Lessons
                    }
                ]
            });

            const lessonsToAdd = (await Promise.all(
                lessons.map(async (less) => await Lessons.findByPk(less.id))
            )) as Lessons[];

            // If lessons === [], then add find default lessons
            if (lessonsToAdd.length === 0) {
                const unfilteredLessons = (
                    await modToAdd?.getLessons()
                )?.filter(
                    (less) => less.sem === actSemester && less.ay === actAy
                );
                const lessonTypes = [
                    ...new Set(
                        unfilteredLessons?.map((less) => less.lessonType)
                    )
                ];

                // Map over to the lessons to actually add
                lessonsToAdd.push(
                    ...(lessonTypes.flatMap((lessonType) => {
                        // Find first matching lesson type
                        const less = unfilteredLessons?.find(
                            (less) => less.lessonType === lessonType
                        );
                        // Filter through 4 variables in total: Only can vary by startTime - i.e. Different slots for same lesson id
                        return unfilteredLessons?.filter(
                            (lesson) =>
                                less?.lessonId === lesson.lessonId &&
                                less?.lessonType === lesson.lessonType
                        );
                    }) as Lessons[])
                );
            }

            // If lessonsToAdd === [] still, then module is useless -> Don't have to add in the first place.
            if (lessonsToAdd.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No lessons for module passed!' });
            }
            await user?.addModule(modToAdd as Modules);
            await (await user?.getUsers_Modules())
                ?.find((user_mod) => user_mod.moduleCode === moduleCode)
                ?.addLessons(lessonsToAdd);
            return res
                .status(200)
                .json({ message: 'Module added with default lessons!' });
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
    const ay = parseInt(req.query.ay as string);
    const semester = parseInt(req.query.semester as string);

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
            await user_module?.getLessons().then(async (lesses) => {
                await user_module.removeLessons(
                    await Promise.all(
                        lesses.filter(
                            (less) => less.ay === ay && less.sem === semester
                        )
                    )
                );
            });

            // Finally delete the module
            await Modules.findByPk(moduleCode).then(async (module) => {
                const survivingLessons = await user_module?.getLessons();
                if (survivingLessons?.length === 0) {
                    await user?.removeModule(module as Modules);
                }
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
        lessonIds: string[] (e.g. [1, 2, 3]) - NOTE: This refers to a list of ids, NOT lessonIds,
    }
}
Replaces the lesson being taken by the user for particular module in the database and returns the number of values updated
    **/
async function updateLesson(req: Request, res: Response) {
    const {
        username,
        lessonIds
    }: {
        username: string;
        lessonIds: string[];
    } = req.body;
    const actLessonIds = lessonIds.map((less) => parseInt(less));
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
            const user_modules = await user?.getUsers_Modules();
            const unfilteredLessons = await Promise.all(
                actLessonIds.map(
                    async (lessId) => await Lessons.findByPk(lessId)
                )
            );

            // Remove all related lesson types and module codes
            const lessonTypes: Lessons[] = [];
            unfilteredLessons.forEach((less) => {
                if (
                    lessonTypes.find(
                        (lessType) =>
                            lessType.ay === less?.ay &&
                            lessType.sem === less.sem &&
                            lessType.moduleCode === less.moduleCode &&
                            lessType.lessonType === less.lessonType
                    ) === undefined
                ) {
                    lessonTypes.push(less as Lessons);
                }
            });
            await Promise.all(
                lessonTypes.map(async (less) => {
                    const user_module = user_modules?.find(
                        (user_mod) => user_mod.moduleCode === less.moduleCode
                    );
                    const lessonsToRemove = (
                        await user_module?.getLessons()
                    )?.filter(
                        (toRemove) =>
                            toRemove.ay === less?.ay &&
                            toRemove.sem === less.sem &&
                            toRemove.moduleCode === less.moduleCode &&
                            toRemove.lessonType === less.lessonType
                    );
                    user_module?.removeLessons(lessonsToRemove);
                })
            );

            // Add lessons that are found
            await Promise.all(
                unfilteredLessons.map(async (less) => {
                    const user_module = user_modules?.find(
                        (user_mod) => user_mod.moduleCode === less?.moduleCode
                    );
                    await user_module?.addLesson(less as Lessons);
                })
            );

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
