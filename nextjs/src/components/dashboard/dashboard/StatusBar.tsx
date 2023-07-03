'use client';
import styles from '@components/dashboard/dashboard/statusBar.module.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Takes in the width in string form and the ratio of the height to the width and returns the height of the object
 * @param width: '20px'
 * @param heightRatio: 0.4 - Height will be 0.4 times of width
 * @returns height of element
 * */
function getHeight(width: string, heightRatio: number) {
    // Extract the numerical value from the width string
    const parsedWidth = parseFloat(width);
    const widthUnit = width.match(/\D+$/); // Extract the unit from the width string

    // Calculate the height based on the parsed width and the ratio
    const height = parsedWidth * heightRatio;

    // Create a string with the height and unit
    const heightWithUnit = `${height}${widthUnit}`;
}

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

    // <div className={styles['description']} style={{ width: width, height: heightWithUnit }}>
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
