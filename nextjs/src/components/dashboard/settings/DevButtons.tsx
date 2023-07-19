'use client';
import React from 'react';
import axios from 'axios';
import config from '@/config';
const { expressHost } = config;

export default function DevButtons() {
    const availableYears = [2023];
    const updateModules = async (ay: number) => {
        await axios
            .post(
                `${expressHost}/authorized/allModules`,
                {
                    ay: ay
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            )
            .then(() => alert('Modules Updated!'))
            .catch((err) =>
                alert(`Error occurred when updating modules! ${err}`)
            );
    };
    const updateLessons = async (ay: number) => {
        await axios
            .post(
                `${expressHost}/authorized/allLessons`,
                {
                    ay: ay
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            )
            .then(() => alert('Lessons Updated!'))
            .catch((err) =>
                alert(`Error occurred when updating lessons! ${err}`)
            );
    };
    const clickHandler = async () => {
        await Promise.all(
            availableYears.map(async (ay) => {
                await updateModules(ay);
                await updateLessons(ay);
            })
        );
    };
    return (
        <button onClick={clickHandler} type="button">
            Update Modules and Lessons in Database
        </button>
    );
}
