'use client';
import lesson from '@interfaces/lesson';
import module, { moduleWithoutName } from '@interfaces/module';
import { userWithoutEmailPhoto } from '@interfaces/user';

interface fullModule extends module {
    lessons: lesson[];
}

interface fullUser extends userWithoutEmailPhoto {
    modules: fullModule[];
}

interface modifiedLesson extends lesson {
    weeksVar: BitVecNum<number, 'main'>;
    dayVar: Arith;
    startTimeVar: Arith;
    endTimeVar: Arith;
    boolVar: Arith;
}

interface modifiedModule extends module {
    lessons: modifiedLesson[][]; // To split into groups of lesson types so nested array
}

interface modifiedUser extends userWithoutEmailPhoto {
    modules: modifiedModule[];
}

interface modifiedUsers {
    users: modifiedUser[];
    commonModule: modifiedModule;
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

import { init } from 'z3-solver/build/node';
import type { Arith, BitVecNum } from 'z3-solver/build/node';

const dayMapper: Map<string, number> = new Map<string, number>();
dayMapper.set('Monday', 1);
dayMapper.set('Tuesday', 2);
dayMapper.set('Wednesday', 3);
dayMapper.set('Thursday', 4);
dayMapper.set('Friday', 5);
dayMapper.set('Saturday', 6);
dayMapper.set('Sunday', 7);

function convertDayToNumber(day: string): number {
    return dayMapper.get(day) as number;
}

/**
 * @param arr: [1, 2, 3, 4, 5, 6 ..., 13]
 * @returns a number representing the arr as such - [1, 2, ..., 13] -> 111...11 that is 13 characters long -> 8191
 * */
function convertArrToNumber(arr: number[]): number {
    return arr
        .map((num) => Math.pow(2, num - 1))
        .reduce((firstNum, secNum) => firstNum + secNum);
}

/** @param users: fullUser[] - The lessons field should consist of all valid lessons that can be taken by each user
 * */
export default async function timetableGenerator(
    users: fullUser[],
    commonModule: moduleWithoutName
) {
    const { Context } = await init();
    const { Solver, Int, BitVec, If, Or } = Context('main');

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
                                        const weeksVar = BitVec.val(
                                            // `${user.username}_${user_mod.code}_${less.id}_weeks`,
                                            convertArrToNumber(less.weeks),
                                            13
                                        );
                                        const dayVar = Int.const(
                                            `${user.username}_${user_mod.code}_${less.id}_day`
                                        );
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
                                                dayVar.eq(0),
                                                dayVar.eq(
                                                    convertDayToNumber(less.day)
                                                )
                                            ),
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
                                            weeksVar: weeksVar,
                                            dayVar: dayVar,
                                            startTimeVar: startTimeVar,
                                            endTimeVar: endTimeVar,
                                            boolVar: boolVar
                                        };
                                    });
                            }) as modifiedLesson[][]
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
                        const weeksVar = BitVec.val(
                            // `${commonModule.code}_${less.id}_weeks`,
                            convertArrToNumber(less.weeks),
                            13
                        );
                        const dayVar = Int.const(
                            `${commonModule.code}_${less.id}_day`
                        );
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
                                dayVar.eq(0),
                                dayVar.eq(convertDayToNumber(less.day))
                            ),
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
                            weeksVar: weeksVar,
                            dayVar: dayVar,
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
                                // Conditions:
                                //     1. Either one of the lessons are not in play in the first place
                                //     2. Firstly, if weeks don't interfere at all, pass
                                //     3. Secondly, if days don't interfere at all, pass
                                //     4. Lastly, timeslots don't interfere
                                solver.add(
                                    Or(
                                        Or(
                                            less.boolVar.eq(0),
                                            nextLess.boolVar.eq(0)
                                        ),
                                        Or(
                                            less.weeksVar
                                                .xor(nextLess.weeksVar)
                                                .redAnd()
                                                .ule(1),
                                            Or(
                                                less.dayVar.neq(
                                                    nextLess.dayVar
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
                                        less.weeksVar
                                            .xor(nextLess.weeksVar)
                                            .redAnd()
                                            .ule(1),
                                        Or(
                                            less.dayVar.neq(nextLess.dayVar),
                                            Or(
                                                less.endTimeVar.le(
                                                    nextLess.startTimeVar
                                                ),
                                                less.startTimeVar.ge(
                                                    nextLess.endTimeVar
                                                )
                                            )
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

    const result = await solver.check();

    if (result === 'sat') {
        const model = solver.model();

        const res: result = {
            users: modUsers.users.map((user) => {
                return {
                    username: user.username,
                    modules: user.modules.map((user_module) => {
                        return {
                            code: user_module.code,
                            name: user_module.name,
                            lessons: user_module.lessons.map((lessType) => {
                                const less = lessType.find(
                                    (less) =>
                                        parseInt(
                                            model.eval(less.boolVar).toString()
                                        ) === 1
                                ) as lesson;
                                return {
                                    id: less.id,
                                    lessonId: less.lessonId,
                                    moduleCode: less.moduleCode,
                                    lessonType: less.lessonType,
                                    sem: less.sem,
                                    weeks: less.weeks,
                                    day: less.day,
                                    startTime: less.startTime,
                                    endTime: less.endTime
                                } as lesson;
                            })
                        } as resultMod;
                    })
                };
            }),
            commonModule: {
                code: commonModule.code,
                lessons: modUsers.commonModule.lessons.map((lessType) => {
                    const less = lessType.find(
                        (less) =>
                            parseInt(model.eval(less.boolVar).toString()) === 1
                    ) as lesson;
                    return {
                        id: less.id,
                        lessonId: less.lessonId,
                        moduleCode: less.moduleCode,
                        lessonType: less.lessonType,
                        sem: less.sem,
                        weeks: less.weeks,
                        day: less.day,
                        startTime: less.startTime,
                        endTime: less.endTime
                    } as lesson;
                })
            }
        };
        return res;
    } else {
        console.log('No valid timetable exists for the group.');
        return null;
    }
}
