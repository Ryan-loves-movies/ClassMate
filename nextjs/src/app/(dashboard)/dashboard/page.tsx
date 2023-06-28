'use client'
import "@app/(dashboard)/globals.css";
import styles from "@app/(dashboard)/dashboard/dashboard.module.css";
import GroupBox from "@components/dashboard/GroupBox";
import PeopleSearchBar from "@components/dashboard/PeopleSearchBar";
import PeopleBar from "@components/PeopleBar";
import AddProjectButton from "@components/dashboard/AddProjectButton";
import { useState } from "react";
import GroupForm from "@components/dashboard/GroupForm";

export default function Dashboard() {
    // Determining date for section
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const day = currentDate.getDate();
    const formattedDate = `${month}, ${day}`;

    const [searchRes, setSearchRes] = useState([]);
    const [formVisible, setFormVisible] = useState(false);

    const addGroup = () => {
        setFormVisible(true);
    }

    return (
        <>
            <div className={styles['projects-section']}>
                <div className={styles['projects-section-header']}>
                    <p>Groups</p>
                    <p className={styles['time']}>{formattedDate.toString()}</p>
                    <AddProjectButton clickHandler={addGroup} />
                </div>
                <div className={styles['project-boxes']}>
                    <GroupBox backgroundColor={"#fee4cb"} header="CS2030" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#e9e7fd"} header="CS2040" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={""} header="BT2102" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#ffd3e2"} header="LAF1201" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#c8f7dc"} header="GEX1015" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#d5deff"} header="IS1108" subheader="Prototyping" width="50%" />
                </div>
            </div>
            <div className={styles['messages-section']}>
                <div className={styles['projects-section-header']}>
                    <p>Add people</p>
                    <PeopleSearchBar width="80%" />
                </div>
                <div className={styles['messages']}>
                    <PeopleBar name="Stephanie" bio="hihi wanna do CS2030 together?" />
                    <PeopleBar name="Ethan" bio={"I want to study French 1 next sem, you think you want to take it tgt? We can help each other!"} />
                    <PeopleBar name="David" bio={`ok i'm down! lets take it together with james too then.`} />
                    <PeopleBar name="Jessica" bio="I have to take BT2102 next sem, wbu?" />
                </div>
            </div>
                <GroupForm visibility={formVisible} setVisibility={setFormVisible} />
        </>
    )
}
