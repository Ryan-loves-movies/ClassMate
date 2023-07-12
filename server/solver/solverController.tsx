import { Request, Response } from 'express';
import timetableGenerator from './solver';

interface lesson {
    id: number;
    lessonId: string;
    moduleCode: string;
    lessonType: string;
    sem: number;
    day: string;
    startTime: string;
    endTime: string;
}

interface module {
    code: string;
    name: string;
}

interface moduleWithoutName {
    code: string;
}

interface userWithoutEmailPhoto {
    username: string;
}

interface fullModule extends module {
    lessons: lesson[];
}

interface fullUser extends userWithoutEmailPhoto {
    modules: fullModule[];
}

export default async function generateTimetable(req: Request, res: Response) {
    const {
        users,
        commonModule
    }: { users: fullUser[]; commonModule: moduleWithoutName } = req.body;
    timetableGenerator(users, commonModule);
}
