'use client';
import { usePhotoCache } from '@components/dashboard/photoCache';
import Image from 'next/image';

export default function PhotoRenderer({
    arrBuffer,
    alt
}: {
    arrBuffer: number[];
    alt: string;
}) {
    return <Image src={usePhotoCache(arrBuffer)} width={100} height={100} alt={alt} />;
}
