'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;
import styles from '@app/(dashboard)/timetable/timetable.module.css';
import Timetable from '@components/dashboard/timetable/Timetable';
import ModSearchBar from '@components/dashboard/timetable/ModSearchBar';
import colors from '@models/colors';

import module, { moduleWithLessonsFixedChosen } from '@models/module';
import SearchResults from '@components/dashboard/timetable/SearchResults';
import Mod from '@components/dashboard/timetable/Mod';

export default function TimetableMain() {
    const [mods, setMods] = useState<moduleWithLessonsFixedChosen[]>([]);
    const [addedMod, setAddedMod] = useState<string>();
    const [searchRes, setSearchRes] = useState<module[]>([]);
    const [overflowY, setOverflowY] = useState<boolean>(false);

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
                    alert(
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
                .catch((err) => {
                    alert(
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
    }, [addedMod]);

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

    return (
        <div
            className={styles['projects-section']}
            onKeyDown={handleKeyDown}
            style={{
                overflowY: `${overflowY ? 'scroll' : 'hidden'}`
            }}
        >
            <Timetable
                activities={mods}
                setMods={setMods}
                setOverflowY={setOverflowY}
            />
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
