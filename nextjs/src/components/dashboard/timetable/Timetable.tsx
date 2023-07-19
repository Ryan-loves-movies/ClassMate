'use client';
import React from 'react';
import styles from '@components/dashboard/timetable/timetable.module.css';
import colors from '@models/colors';

import { moduleWithLessons } from '@models/module';

// Component for the background
const Col = ({ gray = false }: { gray: boolean }) => {
    return (
        <div
            className={`${styles['s-hour-row']} ${
                gray ? styles['gray-col'] : ''
            }`}
        >
            <div className={`${styles['s-hour-wrapper']}`} />
            <div className={`${styles['s-hour-wrapper']}`} />
            <div className={`${styles['s-hour-wrapper']}`} />
            <div className={`${styles['s-hour-wrapper']}`} />
            <div className={`${styles['s-hour-wrapper']}`} />
        </div>
    );
};

export default function Timetable({
    activities
}: {
    activities: moduleWithLessons[];
}) {
    // const twoHourBox = useRef<HTMLDivElement>(null);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Components for the module tabs
    const toMin = (hours: number, minutes: number, time = ''): number => {
        if (time === null || time.length === 0) {
            return hours * 60 + minutes;
        }
        // change time format (10,45) to minutes (645)
        else {
            // "0710"
            const h = parseInt(time.slice(0, 2));
            const m = parseInt(time.slice(2, 4));

            return toMin(h, m);
        }
    };

    const minToPerc = (min: number): number => {
        return (min / (120 * 7)) * 100;
    };

<<<<<<< Updated upstream
=======
    const actClickHandlerChosen = async (
        ay: number,
        semester: number,
        username: string,
        moduleCode: string,
        lessonType: string
    ) => {
        const unChosen = activities
            .flatMap((activity) => activity.lessons)
            .filter((less) => !less.chosen);
        const activitiesRemoved = activities.map((activity) => {
            return {
                code: activity.code,
                name: activity.name,
                lessons: activity.lessons.filter((less) => less.chosen)
            };
        });
        if (
            unChosen.find(() => true)?.moduleCode === moduleCode &&
            unChosen.find(() => true)?.lessonType === lessonType
        ) {
            setMods(activitiesRemoved);
            return;
        }
        const possibleLessons = await axios
            .get(`${expressHost}/authorized/module/lessons`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    ay: ay,
                    semester: semester,
                    username: username,
                    moduleCode: moduleCode,
                    lessonType: lessonType
                }
            })
            .then((res: AxiosResponse) => {
                const lesses = res.data.lessons as lessonChosen[];
                return lesses.map((less) => {
                    return {
                        ...less,
                        fixed: false
                    } as lessonFixedChosen;
                });
            });
        setMods(
            activitiesRemoved.map((activity) => {
                if (activity.code === moduleCode) {
                    const currLessWithoutLessonType = activity.lessons.filter(
                        (less) => less.lessonType !== lessonType
                    );
                    currLessWithoutLessonType.push(...possibleLessons);
                    return {
                        code: activity.code,
                        name: activity.name,
                        lessons: currLessWithoutLessonType
                    };
                }
                return activity;
            })
        );
    };

    /** NOTE: ay and sem is implied by the function being limited by the activities variable already
        * */
    const actClickHandlerUnchosen = async (
        lessonId: string,
        lessonType: string,
        moduleCode: string,
        activities: moduleWithLessonsFixedChosen[],
        setMods: Dispatch<moduleWithLessonsFixedChosen[]>
    ) => {
        const lessonIds = activities.flatMap((mod) =>
            mod.lessons
                .filter(
                    (less) =>
                        less.moduleCode === moduleCode &&
                        less.lessonType === lessonType &&
                        less.lessonId === lessonId
                )
                .map((less) => less.id)
        );
        await axios
            .put(
                `${expressHost}/authorized/lessons`,
                {
                    username: sessionStorage.getItem('username'),
                    lessonIds: lessonIds
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            )
            .then(() => {
                setMods(
                    activities.map((mod) => {
                        if (mod.code !== moduleCode) {
                            return mod;
                        }

                        const chosenLessons = mod.lessons
                            .filter(
                                (less) =>
                                    less.lessonType === lessonType &&
                                    less.lessonId === lessonId
                            )
                            .map((less) => {
                                return {
                                    id: less.id,
                                    lessonId: less.lessonId,
                                    moduleCode: less.moduleCode,
                                    lessonType: less.lessonType,
                                    sem: less.sem,
                                    weeks: less.weeks,
                                    venue: less.venue,
                                    day: less.day,
                                    startTime: less.startTime,
                                    endTime: less.endTime,
                                    size: less.size,
                                    fixed: less.fixed,
                                    chosen: true
                                } as lessonFixedChosen;
                            });
                        const lessonsRemoveLessonType = mod.lessons.filter(
                            (less) => less.lessonType !== lessonType
                        );
                        lessonsRemoveLessonType.push(...chosenLessons);
                        return {
                            code: mod.code,
                            name: mod.name,
                            lessons: lessonsRemoveLessonType
                        };
                    })
                );
            });
    };

>>>>>>> Stashed changes
    // One Activitiy Tab
    const Activity = ({
        code = 'BT1101',
        startTime = '0800',
        endTime = '2200',
        color = 'blue',
        lessonType = 'Tutorial[C1]',
        lessonId = '1',
        venue = 'LOL',
<<<<<<< Updated upstream
        weeks = []
=======
        weeks = [],
        fixed,
        chosen,
        haveOthersChosen
>>>>>>> Stashed changes
    }: {
        code: string;
        startTime: string;
        endTime: string;
        color: string;
        lessonType: string;
        lessonId: string;
        venue: string;
        weeks: number[];
<<<<<<< Updated upstream
=======
        fixed: boolean;
        chosen: boolean;
        haveOthersChosen: boolean;
>>>>>>> Stashed changes
    }) => {
        const start = minToPerc(toMin(0, 0, startTime) - toMin(8, 0));
        const width = minToPerc(toMin(0, 0, endTime) - toMin(0, 0, startTime));
        return (
            <div
                className={`${styles['s-act-tab']} ${
                    haveOthersChosen && chosen ? styles['s-act-tab-chosen'] : ''
                }`}
                style={{
                    left: `${start}%`,
                    width: `${width}%`
                }}
            >
<<<<<<< Updated upstream
                <div
                    className={`${color} ${styles['s-act-tab-background']}`}
=======
                {fixed ? (
                    <></>
                ) : (
                    <button
                        className={styles['act-btn']}
                        onClick={() =>
                            chosen
                                ? actClickHandlerChosen(
                                      parseInt(
                                          sessionStorage.getItem('ay') as string
                                      ),
                                      parseInt(
                                          sessionStorage.getItem(
                                              'sem'
                                          ) as string
                                      ),
                                      sessionStorage.getItem(
                                          'username'
                                      ) as string,
                                      code,
                                      lessonType
                                  )
                                : actClickHandlerUnchosen(
                                      lessonId,
                                      lessonType,
                                      code,
                                      activities,
                                      setMods
                                  )
                        }
                    />
                )}
                <div
                    className={`${color} ${styles['s-act-tab-background']}`}
                    style={{
                        borderRadius: `${fixed ? 5 : 16}px`
                    }}
>>>>>>> Stashed changes
                />
                <div className={styles['s-act-name']}>{code}</div>
                <div
                    className={styles['s-act-lesson']}
                >{`${lessonType} [${lessonId}]`}</div>
                <div className={styles['s-act-lesson']}>{venue}</div>
                <div className={styles['s-act-lesson']}>{weeks}</div>
            </div>
        );
    };

    // Activities for the whole week
    const Activities = () => {
        const activitiesWithColors = activities.map(
            (mod: moduleWithLessons, index: number) => {
                return {
                    ...mod,
                    color: colors[index % 12]
                };
            }
        );
        return (
            <>
                {days.map((day) => {
                    return (
<<<<<<< Updated upstream
                        <div className={styles['s-act-row']} key={day}>
                            {activitiesWithColors.map((mod) => {
                                return mod.lessons
                                    .filter((less) => less.day === day)
                                    .map((less) => {
                                        return (
                                            <Activity
                                                key={`${mod.code}_${less.id}_${less.startTime}`}
                                                code={mod.code}
                                                color={mod.color}
                                                startTime={less.startTime}
                                                endTime={less.endTime}
                                                lessonType={less.lessonType}
                                                lessonId={less.lessonId}
                                                venue={less.venue}
                                                weeks={less.weeks}
                                            />
                                        );
                                    });
=======
                        <div
                            className={styles['s-act-row']}
                            style={{
                                height: `${height}%`
                            }}
                            key={`day-${index}`}
                        >
                            {overlapNActivities.lessons.map((less) => {
                                const haveOthersChosen =
                                    !overlapNActivities.lessons
                                        .filter(
                                            (specificLess) =>
                                                less.lessonType ===
                                                    specificLess.lessonType &&
                                                less.moduleCode ===
                                                    specificLess.moduleCode
                                        )
                                        .map(
                                            (specificLess) =>
                                                specificLess.chosen
                                        )
                                        .reduce(
                                            (chosen, specificLess) =>
                                                chosen && specificLess
                                        );
                                return (
                                    <Activity
                                        top={
                                            (100 /
                                                overlapNActivities.overlaps) *
                                            (less.order - 1)
                                        }
                                        height={
                                            100 / overlapNActivities.overlaps
                                        }
                                        key={`${less.id}_${less.startTime}`}
                                        code={less.moduleCode}
                                        color={less.color}
                                        startTime={less.startTime}
                                        endTime={less.endTime}
                                        lessonType={less.lessonType}
                                        lessonId={less.lessonId}
                                        venue={less.venue}
                                        weeks={less.weeks}
                                        fixed={less.fixed}
                                        chosen={less.chosen}
                                        haveOthersChosen={haveOthersChosen}
                                    />
                                );
>>>>>>> Stashed changes
                            })}
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <div className={styles['DM_Sans']}>
            <div className={styles['header']}>
                <div className={styles['s-head-hour']}>0800</div>
                <div className={styles['s-head-hour']}>1000</div>
                <div className={styles['s-head-hour']}>1200</div>
                <div className={styles['s-head-hour']}>1400</div>
                <div className={styles['s-head-hour']}>1600</div>
                <div className={styles['s-head-hour']}>1800</div>
                <div className={styles['s-head-hour']}>2000</div>
                <div className={styles['s-head-hour']}>2200</div>
            </div>
            <div className={styles['schedule']}>
                <div className={styles['s-legend']}>
                    <div className={styles['s-week-day']}>Mon</div>
                    <div className={styles['s-week-day']}>Tue</div>
                    <div className={styles['s-week-day']}>Wed</div>
                    <div className={styles['s-week-day']}>Thu</div>
                    <div className={styles['s-week-day']}>Fri</div>
                </div>
                <div className={styles['s-container']}>
                    <div className={styles['s-activities']}>
                        <Activities />
                    </div>
                    <div className={styles['background-col']}>
                        <Col gray={true} />
                        <Col gray={false} />
                        <Col gray={true} />
                        <Col gray={false} />
                        <Col gray={true} />
                        <Col gray={false} />
                        <Col gray={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
