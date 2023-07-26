import React, { Dispatch } from 'react';
import { toast } from 'react-hot-toast';
import styles from '@components/dashboard/dashboard/groupBox.module.css';
import TrashIcon from '@components/dashboard/dashboard/TrashIcon';
import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;

import { groupWithUsersNoEmail } from '@models/group';
import { userWithoutEmail, userWithoutEmailPhoto } from '@models/user';
import PhotoRenderer from '@components/dashboard/PhotoRenderer';
import SlidingButton from '@components/dashboard/SlidingButton';
import lesson from '@models/lesson';
import module, { moduleWithoutName } from '@models/module';

interface fullModule extends module {
    lessons: lesson[];
}

interface fullUser extends userWithoutEmailPhoto {
    modules: fullModule[];
}

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
                        username: user.username,
                        ay: sessionStorage.getItem('ay'),
                        semester: sessionStorage.getItem('sem')
                    }
                })
                .then((res: AxiosResponse) => res.data as fullUser);
        })
    );

    await toast.promise(
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
        ),
        {
            loading: 'Optimising Timetables...', // Message displayed while the promise is pending
            success: () => 'Timetables updated and optimised!', // Message displayed when the promise resolves
            error: 'Failed to find optimal timetables!' // Message displayed when the promise rejects
        }
    );
    // timetableGenerator(userWithAllLessons, commonModule);
};

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

    const deleteGroupHandler = async () => {
        console.log(id);
        await axios
            .delete(`${expressHost}/authorized/group/user`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    username: sessionStorage.getItem('username'),
                    groupId: id
                }
            })
            .catch((err: AxiosError) => {
                if (err.status === 404) {
                    toast.error('Group not found!');
                }
                toast.error('Failed to leave group. Please try again!');
            });
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
                                optimizeHandler(users, {
                                    code: header
                                } as moduleWithoutName)
                            }
                            fromLeft={false}
                            description="Optimise"
                            color="#9595fc"
                            width="120px"
                            height="36px"
                            margin="36px"
                        />
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
