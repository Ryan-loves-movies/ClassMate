import styles from '@components/dashboard/dashboard/trashIcon.module.css';

export default function TrashIcon({
    description,
    clickHandler
}: {
    description: string,
    clickHandler: () => void;
}) {
    return (
        <div className={styles['app-cover']}>
            <button
                className={styles['checkbox']}
                onClick={clickHandler}
            />
            <div className={styles['bin-icon']}>
                <div className={styles['lid']} />
                <div className={styles['box']}>
                    <div className={styles['box-inner']}>
                        <div className={styles['bin-lines']} />
                    </div>
                </div>
            </div>
            <div className={styles['description']}>{description}</div>
        </div>
    );
}
