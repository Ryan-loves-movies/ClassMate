import React, { Dispatch } from 'react';
import styles from '@components/dashboard/dashboard/groupBox.module.css';
import TrashIcon from '@components/dashboard/dashboard/TrashIcon';
import OptimizeButton from '@components/dashboard/dashboard/OptimizeButton';
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
            {users?.map((user: userWithoutEmail) => (
                <PhotoRenderer
                    arrBuffer={user.photo.data}
                    alt={user.username}
                    key={user.username}
                />
            ))}
        </>
    );
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

    return (
        <div className={styles['project-box-wrapper']} style={{ width: width }}>
            <div
                className={`${styles['project-box']} ${
                    waiting ? styles['waiting'] : ''
                }`}
                style={{ backgroundColor: backgroundColor }}
            >
                <div className={styles['project-box-header']}>
                    <div className={styles['trash']}>
                        <TrashIcon
                            clickHandler={deleteGroupHandler}
                            description="Leave Group"
                        />
                    </div>
                    <div className={styles['project-box-optimize']}>
                        <OptimizeButton users={users} moduleCode={header} />
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
        </div>
    );
}
