'use client';
import React, { useLayoutEffect } from 'react';
import styles from '@components/dashboard/layout/chooseSemester.module.css';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function ChooseSemester() {
    const availableAy = [2023];

    const [ay, setAyRaw] = useState(2023);
    const [sem, setSemRaw] = useState(1);

    const setAy = (newAy: number) => {
        if (newAy !== ay) {
            sessionStorage.setItem('ay', `${newAy}`);
            setAyRaw(newAy);
        }
    };

    const setSem = (newSem: number) => {
        if (newSem !== sem) {
            sessionStorage.setItem('sem', `${newSem}`);
            setSemRaw(newSem);
        }
    };

    useLayoutEffect(() => {
        setAy(parseInt(sessionStorage.getItem('ay') || '2023'));
        setSem(parseInt(sessionStorage.getItem('sem') || '1'));
    }, []);

    const pathname = usePathname();
    const refresher = () => {
        if (
            pathname.includes('/timetable') ||
            pathname.includes('/dashboard')
        ) {
            // Sadly, router.refresh() doesn't work
            window.location.href = pathname;
        }
    };

    const leftArrowHandler = () => {
        if (sem === 1) {
            setAy(ay - 1);
            setSem(sem + 1);
        } else {
            setSem(sem - 1);
        }
        refresher();
    };

    const rightArrowHandler = () => {
        if (sem === 2) {
            setAy(ay + 1);
            setSem(sem - 1);
        } else {
            setSem(sem + 1);
        }
        refresher();
    };
    return (
        <div className={`${styles['header']}`}>
            {availableAy[0] === ay && sem === 1 ? (
                <div className={styles['act-left-arrow']} />
            ) : (
                <button
                    data-testid="left-arrow-button" //added for testing
                    className={styles['act-left-arrow']}
                    onClick={leftArrowHandler}
                />
            )}
            <div className={`${styles['words-header']}`}>
                <div className={styles['ay']}>{`AY ${ay}/${ay + 1}`}</div>
                <div className={styles['sem']}>{`Semester ${sem}`}</div>
            </div>
            {availableAy[availableAy.length - 1] === ay && sem === 2 ? (
                <div className={styles['act-right-arrow']} />
            ) : (
                <button
                    data-testid="right-arrow-button" //added for testing
                    className={styles['act-right-arrow']}
                    onClick={rightArrowHandler}
                />
            )}
        </div>
    );
}
