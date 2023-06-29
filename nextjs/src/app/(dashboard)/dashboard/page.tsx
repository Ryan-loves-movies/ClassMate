'use client'
import "@app/(dashboard)/globals.css";
import styles from "@app/(dashboard)/dashboard/dashboard.module.css";
import GroupBox from "@components/dashboard/GroupBox";
import UserSearchBar from "@components/dashboard/UserSearchBar";
import PeopleBar from "@components/PeopleBar";
import AddProjectButton from "@components/dashboard/AddProjectButton";
import { useEffect, useState } from "react";
import GroupForm from "@components/dashboard/GroupForm";
import axios, { AxiosResponse } from "axios";
import config from '@/config';
import { bufferToBase64 } from "@components/dashboard/PhotoRenderer";
const { expressHost } = config;

interface groupWithoutUsers {
    id: number;
    moduleCode: string;
    name: string;
}

interface group {
    id: number;
    moduleCode: string;
    name: string;
    users: user[];
}

interface user {
    username: string;
    photo: {
        type: string,
        data: Array<number>;
    }
}

export default function Dashboard() {
    // Determining date for section
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const day = currentDate.getDate();
    const formattedDate = `${month}, ${day}`;

    const [newGroup, setNewGroup] = useState<groupWithoutUsers>();
    const [groups, setGroups] = useState<group[]>([]);
    const [searchRes, setSearchRes] = useState<user[]>([]);
    const [formVisible, setFormVisible] = useState(false);

    // Rendering of all the GroupBoxes
    const groupBoxColors = ['#fee4cb', '#e9e7fd', '#ffd3e2', '#c8f7dc', '#d5deff', ''];
    const GroupBoxes = () => {
        return (
            <>
                {groups.map((oneGroup: group, index: number) => {
                    const color = groupBoxColors[index % 6]
                    return (
                        <GroupBox backgroundColor={color} header={oneGroup.moduleCode} subheader={oneGroup.name} users={oneGroup.users} width="50%" key={oneGroup.id} />
                    );
                })}
            </>
        )
    }

    // Rendering of all the users
    const FoundUsers = () => {
        return (
            <>
                {searchRes.map((user) => {
                    return (
                        <PeopleBar name={user.username} bio="hihi wanna do CS2030 together?" photo={`data:image/*;base64,${bufferToBase64(user.photo.data)}`} key={user.username} />
                    );
                })}
            </>
        );
    }

    // Set all groups
    const getUsersInGroups = (groups: groupWithoutUsers[]) => {
        return Promise.all(
            groups.map(async (group) => {
                return await axios.get(`${expressHost}/authorized/group`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    params: {
                        groupId: group.id
                    }
                })
                    .then((res: AxiosResponse) => {
                        console.log('2');
                        return {
                            id: group.id,
                            moduleCode: group.moduleCode,
                            name: group.name,
                            users: res.data.users as user[]
                        } as group;
                    })
                    .catch((err) => {
                        alert(`Error when fetching users for group: ${err}`);
                    });
            }));
    }

    const getGroups = async () => {
        return await axios.get(`${expressHost}/authorized/group/user`, {
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            params: {
                username: sessionStorage.getItem('username')
            }
        })
            .then((res: AxiosResponse) => {
                console.log('3');
                const groups: groupWithoutUsers[] = res.data.groups;
                getUsersInGroups(groups).then((groups) => setGroups(groups as group[]));
            })
            .catch((err) => {
                alert(`Error when finding groups associated: ${err}`);
            });
    }

    // Functionality for addProjectButton
    const addGroup = () => {
        setFormVisible(true);
    }

    // Search Bar Functionalities
    const handleKeyDown = () => { };

    useEffect(() => {
        getGroups();
        console.log('1');
    }, [newGroup])

    return (
        <>
            <div className={styles['projects-section']}>
                <div className={styles['projects-section-header']}>
                    <p>Groups</p>
                    <p className={styles['time']}>{formattedDate.toString()}</p>
                    <AddProjectButton clickHandler={addGroup} />
                </div>
                <div className={styles['project-boxes']}>
                    <GroupBoxes />
                </div>
            </div>
            <div className={styles['messages-section']}>
                <div className={styles['projects-section-header']}>
                    <p>Add people</p>
                    <UserSearchBar handleKeyDown={handleKeyDown} setSearchRes={setSearchRes} width="80%" />
                </div>
                <div className={styles['messages']}>
                    <FoundUsers />
                </div>
            </div>
            <GroupForm visibility={formVisible} setVisibility={setFormVisible} setNewGroup={setNewGroup} />
        </>
    )
}
