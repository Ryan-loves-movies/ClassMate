'use client'
import React, { useState } from "react";
import styles from "@components/dashboard/asyncSearchBar.module.css";
import axios, { AxiosResponse } from "axios";

interface respBody {
    code: string;
    title: string;
}

export default function AsyncSearchBar({ width }: { width: string }) {
    // The sequelize model passed should have indexes based on the LIKE query for both `code` and `title` for efficiency
    const [searchRes, setSearchRes] = useState<Array<respBody>>([]);
    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await axios.get('/search/modules', {
            params: {
                limit: 10,
                query: event.target.value
            }
        })
            .then((res: AxiosResponse) => {
                setSearchRes(res.data);
            })
    };

    const searchLi = (
        <ul>
            {searchRes.map((item) => (
                <li key={item.code}>{item.title}</li>
            ))}
        </ul>
    );

    return (
        <>
            <div className={styles['search-wrapper']} style={{ maxWidth: width }}>
                <input className={styles['search-input']} type="text" placeholder="Search" onChange={handleSearch} />
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
        </>
    );
}
