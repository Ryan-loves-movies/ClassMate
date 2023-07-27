import { Request, Response } from 'express';
import timetableGenerator from './solver';

import lesson from '@interfaces/lesson';
import module, { moduleWithoutName } from '@interfaces/module';
import { userWithoutEmailPhoto } from '@interfaces/user';
import Users from '@models/Users';
import Users_Modules from '@models/Users_Modules';
import Lessons from '@models/Lessons';
import Constraints from '@models/Constraints';

interface fullModule extends module {
    lessons: lesson[];
}

interface fullUser extends userWithoutEmailPhoto {
    modules: fullModule[];
}

interface resultMod {
    code: string;
    name: string;
    lessons: lesson[][];
}

interface resultModNoName {
    code: string;
    lessons: lesson[][];
}

interface result {
    users: {
        username: string;
        modules: resultMod[];
    }[];
    commonModule: resultModNoName;
}

export default async function generateTimetable(req: Request, res: Response) {
    let {
        users,
        commonModule
    }: { users: fullUser[]; commonModule: moduleWithoutName } = req.body;

    try {
        let firstConstraintPassed = true;
        let failedLessons: string = '';
        const ay = users[0].modules[0].lessons[0].ay;
        const semester = users[0].modules[0].lessons[0].sem;
        users = await Promise.all(
            users.map(async (user) => {
                const constraint = (await Constraints.findOne({
                    where: {
                        username: user.username,
                        ay: ay,
                        sem: semester
                    }
                }).then(async (constraint) => {
                    if (!constraint) {
                        return await Constraints.create({
                            username: user.username,
                            ay: ay,
                            sem: semester,
                            startTime: '0800',
                            endTime: '2200'
                        });
                    }
                    return constraint;
                })) as Constraints;

                return {
                    username: user.username,
                    modules: user.modules.map((mod) => {
                        const lessonTypes = [
                            ...new Set(
                                mod.lessons.map((lesson) => lesson.lessonType)
                            )
                        ];
                        const constrainedLessons = mod.lessons.filter(
                            (lesson) => {
                                return (
                                    parseInt(lesson.startTime) >=
                                        parseInt(constraint.startTime) &&
                                    parseInt(lesson.endTime) <=
                                        parseInt(constraint.endTime)
                                );
                            }
                        );
                        const constrainedLessonTypes = [
                            ...new Set(
                                constrainedLessons.map(
                                    (lesson) => lesson.lessonType
                                )
                            )
                        ];
                        if (
                            lessonTypes.length !== constrainedLessonTypes.length
                        ) {
                            firstConstraintPassed = false;
                            const failedLessonTypes = lessonTypes.filter(
                                (lessonType) =>
                                    !constrainedLessonTypes.includes(lessonType)
                            );
                            failedLessons = `${user.username}-${
                                mod.code
                            }-${failedLessonTypes.join(', ')}`;
                        }
                        return {
                            code: mod.code,
                            name: mod.name,
                            lessons: constrainedLessons
                        };
                    })
                };
            })
        );
        if (!firstConstraintPassed) {
            throw new Error(
                `The following lessons failed to meet time range constraint - ${failedLessons}`
            );
        }

        const usersOptimalTimetables = (await timetableGenerator(
            users,
            commonModule
        )) as result;

        return await Promise.all(
            users.map(async (usr) => {
                const optUser = usersOptimalTimetables.users.find(
                    (optUsr) => optUsr.username === usr.username
                );
                const user = await Users.findByPk(usr.username, {
                    attributes: ['username'],
                    include: [
                        {
                            model: Users_Modules
                        }
                    ]
                });
                const user_mods = await user?.getUsers_Modules();

                // Replace the lessons
                await Promise.all(
                    user_mods?.forEach(async (user_mod) => {
                        if (user_mod.moduleCode === commonModule.code) {
                            return;
                        }
                        const optMod = optUser?.modules.find(
                            (mod) => mod.code === user_mod.moduleCode
                        );

                        // Remove the original lessons first
                        const origLess = await user_mod.getLessons();
                        await user_mod.removeLessons(
                            origLess.filter(
                                (less) =>
                                    less.ay === ay && less.sem === semester
                            )
                        );

                        // Add the new lessons
                        await Lessons.findAll({
                            where: {
                                id: optMod?.lessons.flatMap(
                                    (lessType) =>
                                        lessType.flatMap((less) => less.id) ||
                                        []
                                )
                            }
                        }).then(
                            async (lesses) => await user_mod.addLessons(lesses)
                        );
                    }) || []
                );

                // Replace lessons for common module as well
                const commonUser_Mod = user_mods?.find(
                    (user_mod) => user_mod.moduleCode === commonModule.code
                );
                const origCommonUser_ModLess =
                    await commonUser_Mod?.getLessons();
                await commonUser_Mod?.removeLessons(
                    origCommonUser_ModLess?.filter(
                        (less) => less.ay === ay && less.sem === semester
                    )
                );
                await Lessons.findAll({
                    where: {
                        id: usersOptimalTimetables.commonModule.lessons.flatMap(
                            (lessType) => lessType.flatMap((less) => less.id)
                        )
                    }
                }).then(
                    async (lesses) => await commonUser_Mod?.addLessons(lesses)
                );
            })
        )
            .then(() =>
                res.status(200).json({ message: 'Timetables Updated!' })
            )
            .catch((err) =>
                res.status(500).json({
                    message: 'Failed to find a working timetable',
                    error: err
                })
            );
    } catch (err) {
        return res.status(500).json({
            message: 'Error when retrieving lessons for optimisation!',
            error: (err as Error).message
        });
    }
}
