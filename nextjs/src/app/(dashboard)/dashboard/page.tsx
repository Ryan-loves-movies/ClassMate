'use client';
import '@app/(dashboard)/globals.css';
import styles from '@app/(dashboard)/dashboard/dashboard.module.css';
import GroupBox from '@components/dashboard/dashboard/GroupBox';
import UserSearchBar from '@components/dashboard/dashboard/UserSearchBar';
import PeopleBar from '@components/PeopleBar';
import AddProjectButton from '@components/dashboard/dashboard/AddProjectButton';
import GroupForm from '@components/dashboard/dashboard/GroupForm';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
const { expressHost } = config;

// ONLY for intermediate result of getGroups() which returns groupWithoutUsers[]
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
        type: string;
        data: Array<number>;
    };
}

export default function Dashboard() {
    // Determining date for section
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const day = currentDate.getDate();
    const formattedDate = `${month}, ${day}`;

    // setNewGroup will be set by groupForm when form is submitted => Then re-rendering of group boxes
    // setGroups will be set by the rendering of the groupBoxes
    // setSearchRes will be set by the UserSearchBar
    // setFormVisible will be set by groupForm to be toggled to false and set by AddProjectButton to be toggled to true
    // setGroupChosen will be set by the add user button in the group box => then modify the heading and PeopleBar for the messages section
    const [newGroup, setNewGroup] = useState<groupWithoutUsers>();
    const [groups, setGroups] = useState<group[]>([]);
    const [searchRes, setSearchRes] = useState<user[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [groupChosen, setGroupChosen] = useState<group>();

    // Rendering of all the GroupBoxes
    const groupBoxColors = [
        '#fee4cb',
        '#e9e7fd',
        '#ffd3e2',
        '#c8f7dc',
        '#d5deff',
        ''
    ];
    const GroupBoxes = () => {
        return (
            <>
                {groups.map((oneGroup: group, index: number) => {
                    const color = groupBoxColors[index % 6];
                    return (
                        <GroupBox
                            waiting={groupChosen ? false : true}
                            backgroundColor={color}
                            id={oneGroup.id}
                            header={oneGroup.moduleCode}
                            subheader={oneGroup.name}
                            users={oneGroup.users}
                            width="50%"
                            setGroupChosen={setGroupChosen}
                            key={oneGroup.id}
                        />
                    );
                })}
            </>
        );
    };

    // Rendering of all the users
    const FoundUsers = () => {
        return (
            <>
                {searchRes.map((user) => {
                    return (
                        <PeopleBar
                            user={user}
                            group={groupChosen}
                            bio="hihi wanna do CS2030 together?"
                            key={user.username}
                        />
                    );
                })}
            </>
        );
    };

    // Functionality for addProjectButton
    const addGroup = () => {
        setFormVisible(true);
    };

    // Dynamically rendered messages header
    const MessagesHeader = () => {
        if (groupChosen) {
            return <p>{`Add user to ${groupChosen.name}:`}</p>;
        }
        return <p>Find others!</p>;
    };

    // Search Bar Functionalities
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setGroupChosen(undefined);
        }
    };

    useEffect(() => {
        // Set all groups
        const getUsersInGroups = (groups: groupWithoutUsers[]) => {
            return Promise.all(
                groups.map(async (group) => {
                    return await axios
                        .get(`${expressHost}/authorized/group`, {
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
                            alert(
                                `Error when fetching users for group: ${err}`
                            );
                        });
                })
            );
        };
        const getGroups = async () => {
            return await axios
                .get(`${expressHost}/authorized/group/user`, {
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
                    getUsersInGroups(groups).then((groups) =>
                        setGroups(groups as group[])
                    );
                })
                .catch((err) => {
                    alert(`Error when finding groups associated: ${err}`);
                });
        };

        getGroups();
        console.log('1');
    }, [newGroup]);

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
                    <MessagesHeader />
                    <UserSearchBar
                        focused={groupChosen ? true : false}
                        handleKeyDown={handleKeyDown}
                        setSearchRes={setSearchRes}
                        width="80%"
                    />
                </div>
                <div className={styles['messages']}>
                    <FoundUsers />
                </div>
            </div>
            <GroupForm
                visibility={formVisible}
                setVisibility={setFormVisible}
                setNewGroup={setNewGroup}
            />
        </>
    );
}
