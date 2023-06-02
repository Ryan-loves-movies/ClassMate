'use client'
import React, { useState } from "react";
// import axios, { AxiosError, AxiosResponse } from "axios";
import '@components/dashboard/profileMenu.css';
import SignOut from '@components/dashboard/SignOut';
// import config from '@/config';

export default function ProfileMenuButton() {
    let username = window['sessionStorage'].getItem("username");
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
    let [isDropdownActive, setDropdownActive] = useState(false);
    const toggleDropdown = () => setDropdownActive(!isDropdownActive);

    return (
        <button className="profile-btn" onClick={toggleDropdown}>
            <img src="https://assets.codepen.io/3306515/IMG_2025.jpg" />
            <span>{username}</span>
            <div className={'dropdown-wrapper' + (isDropdownActive ? ' active' : '')} id='dropdownWrapper'>
                <div className='dropdown-profile-details'>
                    <span className='dropdown-profile-details--name'>{username}</span>
                </div>
                <div className='dropdown-links'>
                    <a href='#'>Profile</a>
                    <SignOut />
                </div>
            </div>
        </button>
    );
}
