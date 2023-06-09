import React from "react";
import styles from "@components/dashboard/searchBar.module.css";

export default function SearchBar({ width }: { width: string }) {
    return (
        <div className={styles['search-wrapper']} style={{ maxWidth: width }}>
            <input className={styles['search-input']} type="text" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className='feather feather-search' viewBox="0 0 24 24">
                <defs />
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <title>Search</title>
            </svg>
        </div>
    );
}
