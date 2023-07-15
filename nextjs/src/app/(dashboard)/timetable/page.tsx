'use client';
import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;
import styles from '@app/(dashboard)/timetable/timetable.module.css';
import Timetable from '@components/dashboard/timetable/Timetable';
import ModSearchBar from '@components/dashboard/timetable/ModSearchBar';
import colors from '@models/colors';

// JSON structure returned from personal database
import module, { moduleWithLessons } from '@models/module';
import SearchResults from '@components/dashboard/timetable/SearchResults';
import Mod from '@components/dashboard/timetable/Mod';

export default function TimetableMain() {
    const [mods, setMods] = useState<moduleWithLessons[]>([]);
    const [addedMod, setAddedMod] = useState<string>();
    const [searchRes, setSearchRes] = useState<module[]>([]);

    useEffect(() => {
        const updateAddedMod = async (addedMod: string | undefined) => {
            // Don't update to default timing if module already exists on timetable
            if (
                addedMod === undefined ||
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
                        const tempMods: moduleWithLessons[] = res.data.modules;
                        setMods(tempMods);
                    }
                })
                .catch((err) => {
                    alert(
                        'Sorry! A problem occured! Your mods could not be found in the database.'
                    );
                    console.log(err);
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

    return (
        <div className={styles['projects-section']} onKeyDown={handleKeyDown}>
            <Timetable activities={mods} />
            <div className={styles['module-field']}>
                <ModSearchBar
                    setSearchRes={setSearchRes}
                    handleKeyDown={handleKeyDown}
                    width="100%"
                />
                <div className={styles['search-results']}>
                    {searchRes.length === 0 ? (
                        <></>
                    ) : (
                        <SearchResults
                            searchRes={searchRes || []}
                            handleMouseEnter={handleMouseEnter}
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
