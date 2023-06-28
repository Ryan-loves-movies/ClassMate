import React, { Dispatch, useState } from "react";
import styles from "@components/dashboard/modSearchBar.module.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import config from '@/config';
const { expressHost } = config;

interface respBody {
    code: string;
    name: string;
}

/**
    * @params {
    * handleKeyDown: Handler for shifting index in list while in search bar as well as pressing enter,
        * setSearchRes: setter made by useState() hook to set search results,
    * width: width of the search bar
    * }
    * */
export default function PeopleSearchBar({ handleKeyDown, setSearchRes, width }:
    {
        handleKeyDown: (elem: React.KeyboardEvent<HTMLInputElement>) => void,
        setSearchRes: Dispatch<string[]>,
        width: string
    }) {
    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;

        if (query === "") {
            setSearchRes([]);
        } else {
            await axios.get(`${expressHost}/authorized/users`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    query: query,
                    limit: 0
                }
            })
                .then((res: AxiosResponse) => {
                    setSearchRes(res.data.users);
                })
                .catch((err: AxiosError) => {
                    console.log('Error:', err);
                });
        }
    };

    return (
        <div className={styles['search-field']} style={{ maxWidth: width }}>
            <div className={styles['search-wrapper']}>
                <input className={styles['search-input']}
                    type="text"
                    placeholder="Add module"
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className='feather feather-search' viewBox="0 0 24 24">
                    <defs />
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <title>Search</title>
                </svg>
            </div>
        </div>
    );
}
