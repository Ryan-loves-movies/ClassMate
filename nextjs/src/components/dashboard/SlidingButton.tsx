import styles from '@components/dashboard/slidingButton.module.css';

export default function SlidingButton({
    onClickHandler,
    fromLeft,
    description,
    icon,
    color
}: {
    onClickHandler: () => void;
    fromLeft: boolean;
    description: string;
    icon: () => JSX.Element;
    color: string;
}) {
    return (
        <button className={styles['btn']} onClick={onClickHandler} style={{ background: color }}>
            {fromLeft ? (
                <>
                    <div className={styles['icon']}>{icon()}</div>
                    <div className={styles['button-text-from-left']}>
                        {description}
                    </div>
                </>
            ) : (
                <>
                    <div className={styles['button-text-from-right']}>
                        {description}
                    </div>
                    <div className={styles['icon']}>{icon()}</div>
                </>
            )}
        </button>
    );
}
