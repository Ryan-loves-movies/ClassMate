'use client';
import axios from 'axios';
import config from '@/config';
const { expressHost } = config;

export default function ProfilePhotoButton() {
    const updateProfilePhoto = async (photo: Buffer) => {
        await axios
            .put(
                `${expressHost}/authorized/profile/photo`,
                {
                    username: sessionStorage.getItem('username'),
                    photo: photo,
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token'),
                    },
                }
            )
            .then(() => alert('Photo updated!'))
            .catch((err) =>
                alert(`Error occurred when updating photo! ${err}`)
            );
    };
    const clickHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || new Blob();

        const reader = new FileReader();
        reader.onload = async () => {
            await updateProfilePhoto(Buffer.from(reader.result as ArrayBuffer));
        };
        reader.readAsArrayBuffer(file);
    };
    return (
        <button type="button">
            <input type="file" accept="image/*" onChange={clickHandler} />
        </button>
    );
}
