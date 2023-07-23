import React, { useState } from 'react';
import styles from '@components/dashboard/slidingButton.module.css';

export default function SlidingButton({
    onClickHandler,
    fromLeft,
    description,
    icon,
    color,
    width,
    height,
    margin
}: {
    onClickHandler: () => void;
    fromLeft: boolean;
    description: string;
    icon: () => JSX.Element;
    color: string;
    width: string;
    height: string;
    margin: string;
}) {
    const [hover, setHover] = useState(false);
    const onMouseEnter = () => setHover(true);
    const onMouseLeave = () => setHover(false);

    return (
        <button
            className={`${styles['btn']} ${hover ? styles['hover'] : ''}`}
            onClick={onClickHandler}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                background: color,
                width: hover ? width : height,
                height: height
            }}
        >
            {fromLeft ? (
                <>
                    <div
                        className={styles['icon']}
                        style={{
                            width: height,
                            height: height
                        }}
                    >
                        {icon()}
                    </div>
                    <div
                        className={styles['button-text-from-left']}
                        style={{ marginLeft: margin }}
                    >
                        {description}
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={styles['button-text-from-right']}
                        style={{ marginRight: margin }}
                    >
                        {description}
                    </div>
                    <div
                        className={styles['icon']}
                        style={{
                            width: height,
                            height: height,
                            right: '10px'
                        }}
                    >
                        {icon()}
                    </div>
                </>
            )}
        </button>
    );
}
