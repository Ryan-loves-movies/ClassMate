import { Request, Response } from 'express';
import timetableGenerator from './solver';

import lesson from '@interfaces/lesson';
import module, { moduleWithoutName } from '@interfaces/module';
import { userWithoutEmailPhoto } from '@interfaces/user';
import Users from '@models/Users';
import Users_Modules from '@models/Users_Modules';
import Lessons from '@models/Lessons';

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
    const {
        users,
        commonModule
    }: { users: fullUser[]; commonModule: moduleWithoutName } = req.body;
    const usersOptimalTimetables = (await timetableGenerator(
        users,
        commonModule
    )) as result;
    const ay = usersOptimalTimetables.commonModule.lessons[0][0].ay;
    const semester = usersOptimalTimetables.commonModule.lessons[0][0].sem;

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
                            (less) => less.ay === ay && less.sem === semester
                        )
                    );

                    // Add the new lessons
                    await Lessons.findAll({
                        where: {
                            id: optMod?.lessons.flatMap(
                                (lessType) =>
                                    lessType.flatMap((less) => less.id) || []
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
            const origCommonUser_ModLess = await commonUser_Mod?.getLessons();
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
            }).then(async (lesses) => await commonUser_Mod?.addLessons(lesses));
        })
    )
        .then(() => res.status(200).json({ message: 'Timetables Updated!' }))
        .catch((err) =>
            res.status(500).json({
                message: 'Failed to find a working timetable',
                error: err
            })
        );
}
