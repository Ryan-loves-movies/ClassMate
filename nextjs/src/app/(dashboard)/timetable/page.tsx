'use client';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';
import styles from '@app/(dashboard)/timetable/timetable.module.css';
import Timetable from '@components/dashboard/timetable/Timetable';
import ModSearchBar from '@components/dashboard/timetable/ModSearchBar';

interface attributes {
    mpes1: boolean;
    mpes2: boolean;
}

interface lesson {
    classNo: string; // "16G"
    startTime: string; // "1600"
    endTime: string; // "1800"
    weeks: number[]; // [1, 2, 3, ..., 13]
    venue: string; //"COM1-B103"
    day: string; // "Friday"
    lessonType: string; // "Laboratory"
    size: number; // 10
    covidZone: string; // "B"
}

interface modInfo {
    acadYear: string; // "2021/2022"
    preclusion: string; // "CS2030S"
    description: string; // "This module is a follow up to CS1010. It explores two modern programming paradigms,
    title: string; // "Programming Methodology II"
    department: string; //"Computer Science"
    faculty: string; // "Computing"
    workload: number[]; // [2, 1, 2, 3, 2]
    prerequisite: string; // "CS1010 or its equivalent"
    moduleCredit: string; // "4"
    moduleCode: string; // "CS2030"
    attributes: attributes;
    semesterData: {
        semester: number; // 1
        timetable: lesson[];
    }[];
    prereqTree: string; // "CS1010"
    fulfillRequirements: string[]; // ["CS2102", ...]
}

// JSON structure returned from personal database
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

export default function TimetableMain() {
    const [isSem1, setIsSem1] = useState<boolean>(true);
    const [mods, setMods] = useState<modType[]>([]);
    const [addedMod, setAddedMod] = useState<string>('');

    useEffect(() => {
        // Return new default module timings from NUSMods API
        const updateAddedMod = async (): Promise<modType | undefined> => {
            if (addedMod === '') {
                return undefined;
            }
            // Don't update to default timing if module already exists on timetable
            if (
                mods.find((indivMod) => indivMod.code === addedMod) !==
                undefined
            ) {
                return undefined;
            }
            return await axios
                .get(
                    `https://api.nusmods.com/v2/2021-2022/modules/${addedMod}.json`,
                    {
                        headers: {
                            Accept: 'application/json'
                        }
                    }
                )
                .then((res: AxiosResponse) => {
                    const modTimetable = (
                        isSem1
                            ? (res.data as modInfo).semesterData.filter(
                                (lesson) => lesson.semester === 1
                            )
                            : (res.data as modInfo).semesterData.filter(
                                (lesson) => lesson.semester === 2
                            )
                    )[0].timetable;
                    const lab = modTimetable.filter(
                        (lesson) => lesson.lessonType === 'Laboratory'
                    )[0];
                    const lecture = modTimetable.filter(
                        (lesson) => lesson.lessonType === 'Lecture'
                    )[0];
                    const tutorial = modTimetable.filter(
                        (lesson) =>
                            lesson.lessonType !== 'Lecture' &&
                            lesson.lessonType !== 'Laboratory'
                    )[0];
                    const newMod: modType = {
                        code: addedMod,
                        lecture: {
                            code: lecture?.classNo,
                            day: lecture?.day,
                            startTime: lecture?.startTime,
                            endTime: lecture?.endTime
                        },
                        lab: {
                            code: lab?.classNo,
                            day: lab?.day,
                            startTime: lab?.startTime,
                            endTime: lab?.endTime
                        },
                        tutorial: {
                            code: tutorial?.classNo,
                            day: tutorial?.day,
                            startTime: tutorial?.startTime,
                            endTime: tutorial?.endTime
                        }
                    };
                    // NOT SURE WHY WE NEED TO USE THE filter() function FOR NOW? Since there are already checks above?
                    // But without it, the setMods() doesn't update properly.
                    const tempMods = mods.filter(
                        (mod) => mod.code !== newMod?.code
                    );
                    tempMods.push(newMod);
                    setMods(tempMods);
                    return newMod;
                });
        };

        // Get list of modules this user is studying from personal database
        const getModules = async () => {
            return await axios
                .get(`${config.expressHost}/authorized/profile`, {
                    headers: {
                        Authorization: window['sessionStorage'].getItem('token')
                    },
                    params: {
                        username: window['sessionStorage'].getItem('username'),
                        mods: true
                    }
                })
                .then((res: AxiosResponse) => {
                    if (res.status === 200) {
                        console.log(res.data);
                        const tempMods: modType[] = res.data.mods;
                        tempMods.filter((mod) => mod.code !== null);
                        setMods(tempMods);
                    }
                })
                .catch((err: AxiosError) => {
                    alert(
                        'Sorry! A problem occured! Your mods could not be found.'
                    );
                    console.log(err);
                });
        };

        // Update module on database
        const pushToDB = (updatedMod: modType | undefined) => {
            if (updatedMod === undefined) {
                return;
            }
            axios
                .put(
                    `${config.expressHost}/authorized/profile`,
                    {
                        username: window['sessionStorage'].getItem('username'),
                        ...updatedMod
                    },
                    {
                        headers: {
                            Authorization:
                                window['sessionStorage'].getItem('token')
                        }
                    }
                )
                .then((res: AxiosResponse) => {
                    console.log(res.data);
                })
                .catch((err: AxiosError) =>
                    console.log('Error when pushing mod to DB', err)
                );
            return;
        };
        updateAddedMod();
        /* getModules()
            .then(() => updateAddedMod())
            .then((updatedMod) => pushToDB(updatedMod)); */
    }, [isSem1, addedMod]);

    return (
        <div className={styles['projects-section']}>
            <Timetable activities={mods} />
            <div className={styles['module-field']}>
                <ModSearchBar setAddedActivity={setAddedMod} width="100%" />
            </div>
        </div>
    );
}
