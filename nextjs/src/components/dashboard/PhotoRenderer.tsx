'use client';
import { useEffect } from 'react';

export function bufferToBase64(arr: number[]) {
    return btoa(
        arr.reduce(
            (data: string, byte: number) => data + String.fromCharCode(byte),
            ''
        )
    );
}

export default function PhotoRenderer({
    arrBuffer,
    alt
}: {
    arrBuffer: number[];
    alt: string;
}) {
    const photoUrl = `data:image/*;base64,${bufferToBase64(arrBuffer)}`;

    useEffect(() => {
        return () => URL.revokeObjectURL(photoUrl);
    });

    return <img src={photoUrl} alt={alt} />;
}
