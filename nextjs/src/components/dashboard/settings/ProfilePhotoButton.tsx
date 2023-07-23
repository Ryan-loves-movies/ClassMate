'use client';
import React from 'react';
import styles from '@components/dashboard/settings/profilePhotoButton.module.css';
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;

export default function ProfilePhotoButton() {
    const updateProfilePhoto = async (photo: Buffer) => {
        await axios
            .put(
                `${expressHost}/authorized/profile/photo`,
                {
                    username: sessionStorage.getItem('username'),
                    photo: photo
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            )
            .then((res: AxiosResponse) => {
                alert('Photo updated!');
            })
            .catch((err) =>
                alert(`Error occurred when updating photo! ${err}`)
            );
    };
    const clickHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || new Blob();

        const reader = new FileReader();
        const readerPromise = new Promise<ArrayBuffer>((resolve, reject) => {
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Error occurred while reading file'));
            };
        });
        reader.readAsArrayBuffer(file);

        await updateProfilePhoto(Buffer.from(await readerPromise));
    };
    return (
        <div className={styles['upload']}>
            <label className={styles['descriptor']} htmlFor="upload-photo">
                <span>Upload Photo</span>
                <div className={styles['icon']}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-upload"
                        viewBox="0 0 16 16"
                    >
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                    </svg>
                </div>
            </label>
            <input
                className={styles['input']}
                id="upload-photo"
                type="file"
                accept="image/*"
                onChange={clickHandler}
            />
        </div>
    );
}
