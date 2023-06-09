import React from "react";
import styles from '@components/peopleBar.module.css';

let starIdCounter = 0;

export default function PeopleBar({ name, bio }: { name: string, bio: string }) {
    const starId = `star-${starIdCounter++}`;
    return (
        <div className={styles['message-box']}>
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="Profile" />
            <div className={styles['message-content']}>
                <div className={styles['message-header']}>
                    <div className={styles['name']}>{name}</div>
                    <div className={styles['star-checkbox']}>
                        <input type="checkbox" id={starId} />
                        <label htmlFor={starId}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='feather feather-star'>
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                <title>Star</title>
                            </svg>
                        </label>
                    </div>
                </div>
                <p className={styles['message-line']}>
                    {bio}
                </p>
            </div>
        </div>
    );
}
