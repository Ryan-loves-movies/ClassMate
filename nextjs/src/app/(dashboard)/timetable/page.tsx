'use client';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;
import styles from '@app/(dashboard)/timetable/timetable.module.css';
import Timetable from '@components/dashboard/timetable/Timetable';
import ModSearchBar from '@components/dashboard/timetable/ModSearchBar';
import Switch from '@components/dashboard/timetable/Switch';
import colors from '@models/colors';

import module, { moduleWithLessonsFixedChosen } from '@models/module';
import SearchResults from '@components/dashboard/timetable/SearchResults';
import Mod from '@components/dashboard/timetable/Mod';
import lesson, { lessonFixedChosen } from '@models/lesson';
import SlidingButton from '@components/dashboard/SlidingButton';
import { userWithoutEmailPhoto } from '@models/user';

interface fullModule extends module {
    lessons: lesson[];
}
interface fullUser extends userWithoutEmailPhoto {
    modules: fullModule[];
}

const optimizeHandler = async (username: string) => {
    const userWithAllPossibleLessons = await axios
        .get(`${expressHost}/authorized/all/lessons`, {
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            params: {
                username: username,
                ay: sessionStorage.getItem('ay'),
                semester: sessionStorage.getItem('sem')
            }
        })
        .then((res: AxiosResponse) => res.data as fullUser);

    await toast.promise(
        axios.put(
            `${expressHost}/authorized/group/optimize`,
            {
                users: [userWithAllPossibleLessons],
                commonModule: userWithAllPossibleLessons.modules[0]
            },
            {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                }
            }
        ),
        {
            loading: 'Optimising Timetables...', // Message displayed while the promise is pending
            success: () => 'Timetable updated and optimised!', // Message displayed when the promise resolves
            error: (err) => {
                if (err.status === 500) {
                    return err.message;
                }
                console.log(err.response.data);
                return `Failed to find optimal timetables! \n${err.response.data.error}`; // Message displayed when the promise rejects
            }
        }
    );
};

export default function TimetableMain() {
    const [mods, setMods] = useState<moduleWithLessonsFixedChosen[]>([]);
    const [addedMod, setAddedMod] = useState<string>();
    const [searchRes, setSearchRes] = useState<module[]>([]);
    const [overflowY, setOverflowY] = useState<boolean>(true);
    const [selectedLesson, setSelectedLesson] = useState<
        lessonFixedChosen | undefined
    >();
    const [fixedStateUpdated, setFixedStateUpdated] = useState<boolean>();

    useEffect(() => {
        const updateAddedMod = async (addedMod: string | undefined) => {
            // Don't update to default timing if module already exists on timetable
            if (
                addedMod === undefined ||
                addedMod === '' ||
                mods.find((indivMod) => indivMod.code === addedMod) !==
                    undefined
            ) {
                return;
            }
            return await axios
                .put(
                    `${expressHost}/authorized/module`,
                    {
                        username: sessionStorage.getItem('username'),
                        moduleCode: addedMod,
                        lessons: [],
                        ay: sessionStorage.getItem('ay'),
                        semester: sessionStorage.getItem('sem')
                    },
                    {
                        headers: {
                            Authorization: sessionStorage.getItem('token')
                        }
                    }
                )
                .then(() => console.log('2'))
                .catch((err) => {
                    toast.error(
                        `Oops! Something went wrong when adding that mod! Error: ${err}`
                    );
                });
        };

        // Get list of modules this user is studying from personal database
        const getModules = async () => {
            console.log('1');
            return await axios
                .get(`${expressHost}/authorized/lessons`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    params: {
                        username: sessionStorage.getItem('username'),
                        ay: sessionStorage.getItem('ay'),
                        semester: sessionStorage.getItem('sem')
                    }
                })
                .then((res: AxiosResponse) => {
                    if (res.status === 200) {
                        const tempMods: moduleWithLessonsFixedChosen[] =
                            res.data.modules;
                        setMods(tempMods);
                    }
                })
                .catch(() => {
                    toast.error(
                        'Sorry! A problem occured! Your mods could not be found in the database.'
                    );
                });
        };

        const updateAndGet = async () => {
            await updateAddedMod(addedMod);
            await getModules();
        };

        updateAndGet();
        if (addedMod !== '') {
            setAddedMod('');
        }
    }, [addedMod, fixedStateUpdated]);

    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowUp' && focusedIndex > 0) {
            event.preventDefault();
            setFocusedIndex(focusedIndex - 1);
        } else if (
            event.key === 'ArrowDown' &&
            focusedIndex < searchRes.length - 1
        ) {
            event.preventDefault();
            setFocusedIndex(focusedIndex + 1);
        } else if (
            event.key === 'Enter' &&
            focusedIndex >= 0 &&
            focusedIndex < searchRes.length
        ) {
            event.preventDefault();
            setAddedMod(searchRes[focusedIndex].code);
        }
    };

    const handleMouseEnter = (index: number) => setFocusedIndex(index);

    // To ensure that input is focused on when module is clicked on
    const modSearchBarRef = useRef<HTMLInputElement>(null);
    const handleMouseDown = (event: React.MouseEvent<HTMLLIElement>) => {
        event.preventDefault();
        {
            modSearchBarRef.current && modSearchBarRef.current?.focus();
        }
        setAddedMod(searchRes[focusedIndex].code);
    };

    const switchOn = async () => {
        await axios
            .post(
                `${expressHost}/authorized/fixed/lesson`,
                {
                    username: sessionStorage.getItem('username'),
                    moduleCode: selectedLesson?.moduleCode,
                    lessonId: selectedLesson?.id
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            )
            .then(() => {
                setFixedStateUpdated(!fixedStateUpdated);
                // Update selectedLesson that won't be updated by getModules()
                setSelectedLesson({
                    id: selectedLesson?.id as number,
                    lessonId: selectedLesson?.lessonId as string,
                    moduleCode: selectedLesson?.moduleCode as string,
                    lessonType: selectedLesson?.lessonType as string,
                    startTime: selectedLesson?.startTime as string,
                    endTime: selectedLesson?.endTime as string,
                    sem: selectedLesson?.sem as number,
                    weeks: selectedLesson?.weeks as number[],
                    size: selectedLesson?.size as number,
                    venue: selectedLesson?.venue as string,
                    day: selectedLesson?.day as string,
                    chosen: selectedLesson?.chosen as boolean,
                    fixed: selectedLesson?.fixed as boolean,
                    constraintFixed: true
                });
            })
            .catch((err) => toast.error(`Failed to update lesson! ${err}`));
    };

    const switchOff = async () => {
        await axios
            .delete(`${expressHost}/authorized/fixed/lesson`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    username: sessionStorage.getItem('username'),
                    moduleCode: selectedLesson?.moduleCode,
                    lessonId: selectedLesson?.id
                }
            })
            .then(() => {
                setFixedStateUpdated(!fixedStateUpdated);
                setSelectedLesson(undefined);
            })
            .catch((err) => toast.error(`Failed to update lesson! ${err}`));
    };

    return (
        <div
            className={styles['projects-section']}
            onKeyDown={handleKeyDown}
            style={{
                overflowY: `${true ? 'scroll' : 'hidden'}`
            }}
        >
            <div className={styles['optimise']}>
                <SlidingButton
                    icon={() => {
                        return (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="#fff"
                                className="bi bi-gear"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                            </svg>
                        );
                    }}
                    onClickHandler={() =>
                        optimizeHandler(
                            sessionStorage.getItem('username') as string
                        )
                    }
                    fromLeft={false}
                    description="Optimise"
                    color="#9595fc"
                    width="120px"
                    height="36px"
                    margin="36px"
                />
            </div>

            <Timetable
                activities={mods}
                setMods={setMods}
                setOverflowY={setOverflowY}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
            />
            <div className={styles['buttons']}>
                {selectedLesson === undefined ? (
                    <></>
                ) : (
                    <Switch
                        switchOn={switchOn}
                        switchOff={switchOff}
                        initState={selectedLesson.constraintFixed}
                    />
                )}
            </div>
            <div
                className={styles['module-field']}
                onBlur={() => setSearchRes([])}
            >
                <ModSearchBar
                    setFocusedIndex={setFocusedIndex}
                    setSearchRes={setSearchRes}
                    handleKeyDown={handleKeyDown}
                    width="100%"
                    ref={modSearchBarRef}
                />
                <div className={styles['search-results']}>
                    {searchRes.length === 0 ? (
                        <></>
                    ) : (
                        <SearchResults
                            searchRes={searchRes || []}
                            handleMouseEnter={handleMouseEnter}
                            handleMouseDown={handleMouseDown}
                            focusedIndex={focusedIndex}
                        />
                    )}
                </div>
                <div className={styles['user-modules']}>
                    {mods
                        .filter((mod) => mod.lessons.length > 0)
                        .map((mod, index: number) => (
                            <Mod
                                mod={mod}
                                mods={mods}
                                setMods={setMods}
                                color={colors[index % 12]}
                                key={mod.code}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
