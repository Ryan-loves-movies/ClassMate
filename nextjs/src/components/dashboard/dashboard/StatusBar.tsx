'use client';
import styles from '@components/dashboard/dashboard/statusBar.module.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/*
 * Returns a status bar to show descriptor and see-through background - Width is dynamically rendered based on string with minimum width of 20px
 * @param color: '#404040' - background-color
 * @param height: '20px' - Height of element
 * @param descriptor: 'test' - Descriptor to be encapsulated
 * @returns StatuBar component
 * */
export default function StatusBar({
    color,
    height,
    descriptor
}: {
    color: string;
    height: string;
    descriptor: string;
}) {
    const [width, setWidth] = useState(42);
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        setWidth(Math.max((ref.current?.offsetWidth as number) + 25, width));
    }, [ref, width]);

    return (
        <div className={styles['wrapper']}>
            <div
                className={styles['background']}
                style={{
                    backgroundColor: color,
                    width: `${width}px`,
                    height: height
                }}
            />
            <div
                className={styles['description']}
                ref={ref}
                style={{ height: height }}
            >
                {descriptor}
            </div>
        </div>
    );
}
