'use client';
import React from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import config from '@/config';
const { expressHost } = config;

export default function DevButtons() {
    const availableYears = [2023];
    const updateModules = async (ay: number) => {
        await toast.promise(
            axios
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
                .catch(() => console.log('throw')),
            {
                loading: 'Updating modules...', // Message displayed while the promise is pending
                success: () => 'Modules updated!', // Message displayed when the promise resolves
                error: (err: Error) =>
                    `Error occurred when updating modules! ${err}` // Message displayed when the promise rejects
            }
        );
    };
    const updateLessons = async (ay: number) => {
        await toast.promise(
            axios
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
                .catch(() => console.log('throw')),
            {
                loading: 'Updating lessons...', // Message displayed while the promise is pending
                success: () => 'Lessons updated!', // Message displayed when the promise resolves
                error: (err: Error) =>
                    `Error occurred when updating lessons! ${err}` // Message displayed when the promise rejects
            }
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
