import styles from '@components/dashboard/timetable/mod.module.css';
import module, { moduleWithLessons } from '@models/module';
import TrashIcon from '../dashboard/TrashIcon';
import config from '@/config';
import axios from 'axios';
import { Dispatch } from 'react';
const { expressHost } = config;

export default function Mod({
    mod,
    color,
    mods,
    setMods
}: {
    mod: module;
    color: string;
    mods: moduleWithLessons[],
    setMods: Dispatch<moduleWithLessons[]>;
}) {
    const trashHandler = async () => {
        await axios.delete(`${expressHost}/authorized/module`, {
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            params: {
                username: sessionStorage.getItem('username'),
                moduleCode: mod.code
            }
        });
        setMods(mods.filter((previousMod) => previousMod.code !== mod.code))
    };
    return (
        <div className={styles['box']}>
            <div className={`${styles['background']} ${styles[color]}`} />
            <div className={styles['trash']}>
                <TrashIcon clickHandler={trashHandler} />
            </div>
            <div className={styles['code']}>{mod.code}</div>
            <div className={styles['name']}>{mod.name}</div>
        </div>
    );
}
