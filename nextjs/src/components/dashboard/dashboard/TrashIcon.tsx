import styles from '@components/dashboard/dashboard/trashIcon.module.css';

export default function TrashIcon() {
    return (
        <div className={styles['app-cover']}>
            <input type="checkbox" className={styles['checkbox']} />
            <div className={styles['bin-icon']}>
                <div className={styles['lid']} />
                <div className={styles['box']}>
                    <div className={styles['box-inner']}>
                        <div className={styles['bin-lines']} />
                    </div>
                </div>
            </div>
            <div className={styles['layer']} />
        </div>
    );
}
