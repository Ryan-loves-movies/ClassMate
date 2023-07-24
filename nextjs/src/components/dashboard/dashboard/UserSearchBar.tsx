import React, { Dispatch, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import styles from '@components/dashboard/dashboard/userSearchBar.module.css';
import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;

import { userWithoutEmail } from '@models/user';

/**
 * @params {
 * handleKeyDown: Handler for shifting index in list while in search bar as well as pressing enter,
 * setSearchRes: setter made by useState() hook to set search results,
 * width: width of the search bar
 * }
 * */
export default function UserSearchBar({
    focused,
    handleKeyDown,
    setSearchRes,
    width
}: {
    focused: boolean;
    handleKeyDown: (elem: React.KeyboardEvent<HTMLInputElement>) => void;
    setSearchRes: Dispatch<userWithoutEmail[]>;
    width: string;
}) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;

        if (query === '') {
            setSearchRes([]);
        } else {
            await axios
                .get(`${expressHost}/authorized/users`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    params: {
                        query: query,
                        limit: 0
                    }
                })
                .then((res: AxiosResponse) => setSearchRes(res.data.users))
                .catch((err: AxiosError) =>
                    toast.error(`Error encountered when finding users: ${err}`)
                );
        }
    };

    useEffect(() => {
        if (focused) {
            searchInputRef?.current?.focus();
        } else {
            searchInputRef?.current?.blur();
        }
    }, [focused]);

    return (
        <div className={styles['search-field']} style={{ maxWidth: width }}>
            <div className={styles['search-wrapper']}>
                <input
                    className={styles['search-input']}
                    type="text"
                    placeholder="Add friends"
                    ref={searchInputRef}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="feather feather-search"
                    viewBox="0 0 24 24"
                >
                    <defs />
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <title>Search users</title>
                </svg>
            </div>
        </div>
    );
}
