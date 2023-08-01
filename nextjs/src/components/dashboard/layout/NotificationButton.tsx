'use client';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from '@components/dashboard/layout/notificationButton.module.css';
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
import SlidingButton from '@components/dashboard/SlidingButton';
import groupRequest from '@models/groupRequest';
const { expressHost } = config;

export default function NotificationButton() {
    const [isActive, setIsActive] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    const [notificationList, setNotificationList] = useState<groupRequest[]>(
        []
    );

    const toggleNotification = async () => {
        if (isActive) {
            setNotificationList([]);
        } else {
            const notifications = (await axios
                .get(`${expressHost}/authorized/notifications`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    params: {
                        username: sessionStorage.getItem('username')
                    }
                })
                .then((res: AxiosResponse) => {
                    return res.data.requests;
                })
                .catch(() =>
                    toast.error('Error occurred when retrieving notifications!')
                )) as groupRequest[];
            setNotificationList(notifications);
        }
        setIsActive(!isActive);
    };

    const handleMouseEnter = (index: number) => setFocusedIndex(index);

    const removeNotification = (thisRequest: groupRequest) => {
        setNotificationList(
            notificationList.filter((notif) => notif !== thisRequest)
        );
    };

    const acceptRequest = async (thisRequest: groupRequest) => {
        removeNotification(thisRequest);
        await toast.promise(
            axios.put(
                `${expressHost}/authorized/notifications`,
                {
                    ...thisRequest
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            ),
            {
                loading: `Notifying ${thisRequest.requestor} of acceptance...`, // Message displayed while the promise is pending
                success: () =>
                    'Added! Groups will be updated when you refresh the page!', // Message displayed when the promise resolves
                error: 'Something went wrong! Please refresh the page and try again!' // Message displayed when the promise rejects
            }
        );
    };

    const rejectRequest = async (thisRequest: groupRequest) => {
        await axios
            .delete(`${expressHost}/authorized/notifications`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    ...thisRequest
                }
            })
            .then(() => removeNotification(thisRequest))
            .catch(() =>
                toast.error(
                    'Something went wrong! Please refresh the page and try again!'
                )
            );
    };

    return (
        <>
            <button
                className={`${styles['notification']}`}
                title="Notifications"
                type="button"
                onClick={toggleNotification}
                data-testid="notification-button" //added for testing
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isActive ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-bell"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    <title>Notifications</title>
                </svg>
            </button>
            {notificationList.length > 0 ? (
                <ul className={styles['list']} id="mod-search-results">
                    {notificationList.map((item, index: number) => (
                        <li
                            key={item.message}
                            className={
                                index === focusedIndex ? styles['selected'] : ''
                            }
                            onMouseEnter={() => handleMouseEnter(index)}
                        >
                            <span className={styles['message']}>
                                {item.message}
                            </span>
                            <div className={styles['actions']}>
                                <SlidingButton
                                    onClickHandler={() => acceptRequest(item)}
                                    fromLeft={false}
                                    description="Accept"
                                    icon={() => {
                                        return (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-person-plus"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                                                />
                                            </svg>
                                        );
                                    }}
                                    color="rgb(53, 94, 59)"
                                    width="90px"
                                    height="21px"
                                    margin="21px"
                                />
                                <SlidingButton
                                    onClickHandler={() => rejectRequest(item)}
                                    fromLeft={false}
                                    description="Reject"
                                    icon={() => {
                                        return (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-x"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                        );
                                    }}
                                    color="#b20000"
                                    width="90px"
                                    height="21px"
                                    margin="21px"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <></>
            )}
        </>
    );
}
