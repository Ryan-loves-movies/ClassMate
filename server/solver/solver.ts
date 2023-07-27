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
    lessons: modifiedLesson[][][]; // To split into groups of lesson types so nested array + each lesson id is grouped into an array
}

interface modiifiedModuleWithoutName extends moduleWithoutName {
    lessons: modifiedLesson[][][];
}

interface modifiedUser extends userWithoutEmailPhoto {
    modules: modifiedModule[];
}

interface modifiedUsers {
    users: modifiedUser[];
    commonModule: modiifiedModuleWithoutName;
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

import { init } from 'z3-solver/build/node';
import type { Arith, BitVecNum, Bool as BoolType } from 'z3-solver/build/node';

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
    const { Solver, Int, BitVec, Or, And } = Context('main');

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
                                const lessons = user_mod.lessons.filter(
                                    (lesson) => lesson.lessonType === lessonType
                                );
                                const lessIds = [
                                    ...new Set(
                                        lessons.map((less) => less.lessonId)
                                    )
                                ];
                                return lessIds.map((lessId) => {
                                    return lessons
                                        .filter(
                                            (less) => less.lessonId === lessId
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
                                                Or(
                                                    boolVar.eq(0),
                                                    boolVar.eq(1)
                                                ),
                                                dayVar.eq(
                                                    convertDayToNumber(less.day)
                                                ),
                                                startTimeVar.eq(
                                                    parseInt(less.startTime)
                                                ),
                                                endTimeVar.eq(
                                                    parseInt(less.endTime)
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
                                }) as modifiedLesson[][];
                            })
                        };
                    })
            } as modifiedUser;
        }),
        commonModule: {
            code: commonModule.code,
            lessons: commonLessonTypes.map((lessType) => {
                const lessons = commonModuleLessons.lessons.filter(
                    (lesson) => lesson.lessonType === lessType
                );
                const lessIds = [
                    ...new Set(lessons.map((less) => less.lessonId))
                ];
                return lessIds.map((lessId) => {
                    return lessons
                        .filter((less) => less.lessonId === lessId)
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
                                dayVar.eq(convertDayToNumber(less.day)),
                                startTimeVar.eq(parseInt(less.startTime)),
                                endTimeVar.eq(parseInt(less.endTime))
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
                });
            })
        } as modiifiedModuleWithoutName
    } as modifiedUsers;

    console.log(
        modUsers.users[0].modules.map((mod) =>
            mod.lessons
                .flat()
                .flat()
                .map(
                    (less) =>
                        `${less.moduleCode}-${less.lessonType}-${less.lessonId}`
                )
        )
    );
    console.log(
        modUsers.commonModule.lessons.map((less) =>
            less
                .flat()
                .flat()
                .map(
                    (miniLess) =>
                        `${miniLess.moduleCode}-${miniLess.lessonType}-${miniLess.lessonId}`
                )
        )
    );

    // Constraint 1: Must have only 1 lesson for each lesson type
    modUsers.users.forEach((modUser) => {
        modUser.modules.forEach((specificMod) => {
            specificMod.lessons.forEach((lessType) => {
                // lessType.map((less) => {
                //     const fullSum = less.map(() => 1).reduce((a, b) => a + b);
                //     const varSum = less
                //         .map((specificLess) => specificLess.boolVar)
                //         .reduce((a, b) => a.add(b));
                //     solver.add(Or(varSum.eq(fullSum), varSum.eq(0)));
                // });
                solver.add(
                    lessType
                        .map((lessId) => lessId[0].boolVar)
                        .reduce((a, b) => a.add(b))
                        .eq(1)
                );
            });
        });
    });
    modUsers.commonModule.lessons.forEach((lessType) => {
        // lessType.map((less) => {
        //     const fullSum = less.map(() => 1).reduce((a, b) => a + b);
        //     const varSum = less
        //         .map((specificLess) => specificLess.boolVar)
        //         .reduce((a, b) => a.add(b));
        //     solver.add(Or(varSum.eq(fullSum), varSum.eq(0)));
        // });
        const lessTypeSum = lessType
            .map((less) => less[0].boolVar)
            .reduce((firstLess, secLess) => firstLess.add(secLess));
        solver.add(lessTypeSum.eq(1));
    });

    const reduceInterferenceConstraint = (
        operator: (
            prevLessMini: modifiedLesson,
            nextLessMini: modifiedLesson
        ) => BoolType,
        less: modifiedLesson[],
        nextLess: modifiedLesson[]
    ) => {
        return And(
            ...less.map((lessId) => {
                return And(
                    ...nextLess.map((nextLessId) =>
                        operator(lessId, nextLessId)
                    )
                );
            })
        );
    };

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
                                //     1. Either one of the lessons are not in play in the first place, pass
                                //     2. Firstly, if weeks don't interfere at all, pass
                                //     3. Secondly, if days don't interfere at all, pass
                                //     4. Lastly, timeslots don't interfere
                                solver.add(
                                    Or(
                                        // Or(
                                        less[0].boolVar.eq(0),
                                        nextLess[0].boolVar.eq(0),
                                        reduceInterferenceConstraint(
                                            (lessId, nextLessId) =>
                                                Or(
                                                    lessId.weeksVar
                                                        .xor(
                                                            nextLessId.weeksVar
                                                        )
                                                        .redAnd()
                                                        .uge(1),
                                                    lessId.dayVar.neq(
                                                        nextLessId.dayVar
                                                    ),
                                                    lessId.endTimeVar.le(
                                                        nextLessId.startTimeVar
                                                    ),
                                                    lessId.startTimeVar.ge(
                                                        nextLessId.endTimeVar
                                                    )
                                                ),
                                            less,
                                            nextLess
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
                                    less[0].boolVar.eq(0),
                                    nextLess[0].boolVar.eq(0),
                                    reduceInterferenceConstraint(
                                        (lessId, nextLessId) =>
                                            Or(
                                                lessId.weeksVar
                                                    .xor(nextLessId.weeksVar)
                                                    .redAnd()
                                                    .uge(1),
                                                lessId.dayVar.neq(
                                                    nextLessId.dayVar
                                                ),
                                                lessId.endTimeVar.le(
                                                    nextLessId.startTimeVar
                                                ),
                                                lessId.startTimeVar.ge(
                                                    nextLessId.endTimeVar
                                                )
                                            ),
                                        less,
                                        nextLess
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
                                            model
                                                .eval(less[0].boolVar)
                                                .toString()
                                        ) === 1
                                ) as lesson[];
                                return less.map((actLess) => {
                                    return {
                                        id: actLess.id,
                                        lessonId: actLess.lessonId,
                                        moduleCode: actLess.moduleCode,
                                        lessonType: actLess.lessonType,
                                        ay: actLess.ay,
                                        sem: actLess.sem,
                                        weeks: actLess.weeks,
                                        day: actLess.day,
                                        startTime: actLess.startTime,
                                        endTime: actLess.endTime,
                                        venue: actLess.venue
                                    } as lesson;
                                });
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
                            parseInt(model.eval(less[0].boolVar).toString()) ===
                            1
                    ) as lesson[];
                    return less.map((actLess) => {
                        return {
                            id: actLess.id,
                            lessonId: actLess.lessonId,
                            moduleCode: actLess.moduleCode,
                            lessonType: actLess.lessonType,
                            ay: actLess.ay,
                            sem: actLess.sem,
                            weeks: actLess.weeks,
                            day: actLess.day,
                            startTime: actLess.startTime,
                            endTime: actLess.endTime,
                            venue: actLess.venue
                        } as lesson;
                    });
                })
            }
        };
        return res;
    } else {
        console.log('No valid timetable exists for the group.');
        return null;
    }
}
