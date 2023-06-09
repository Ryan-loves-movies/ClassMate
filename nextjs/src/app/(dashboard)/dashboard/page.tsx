import "@app/(dashboard)/globals.css";
import styles from "@app/(dashboard)/dashboard/dashboard.module.css";
import GroupBox from "@components/dashboard/GroupBox";
import SearchBar from "@components/dashboard/SearchBar";
import PeopleBar from "@components/PeopleBar";

export default function Dashboard() {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const day = currentDate.getDate();
    const formattedDate = `${month}, ${day}`;

    return (
        <>
            <div className={styles['projects-section']}>
                <div className={styles['projects-section-header']}>
                    <p>Groups</p>
                    <p className={styles['time']}>{formattedDate.toString()}</p>
                </div>
                <div className={styles['project-boxes']}>
                    <GroupBox backgroundColor={"#fee4cb"} header="Web Design" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#e9e7fd"} header="Web Design" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={""} header="Web Design" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#ffd3e2"} header="Web Design" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#c8f7dc"} header="Web Design" subheader="Prototyping" width="50%" />
                    <GroupBox backgroundColor={"#d5deff"} header="Web Design" subheader="Prototyping" width="50%" />
                </div>
            </div>
            <div className={styles['messages-section']}>
                <div className={styles['projects-section-header']}>
                    <p>Add people</p>
                    <SearchBar width="800px"/>
                </div>
                <div className={styles['messages']}>
                    <PeopleBar name="Stephanie" bio="I got your first assignment. It was quite good. 🥳 We can continue with the next assignment." />
                    <PeopleBar name="Mark" bio={`Hey, can tell me about progress of project? I'm waiting for your response.`} />
                    <PeopleBar name="David" bio={`I am really impressed! Can't wait to see the final result.`} />
                    <PeopleBar name="Jessica" bio="Awesome! 🤩 I like it. We can schedule a meeting for the next one" />
                </div>
            </div>
        </>
    )
}
