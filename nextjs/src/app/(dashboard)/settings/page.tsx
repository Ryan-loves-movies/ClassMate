import React from "react";
import styles from "@app/(dashboard)/settings/settings.module.css";
import DevButtons from "@components/dashboard/settings/DevButtons";
import ProfilePhotoButton from "@components/dashboard/settings/ProfilePhotoButton";

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
            <div className={styles['settings-box']}>
                <h3 className={styles['settings-header']}>Update Profile Photo</h3>
                <span className={styles['settings-description']}>
                    <span>Update your profile photo!</span>
                    <ProfilePhotoButton />
                    </span>
            </div>
            <div className={styles['settings-box']}>
                <h3 className={styles['settings-header']}>Developer Options</h3>
                <span className={styles['settings-description']}>
                    <span>
                        Update modules and lessons in database
                    </span>
                    <div className={styles['action']}>
                        <DevButtons />
                    </div>
                </span>
            </div>
        </div>
    );
}
