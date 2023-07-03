import React from 'react';
import styles from '@components/loading.module.css';

export default function Loading() {
    return (
        <div className={styles['box']}>
            <div className={styles['cat']}>
                <div className={styles['cat__body']} />
                <div className={styles['cat__body']} />
                <div className={styles['cat__tail']} />
                <div className={styles['cat__head']} />
            </div>
        </div>
    );
}
