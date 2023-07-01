'use client'
import React, { useRef } from "react";
import styles from "@components/dashboard/timetable/timetable.module.css";

interface modDet {
    code: string;
    day: string;
    startTime: string;
    endTime: string;
}
interface modType {
    code: string;
    lecture: modDet;
    tutorial: modDet;
    lab: modDet;
}

export default function Timetable({ activities }: { activities: modType[] }) {
    const twoHourBox = useRef<HTMLDivElement>(null);
    const colors = [
        'green',
        'blue',
        'pink',
        'black',
        'teal',
        'cyan',
        'brown',
        'purple',
        'gray',
        'orange',
        'red',
        'yellow'
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // For each day of the week,
    //     Extract all start and end times to determine max no. of overlaps
    // const maxOverlapsEachDay = days.map((day: string) => {
    //     const dayActivities = activities
    //         .map((mod: modType) => {
    //             const lecture = (mod.lecture.day === day)
    //                 ? {
    //                     startTime: mod.lecture.startTime,
    //                     endTime: mod.lecture.endTime
    //                 }
    //                 : {};
    //             const tutorial = (mod.tutorial.day === day)
    //                 ? {
    //                     startTime: mod.tutorial.startTime,
    //                     endTime: mod.tutorial.endTime
    //                 }
    //                 : {};
    //             const lab = (mod.lab.day === day)
    //                 ? {
    //                     startTime: mod.lab.startTime,
    //                     endTime: mod.lab.endTime
    //                 }
    //                 : {};
    //             return [lecture, tutorial, lab];
    //         })
    //         .reduce((mod1, mod2) => mod1.concat(mod2))
    //         .filter((singleActivity) => singleActivity)
    //         .filter((singleActivity) => singleActivity.startTime);
    //         // dayActivities.sort(())
    // });
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
        return (min / (120 * 7) * 100);
    };

    // One Activitiy Tab
    const Activity = ({ code = 'BT1101', startTime = '0800', endTime = '2200', color = 'blue', lessonType = 'Tutorial[C1]' }) => {
        const start = minToPerc(toMin(0, 0, startTime) - toMin(8, 0));
        const width = minToPerc(toMin(0, 0, endTime) - toMin(0, 0, startTime));
        return (
            <div className={`${styles['s-act-tab']} ${styles[`${color}`]}`}
                style={{
                    left: `${start}%`,
                    width: `${width}%`
                }}
            >
                <div className={styles['s-act-name']}>{code}</div>
                <div className={styles['s-act-lesson']}>{lessonType}</div>
            </div>
        );
    };

    // Activities for the whole week
    const Activities = () => {
        const activitiesWithColors = activities.map((mod: modType, index: number) => {
            return {
                ...mod,
                color: colors[index]
            }
        });
        return (
            <>
                {days.map((day) => {
                    return (
                        <div className={styles['s-act-row']} key="">
                            {activitiesWithColors
                                .filter((mod) => mod.lecture.day === day)
                                .map((mod) => {
                                    return (
                                        <Activity
                                            key=''
                                            code={mod.code}
                                            color={mod.color}
                                            startTime={mod.lecture.startTime}
                                            endTime={mod.lecture.endTime}
                                            lessonType={mod.lecture.code}
                                        />
                                    )
                                })
                            }
                            {activitiesWithColors
                                .filter((mod) => mod.lab.day === day)
                                .map((mod) => {
                                    return (
                                        <Activity
                                            key=""
                                            code={mod.code}
                                            color={mod.color}
                                            startTime={mod.lab.startTime}
                                            endTime={mod.lab.endTime}
                                            lessonType={mod.lab.code}
                                        />
                                    )
                                })
                            }
                            {activitiesWithColors
                                .filter((mod) => mod.tutorial.day === day)
                                .map((mod) => {
                                    return (
                                        <Activity
                                            key=""
                                            code={mod.code}
                                            color={mod.color}
                                            startTime={mod.tutorial.startTime}
                                            endTime={mod.tutorial.endTime}
                                            lessonType={mod.tutorial.code}
                                        />
                                    )
                                })
                            }
                        </div>
                    );
                })}
            </>
        );
    };

    // Component for the background
    const Col = ({ gray = false }) => {
        return (
            <div className={`${styles['s-hour-row']} ${gray ? styles['gray-col'] : ''}`}>
                <div className={`${styles['s-hour-wrapper']}`} ref={twoHourBox} />
                <div className={`${styles['s-hour-wrapper']}`} />
                <div className={`${styles['s-hour-wrapper']}`} />
                <div className={`${styles['s-hour-wrapper']}`} />
                <div className={`${styles['s-hour-wrapper']}`} />
            </div>
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
