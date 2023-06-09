import React from "react";
import styles from "@app/(dashboard)/settings/settings.module.css";

export default function timetable() {
    return (
        <div className={styles['projects-section']}>
            <div className={styles['projects-section-header']}>
                <p>Settings</p>
            </div>
            <div className={styles['settings-box']}>
                <h3 className={styles['settings-header']}>Reset Password</h3>
                <span className={styles['settings-description']}>Reset your password</span>
            </div>
        </div>
    );
}
