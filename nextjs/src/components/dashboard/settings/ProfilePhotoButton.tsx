'use client';
import React from 'react';
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
        <button type="button">
            <input type="file" accept="image/*" onChange={clickHandler} />
        </button>
    );
}
