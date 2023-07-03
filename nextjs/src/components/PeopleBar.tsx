import React from 'react';
import styles from '@components/peopleBar.module.css';
import PhotoRenderer from '@components/dashboard/PhotoRenderer';
import AddProjectButton from '@components/dashboard/dashboard/AddProjectButton';
import StatusBar from '@components/dashboard/dashboard/StatusBar';
import config from '@/config';
import axios, { AxiosError } from 'axios';
const { expressHost } = config;

interface group {
    id: number;
    moduleCode: string;
    name: string;
    users: user[];
}

interface user {
    username: string;
    photo: {
        type: string;
        data: Array<number>;
    };
}

let starIdCounter = 0;

export default function PeopleBar({
    user,
    group,
    bio
}: {
    user: user;
    group: group | undefined;
    bio: string;
}) {
    const starId = `star-${starIdCounter++}`;

    // Functionality for adding user to group
    const addUserToGroup = (user: user, group: group) => {
        axios
            .put(
                `${expressHost}/authorized/group/user`,
                {
                    username: user.username,
                    groupId: group.id
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            )
            .catch((err: AxiosError) => {
                alert(`Error encountered when adding user to group: ${err}`);
            });
    };

    const addGroupButton = () => {
        if (group) {
            return <></>;
        }
        return <></>;
    };
    return (
        <div className={styles['message-box']}>
            <PhotoRenderer arrBuffer={user.photo.data} alt="Profile" />
            <div className={styles['message-content']}>
                <div className={styles['message-header']}>
                    <div className={styles['name']}>{user.username}</div>
                    <StatusBar
                        color="#404040"
                        descriptor="ttenjksadn"
                        height="20px"
                    />
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
            </div>
        </div>
    );
}
