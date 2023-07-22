import React, { Dispatch, useEffect, useState } from 'react';
import styles from '@components/peopleBar.module.css';
import StatusBar from '@components/dashboard/dashboard/StatusBar';
import PhotoRenderer from '@components/dashboard/PhotoRenderer';
import config from '@/config';
import axios, { AxiosResponse } from 'axios';
const { expressHost } = config;

import group from '@models/group';
import { userWithoutEmail } from '@models/user';

let starIdCounter = 0;

export default function PeopleBar({
    user,
    bio,
    setUserChosen
}: {
    user: userWithoutEmail;
    bio: string;
    setUserChosen: Dispatch<userWithoutEmail>;
}) {
    const starId = `star-${starIdCounter++}`;
    const [groups, setGroups] = useState<group[]>([]);

    const Groups = () => {
        return (
            <>
                {groups.map((group) => {
                    return (
                        <StatusBar
                            color={group.color}
                            height="20px"
                            descriptor={group.name}
                            key={group.id}
                        />
                    );
                })}
            </>
        );
    };

    const addGroupButton = () => {
        setUserChosen(user);
    };

    useEffect(() => {
        const getGroups = async (username: string) => {
            return await axios
                .get(`${expressHost}/authorized/group/user`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    params: {
                        username: username,
                        ay: sessionStorage.getItem('ay'),
                        semester: sessionStorage.getItem('sem')
                    }
                })
                .then((res: AxiosResponse) => {
                    if (res.status !== 200) {
                        alert(
                            'Problem occurred when retrieving groups of user!'
                        );
                        return [];
                    }
                    return res.data.groups;
                });
        };
        getGroups(user.username)
            .then((groups) => setGroups(groups))
            .catch(() =>
                alert('Problem occurred when retrieving groups of user!')
            );
    }, [user.username]);
    return (
        <div className={styles['message-box']}>
            <PhotoRenderer arrBuffer={user.photo.data} alt="Profile" />
            <div className={styles['message-content']}>
                <div className={styles['message-header']}>
                    <div className={styles['name']}>{user.username}</div>
                    <div className={styles['star-checkbox']}>
                        <input type="checkbox" id={starId} />
                        <label htmlFor={starId}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-star"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                <title>Star</title>
                            </svg>
                        </label>
                    </div>
                </div>
                <p className={styles['message-line']}>{bio}</p>
                <div className={styles['status']}>
                    <Groups />
                    <button
                        className={styles['add-btn']}
                        style={{ color: '#ff942e' }}
                        type="button"
                        onClick={addGroupButton}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-plus"
                        >
                            <path d="M12 5v14M5 12h14" />
                            <title>Add Friend for Group</title>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
