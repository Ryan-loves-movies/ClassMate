'use client'
import React, { useLayoutEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import styles from '@components/dashboard/layout/profileMenu.module.css';
import SignOut from '@components/dashboard/layout/SignOut';
import Link from "next/link";
import config from '@/config';
const { expressHost } = config;

export default function ProfileMenuButton() {
    const [username, setUsername] = useState<string | null>();
    const [photo, setPhoto] = useState<string>("");
    useLayoutEffect(() => {
        setUsername(window['sessionStorage'].getItem("username"));
        function bufferToBase64(arr: []) {
            return btoa(
                arr.reduce((data: string, byte: number) => data + String.fromCharCode(byte), '')
            );
        }
        axios.get(`${expressHost}/authorized/profile`, {
            headers: {
                Authorization: window['sessionStorage'].getItem("token")
            },
            params: {
                username: window['sessionStorage'].getItem("username")
            }
        })
            .then((res: AxiosResponse) => {
                if (res.status === 200) {
                    setPhoto(`data:image/png;base64,${bufferToBase64(res.data.photo.data)}`)
                }
            })
            .catch((err: AxiosError) => {
                alert("Sorry! A problem occured! Your email could not be found.");
                console.error(err)
            });
        return () => URL.revokeObjectURL(photo);
    }, []);
    const [isDropdownActive, setDropdownActive] = useState(false);
    const toggleDropdown = () => setDropdownActive(!isDropdownActive);

    return (
        <button className={styles["profile-btn"]} onClick={toggleDropdown} type="button">
            <img src={photo} alt="Profile" />
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
