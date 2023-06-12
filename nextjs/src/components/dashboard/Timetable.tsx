'use client'
import axios, { AxiosError, AxiosResponse } from "axios";
import config from '@/config';
import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "@components/dashboard/timetable.module.css";

export default function timetable() {
    interface modType {
        code: string,
        lectureCode: string,
        lectureStartTime: string,
        lectureEndTime: string,
        tutorialCode: string,
        tutorialStartTime: string,
        tutorialEndTime: string,
        labCode: string,
        labStartTime: string,
        labEndTime: string
    }

    // Components for the module tabs
    const toMin = (hours: number, minutes: number, string = ''): number => {
        // change time format (10,45) to minutes (645)
        if (string.length > 0) {
            // "0710"
            const h = parseInt(string.slice(0, 2));
            const m = parseInt(string.slice(2, 4));

            return toMin(h, m);
        }

        return hours * 60 + minutes;
    }

    const minToWidth = (min: number): number => {
        return (min / 120 * twoHourWidth);
    }

    const start = toMin(8, 0);
    const end = toMin(22, 0);
    const twoHourBox = useRef<HTMLDivElement>(null);
    const [twoHourWidth, setTwoHourWidth] = useState(125);
    const colors = [
        'green',
        'orange',
        'red',
        'yellow',
        'blue',
        'pink',
        'black',
        'purple',
        'teal',
        'brown',
        'gray',
        'cyan'
    ];

    // One Module tab
    const ModActivity = ({ code = 'BT1101', startTime = '0800', endTime = '2200', color = 'blue', lessonType = 'Tutorial[C1]' }) => {
        const width = minToWidth(toMin(0, 0, endTime) - toMin(0, 0, startTime));
        return (
            <div className={`${styles['s-act-tab']} ${styles[`${color}`]}`}
                style={{
                    width: `${width}px`
                }}
            >
                <div className={styles['s-act-name']}>{code}</div>
                <div className={styles['s-act-lesson']}>{lessonType}</div>
            </div>
        );
    };

    const [mods, setMods] = useState<modType[]>();

    // Get list of modules this user is studying
    const getModules = () => {
        axios.get(`${config.expressHost}/profile`, {
            headers: {
                Authorization: window['sessionStorage'].getItem("token")
            },
            params: {
                username: window['sessionStorage'].getItem("username"),
                mods: true
            }
        })
            .then((res: AxiosResponse) => {
                if (res.status === 200) {
                    console.log(res.data);
                    const { username, email, ...tempMods } = res.data;
                    (tempMods as modType[]).filter((mod) => mod.code !== null);
                    setMods(mods);
                }
            })
            .catch((err: AxiosError) => {
                alert("Sorry! A problem occured! Your email could not be found.");
            })
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

    useEffect(() => {
        setTwoHourWidth(twoHourBox?.current?.clientWidth || 125);
        getModules();
    });

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
                        <div className={styles['s-act-row']}>
                            {mods?.map((mod: modType, index: number) => {
                                return (
                                    <>
                                        <ModActivity
                                            code={mod.code}
                                            color={colors[index]}
                                            startTime={mod.lectureStartTime}
                                            endTime={mod.lectureEndTime}
                                            lessonType={mod.lectureCode}
                                        />
                                        <ModActivity
                                            code={mod.code}
                                            color={colors[index]}
                                            startTime={mod.tutorialStartTime}
                                            endTime={mod.tutorialEndTime}
                                            lessonType={mod.tutorialCode}
                                        />
                                        <ModActivity
                                            code={mod.code}
                                            color={colors[index]}
                                            startTime={mod.labStartTime}
                                            endTime={mod.labEndTime}
                                            lessonType={mod.labCode}
                                        />
                                    </>
                                )
                            })}
                            <ModActivity />
                        </div>
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
