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
    lessons: lesson[];
}

interface resultModNoName {
    code: string;
    lessons: lesson[];
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
                    const optMod = optUser?.modules.find(
                        (mod) => mod.code === user_mod.moduleCode
                    );

                    // Remove the original lessons first
                    const origLess = await user_mod.getLessons();
                    await user_mod.removeLessons(origLess);

                    // Add the new lessons
                    await Promise.all(
                        optMod?.lessons.map(async (less) => {
                            const actLess = await Lessons.findByPk(less.id);
                            return await user_mod.addLesson(actLess as Lessons);
                        }) || []
                    );
                }) || []
            );

            // Replace lessons for common module as well
            const commonUser_Mod = user_mods?.find(
                (user_mod) => user_mod.moduleCode === commonModule.code
            );
            const origCommonUser_ModLess = await commonUser_Mod?.getLessons();
            await commonUser_Mod?.removeLessons(origCommonUser_ModLess);
            await Promise.all(
                optUser?.modules
                    .find((mod) => mod.code === commonModule.code)
                    ?.lessons.map(async (less) => {
                        const actLess = await Lessons.findByPk(less.id);
                        return await commonUser_Mod?.addLesson(
                            actLess as Lessons
                        );
                    }) || []
            );
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
