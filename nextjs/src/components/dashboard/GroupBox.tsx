import React from "react";
import styles from "@components/dashboard/groupBox.module.css";

export default function GroupBox({
    backgroundColor, header, subheader, width
}:
    { backgroundColor: string, header: string, subheader: string, width: string }) {
    return (
        <div className={styles['project-box-wrapper']} style={{ width: width }}>
            <div className={styles['project-box']} style={{ backgroundColor: backgroundColor }}>
                <div className={styles['project-box-header']}>
                    <div className={styles['more-wrapper']}>
                        <button className={styles['project-btn-more']} type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='feather feather-more-vertical'>
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                                <title>More</title>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={styles['project-box-content-header']}>
                    <p className={styles['box-content-header']}>{header}</p>
                    <p className={styles['box-content-subheader']}>{subheader}</p>
                </div>
                <div className={styles['project-box-footer']}>
                    <div className={styles['participants']}>
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="participant" />
                        <img src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60" alt="participant" />
                        <button className={styles['add-participant']} style={{ color: "#ff942e" }} type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className='feather feather-plus'>
                                <path d="M12 5v14M5 12h14" />
                                <title>Add Friend</title>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
