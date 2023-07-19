import React, { Dispatch } from 'react';
import styles from '@components/dashboard/timetable/modSearchBar.module.css';
import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;
import module from '@models/module';
import { forwardRef } from 'react';

interface props {
    setFocusedIndex: Dispatch<number>;
    setSearchRes: Dispatch<module[]>;
    handleKeyDown: (event: React.KeyboardEvent) => void;
    width: string;
}

const ModSearchBar = forwardRef<HTMLInputElement, props>(function ModSearchBar(
    { setFocusedIndex, setSearchRes, handleKeyDown, width },
    ref
) {
    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setFocusedIndex(0);
        const query = event.target.value;

        if (query === '') {
            setSearchRes([]);
        } else {
            await axios
                .get(`${expressHost}/authorized/search/modules`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    params: {
                        query: query,
                        limit: 30,
                        ay: sessionStorage.getItem('ay'),
                        semester: sessionStorage.getItem('sem')
                    }
                })
                .then((res: AxiosResponse) => {
                    setSearchRes(res.data.modules);
                })
                .catch((err: AxiosError) => {
                    console.log('Error:', err);
                });
        }
    };

    return (
        <div className={styles['search-field']} style={{ maxWidth: width }}>
            <div className={styles['search-wrapper']}>
                <input
                    className={styles['search-input']}
                    type="text"
                    placeholder="Add module"
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onFocus={handleSearch}
                    ref={ref}
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
                    <title>Search</title>
                </svg>
            </div>
        </div>
    );
});

export default ModSearchBar;
