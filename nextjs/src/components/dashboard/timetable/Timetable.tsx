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

    // One Activitiy Tab
    const Activity = ({
        code = 'BT1101',
        startTime = '0800',
        endTime = '2200',
        color = 'blue',
        lessonType = 'Tutorial[C1]',
        lessonId = '1',
        venue = 'LOL',
        weeks = []
    }: {
        code: string;
        startTime: string;
        endTime: string;
        color: string;
        lessonType: string;
        lessonId: string;
        venue: string;
        weeks: number[];
    }) => {
        const start = minToPerc(toMin(0, 0, startTime) - toMin(8, 0));
        const width = minToPerc(toMin(0, 0, endTime) - toMin(0, 0, startTime));
        return (
            <div
                className={`${styles['s-act-tab']} ${color}`}
                style={{
                    left: `${start}%`,
                    width: `${width}%`
                }}
            >
                <div className={styles['s-act-name']}>{code}</div>
                <div
                    className={styles['s-act-lesson']}
                >{`${lessonType} [${lessonId}]`}</div>
                <div className={styles['s-act-lesson']}>{'LOL'}</div>
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
                                                venue={'LOL'}
                                                weeks={less.weeks}
                                            />
                                        );
                                    });
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
