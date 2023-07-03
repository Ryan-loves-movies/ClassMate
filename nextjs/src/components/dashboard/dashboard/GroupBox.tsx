import React, { Dispatch } from 'react';
import styles from '@components/dashboard/dashboard/groupBox.module.css';
import PhotoRenderer from '@components/dashboard/PhotoRenderer';
import TrashIcon from '@components/dashboard/dashboard/TrashIcon';

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

export default function GroupBox({
    waiting,
    backgroundColor,
    id,
    header,
    subheader,
    users,
    width,
    setGroupChosen
}: {
    waiting: boolean;
    backgroundColor: string;
    id: number;
    header: string;
    subheader: string;
    users: user[];
    width: string;
    setGroupChosen: Dispatch<group>;
}) {
    const ProfilePhotos = ({ users }: { users: user[] }) => {
        return (
            <>
                {users.map((user: user) => {
                    return (
                        <PhotoRenderer
                            arrBuffer={user.photo.data}
                            alt={user.username}
                            key={user.username}
                        />
                    );
                })}
            </>
        );
    };

    const newUserHandler = () => {
        setGroupChosen({
            id: id,
            moduleCode: header,
            name: subheader,
            users: users
        });
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
                        <TrashIcon />
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
        </div>
    );
}
