import React, { Dispatch } from 'react';
import styles from '@components/dashboard/dashboard/groupBox.module.css';
import TrashIcon from '@components/dashboard/dashboard/TrashIcon';
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;

import { groupWithUsersNoEmail } from '@models/group';
import { userWithoutEmail, userWithoutEmailPhoto } from '@models/user';
import PhotoRenderer from '@components/dashboard/PhotoRenderer';
import module, { moduleWithoutName } from '@models/module';
import lesson from '@models/lesson';

interface fullModule extends module {
    lessons: lesson[];
}

interface fullUser extends userWithoutEmailPhoto {
    modules: fullModule[];
}

const ProfilePhotos = ({ users }: { users: userWithoutEmail[] }) => {
    return (
        <>
            {users.map((user: userWithoutEmail) => (
                <PhotoRenderer
                    arrBuffer={user.photo.data}
                    alt={user.username}
                    key={user.username}
                />
            ))}
        </>
    );
};

const optimizeHandler = async (
    users: userWithoutEmail[],
    commonModule: moduleWithoutName
) => {
    const userWithAllLessons: fullUser[] = await Promise.all(
        users.map(async (user) => {
            return await axios
                .get(`${expressHost}/authorized/all/lessons`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    params: {
                        username: user.username
                    }
                })
                .then((res: AxiosResponse) => res.data as fullUser);
        })
    );
    console.log(userWithAllLessons);

    axios.put(
        `${expressHost}/authorized/group/optimize`,
        {
            users: userWithAllLessons,
            commonModule: commonModule
        },
        {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        }
    );
    // timetableGenerator(userWithAllLessons, commonModule);
};

export default function GroupBox({
    waiting,
    setWaiting,
    backgroundColor,
    id,
    header,
    subheader,
    users,
    width,
    setGroupChosen,
    setGroupsUpdated,
    setUserChosen
}: {
    waiting: boolean;
    setWaiting: Dispatch<boolean>;
    backgroundColor: string;
    id: number;
    header: string;
    subheader: string;
    users: userWithoutEmail[];
    width: string;
    setGroupChosen: Dispatch<groupWithUsersNoEmail>;
    setGroupsUpdated: Dispatch<boolean>;
    setUserChosen: Dispatch<userWithoutEmail | undefined>;
}) {
    const newUserHandler = () => {
        setGroupChosen({
            id: id,
            moduleCode: header,
            name: subheader,
            color: backgroundColor,
            users: users
        });
        setWaiting(false);
        setUserChosen(undefined);
    };

    const deleteGroupHandler = () => {
        axios
            .delete(`${expressHost}/authorized/group/user`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    username: sessionStorage.getItem('username'),
                    groupId: id
                }
            })
            .catch(() => alert('failed to delete group!'));
        setGroupsUpdated(true);
    };

    const SolveButton = () => {
        return (
            <button
                onClick={() =>
                    optimizeHandler(users, {
                        code: header
                    } as moduleWithoutName)
                }
            >
                LOL
            </button>
        );
    };

    return (
        <div className={styles['project-box-wrapper']} style={{ width: width }}>
            <div
                className={`${styles['project-box']} ${waiting ? styles['waiting'] : ''
                    }`}
                style={{ backgroundColor: backgroundColor }}
            >
                <div className={styles['project-box-header']}>
                    <div className={styles['trash']}>
                        <TrashIcon clickHandler={deleteGroupHandler} />
                    </div>
                    <div className={styles['more-wrapper']}>
                        <button
                            className={styles['project-btn-more']}
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-more-vertical"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                                <title>More</title>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={styles['project-box-content-header']}>
                    <p className={styles['box-content-header']}>{header}</p>
                    <p className={styles['box-content-subheader']}>
                        {subheader}
                    </p>
                </div>
                <div className={styles['project-box-footer']}>
                    <div className={styles['participants']}>
                        <ProfilePhotos users={users} />
                        <button
                            className={styles['add-participant']}
                            style={{ color: '#ff942e' }}
                            type="button"
                            onClick={newUserHandler}
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
                                <title>Add Friend</title>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <SolveButton />
        </div>
    );
}
