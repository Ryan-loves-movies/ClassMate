import React, { Dispatch, useState } from "react";
import styles from "@components/dashboard/modSearchBar.module.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import config from '@/config';
const { expressHost } = config;

interface respBody {
    code: string;
    name: string;
}

export default function ModSearchBar({ setAddedActivity, width }: { setAddedActivity: Dispatch<string>, width: string }) {
    // The sequelize model passed should have indexes based on the LIKE query for both `code` and `title` for efficiency
    const [searchRes, setSearchRes] = useState<respBody[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp' && focusedIndex > 0) {
            event.preventDefault();
            setFocusedIndex(prevInd => prevInd - 1);
        } else if (event.key === 'ArrowDown' && focusedIndex < searchRes.length - 1) {
            event.preventDefault();
            setFocusedIndex(prevInd => prevInd + 1);
        } else if (event.key === 'Enter' && focusedIndex >= 0 && focusedIndex < searchRes.length) {
            event.preventDefault();
            const selectedOption = searchRes[focusedIndex];
            setAddedActivity(selectedOption.code);
        }
    }

    const handleMouseEnter = (index: number) => setFocusedIndex(index);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;

        if (query === "") {
            setSearchRes([]);
        } else {
            await axios.get(`${expressHost}/authorized/search/modules`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    query: query,
                    limit: 0
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
    const searchLi = (
        <ul>
            {searchRes.map((item, index: number) => (
                <li key={item.code}
                    className={(index === focusedIndex) ? styles['selected'] : ''}
                    onMouseEnter={() => handleMouseEnter(index)}>
                    <span className={styles['module-code']}>{item.code}</span>
                    <span className={styles['module-title']}>{item.name}</span>
                </li>
            ))}
        </ul>
    );

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
            <div className={styles['search-results']}>
                {searchLi}
            </div>
        </div>
    );
}
