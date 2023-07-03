'use client';
import axios from 'axios';
import config from '@/config';
const { expressHost } = config;

export default function DevButtons() {
    const updateModules = async () => {
        await axios
            .post(
                `${expressHost}/authorized/allModules`,
                {
                    ay: '2023-2024'
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
    const updateLessons = async () => {
        await axios
            .post(
                `${expressHost}/authorized/allLessons`,
                {
                    ay: '2023-2024'
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
        await updateModules();
        await updateLessons();
    };
    return (
        <button onClick={clickHandler} type="button">
            Update Modules and Lessons in Database
        </button>
    );
}
