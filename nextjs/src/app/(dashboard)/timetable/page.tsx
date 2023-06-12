import React  from "react";
import styles from "@app/(dashboard)/timetable/timetable.module.css";
import Timetable from "@components/dashboard/Timetable";
import ModSearchBar from "@components/dashboard/ModSearchBar";

export default function timetable() {
    return (
    <div className={styles['projects-section']}>
        <Timetable />
        <div className={styles['module-field']}>
            <ModSearchBar width="100%" />
        </div>
    </div>
);
}
