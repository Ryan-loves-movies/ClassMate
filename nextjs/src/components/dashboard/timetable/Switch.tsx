import React, { useEffect, useState } from 'react';
import styles from '@components/dashboard/timetable/switch.module.css';

export default function Switch({
    initState,
    switchOn,
    switchOff
}: {
    initState: boolean;
    switchOn: () => Promise<void>;
    switchOff: () => Promise<void>;
}) {
    const [on, setOn] = useState<boolean>(initState);
    useEffect(() => {
        console.log('here');
        console.log(initState);
        setOn(initState);
    }, [initState]);
    const clickHandler = async () => {
        on ? await switchOff() : await switchOn();
        setOn(!on);
    };
    return (
        <button
            className={`${styles['wrapper']} ${on ? styles['on'] : ''}`}
            onClick={clickHandler}
        >
            {on ? 'FIXED' : 'FIX TIME SLOT'}
        </button>
    );
}
