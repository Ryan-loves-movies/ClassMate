'use client';
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

interface modifiedLesson extends lesson {
    startTimeVar: Arith;
    endTimeVar: Arith;
    boolVar: Arith;
}

interface modifiedModule extends module {
    lessons: modifiedLesson[][]; // To split into groups of lesson types so nested array
}

interface modifiedUser extends userWithoutEmailPhoto {
    modules: modifiedModule[];
    commonModule: modifiedModule;
}

interface modifiedUsers {
    users: modifiedUser[];
    commonModule: modifiedModule;
}

import { init } from 'z3-solver/build/node';
import type { Arith } from 'z3-solver/build/node';

/** @param users: fullUser[] - The lessons field should consist of all valid lessons that can be taken by each user
 * */
export default async function timetableGenerator(
    users: fullUser[],
    commonModule: moduleWithoutName
) {
    const { Context } = await init();
    const { Solver, Int, If, Or } = Context('main');

    const solver = new Solver();

    // Add boolVar, startTimeVar, endTimeVar to each lesson. THERE MUST BE A COMMON MODULE
    const commonModuleLessons = users[0].modules.find(
        (user_mod) => user_mod.code === commonModule.code
    )!;
    const commonLessonTypes = [
        ...new Set(commonModuleLessons?.lessons.map((less) => less.lessonType))
    ];
    const modUsers = {
        users: users.map((user) => {
            return {
                username: user.username,
                modules: user.modules
                    .filter((user_mod) => user_mod.code !== commonModule.code)
                    .map((user_mod) => {
                        const lessonTypes = [
                            ...new Set(
                                user_mod.lessons.map((less) => less.lessonType)
                            )
                        ];
                        return {
                            code: user_mod.code,
                            name: user_mod.name,
                            lessons: lessonTypes.map((lessonType) => {
                                return user_mod.lessons
                                    .filter(
                                        (less) => less.lessonType === lessonType
                                    )
                                    .map((less) => {
                                        const boolVar = Int.const(
                                            `${user.username}_${user_mod.code}_${less.id}_bool`
                                        );
                                        const startTimeVar = Int.const(
                                            `${user.username}_${user_mod.code}_${less.id}_startTime`
                                        );
                                        const endTimeVar = Int.const(
                                            `${user.username}_${user_mod.code}_${less.id}_endTime`
                                        );
                                        solver.add(
                                            Or(boolVar.eq(0), boolVar.eq(1)),
                                            If(
                                                boolVar.eq(0),
                                                startTimeVar.eq(0),
                                                startTimeVar.eq(
                                                    parseInt(less.startTime)
                                                )
                                            ),
                                            If(
                                                boolVar.eq(0),
                                                endTimeVar.eq(0),
                                                endTimeVar.eq(
                                                    parseInt(less.endTime)
                                                )
                                            )
                                        );
                                        return {
                                            ...less,
                                            startTimeVar: startTimeVar,
                                            endTimeVar: endTimeVar,
                                            boolVar: boolVar
                                        };
                                    });
                            })
                        };
                    })
            } as modifiedUser;
        }),
        commonModule: {
            code: commonModule.code,
            lessons: commonLessonTypes.map((lessType) => {
                return commonModuleLessons.lessons
                    .filter((less) => less.lessonType === lessType)
                    .map((less) => {
                        const boolVar = Int.const(
                            `${commonModule.code}_${less.id}_bool`
                        );
                        const startTimeVar = Int.const(
                            `${commonModule.code}_${less.id}_startTime`
                        );
                        const endTimeVar = Int.const(
                            `${commonModule.code}_${less.id}_endTime`
                        );
                        solver.add(
                            Or(boolVar.eq(0), boolVar.eq(1)),
                            If(
                                boolVar.eq(0),
                                startTimeVar.eq(0),
                                startTimeVar.eq(parseInt(less.startTime))
                            ),
                            If(
                                boolVar.eq(0),
                                endTimeVar.eq(0),
                                endTimeVar.eq(parseInt(less.startTime))
                            )
                        );
                        return {
                            ...less,
                            startTimeVar: startTimeVar,
                            endTimeVar: endTimeVar,
                            boolVar: boolVar
                        };
                    });
            })
        }
    } as modifiedUsers;

    // Constraint 1: Must have only 1 lesson for each lesson type
    modUsers.users.forEach((modUser) => {
        modUser.modules.forEach((specificMod) => {
            specificMod.lessons.forEach((lessType) => {
                const initial = lessType[0].boolVar;
                const lessTypeSum = lessType
                    .slice(1)
                    .reduce(
                        (firstLess, secLess) => firstLess.add(secLess.boolVar),
                        initial
                    );
                solver.add(lessTypeSum.eq(1));
            });
        });
    });
    modUsers.commonModule.lessons.forEach((lessType) => {
        const initial = lessType[0].boolVar;
        const lessTypeSum = lessType
            .slice(1)
            .reduce(
                (firstLess, secLess) => firstLess.add(secLess.boolVar),
                initial
            );
        solver.add(lessTypeSum.eq(1));
    });

    // Constraint 2: No overlap in time slots for the modules not shared by the group
    modUsers.users.forEach((modUser) => {
        for (let modInd = 0; modInd < modUser.modules.length; modInd++) {
            const specificMod = modUser.modules[modInd];

            // Presume that lesson types of modules will never clash
            specificMod.lessons.forEach((lessType) => {
                lessType.forEach((less) => {
                    // Check with each and every lesson for every other module
                    for (
                        let nextModInd = modInd + 1;
                        nextModInd < modUser.modules.length;
                        nextModInd++
                    ) {
                        const nextSpecificMod = modUser.modules[nextModInd];

                        nextSpecificMod.lessons.forEach((nextLessType) => {
                            nextLessType.forEach((nextLess) => {
                                solver.add(
                                    Or(
                                        Or(
                                            less.boolVar.eq(0),
                                            nextLess.boolVar.eq(0)
                                        ),
                                        Or(
                                            less.endTimeVar.le(
                                                nextLess.startTimeVar
                                            ),
                                            less.startTimeVar.ge(
                                                nextLess.endTimeVar
                                            )
                                        )
                                    )
                                );
                            });
                        });
                    }
                    // Add constraint for common module as well
                    modUsers.commonModule.lessons.forEach((nextLessType) => {
                        nextLessType.forEach((nextLess) => {
                            solver.add(
                                Or(
                                    Or(
                                        less.boolVar.eq(0),
                                        nextLess.boolVar.eq(0)
                                    ),
                                    Or(
                                        less.endTimeVar.le(
                                            nextLess.startTimeVar
                                        ),
                                        less.startTimeVar.ge(
                                            nextLess.endTimeVar
                                        )
                                    )
                                )
                            );
                        });
                    });
                });
            });
        }
    });

    solver.check().then((result) => {
        if (result === 'sat') {
            const model = solver.model();

            modUsers.commonModule.lessons.map((lessType) => {
                lessType.map((less) => {
                    console.log(
                        `${commonModule.code}_${less.id}_${less.startTime}_${less.endTime}`
                    );
                    console.log(model.eval(less.boolVar).toString());
                });
            });
        } else {
            console.log('No valid timetable exists for the group.');
        }
    });
}
