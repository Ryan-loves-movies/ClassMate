'use client'
import React, { useLayoutEffect, useState } from "react";
// import axios, { AxiosError, AxiosResponse } from "axios";
import styles from '@components/dashboard/layout/profileMenu.module.css';
import SignOut from '@components/dashboard/layout/SignOut';
import Link from "next/link";
// import config from '@/config';

export default function ProfileMenuButton() {
    const [username, setUsername] = useState<string | null>();
    useLayoutEffect(() => {
        setUsername(window['sessionStorage'].getItem("username"));
    }, []);
    // let [email, setEmail] = useState("");
    // axios.get(`${config.expressHost}/profile`, {
    //     headers: {
    //         Authorization: window['sessionStorage'].getItem("token")
    //     },
    //     params: {
    //         username: username
    //     }
    // })
    //     .then((res: AxiosResponse) => {
    //         if (res.status === 200) {
    //             console.log(res.data);
    //             let { email: tempRes } = res.data;
    //             setEmail(tempRes);
    //         }
    //     })
    //     .catch((err: AxiosError) => {
    //         alert("Sorry! A problem occured! Your email could not be found.");
    //         console.error(err)
    //     });
    const [isDropdownActive, setDropdownActive] = useState(false);
    const toggleDropdown = () => setDropdownActive(!isDropdownActive);

    return (
        <button className={styles["profile-btn"]} onClick={toggleDropdown} type="button">
            <img src="https://assets.codepen.io/3306515/IMG_2025.jpg" alt="Profile"/>
            <span>{username}</span>
            <div className={`${styles['dropdown-wrapper']} ${(isDropdownActive ? styles['active'] : '')}`} id='dropdownWrapper'>
                <div className={styles['dropdown-profile-details']}>
                    <span className={styles['dropdown-profile-details--name']}>{username}</span>
                </div>
                <div className={styles['dropdown-links']}>
                    <Link href='/settings'>Profile</Link>
                    <SignOut />
                </div>
            </div>
        </button>
    );
}
