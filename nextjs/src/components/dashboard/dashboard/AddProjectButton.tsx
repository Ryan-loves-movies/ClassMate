import React from "react";
import styles from "@components/dashboard/dashboard/addProjectButton.module.css";

export default function AddProjectButton({ clickHandler }: { clickHandler: () => void }) {
    return (
        <button className={styles['add-btn']} title="Add New Project" type="button" onClick={clickHandler}>
            <svg className="feather feather-plus" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <title>Add New Project</title>
            </svg>
        </button>
    );
}
