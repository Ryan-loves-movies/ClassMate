import { AxiosError } from "axios";
import { Request, Response } from "express";
import Groups from "@models/Groups";
import Users from "@models/Users";
import Users_Groups from "@models/Users_Groups";

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        usernames: string[],
        groupName: string (new lectureCode)
    }
}
Returns the groupId of the group given the users and group name.
    NOTE: MAY NOT BE ACCURATE
**/
async function getGroupId(req: Request, res: Response) {
    const { usernames, groupName } = req.body;
    await Groups.findOne({
        where: {
            name: groupName,
        },
        include: [
            {
                model: Users,
                where: {
                    username: usernames,
                },
            },
        ],
    })
        .then((group) => {
            res.status(200).json({ groupId: group?.id });
        })
        .catch((error: AxiosError) => {
            console.log(error);
            res.status(500).json({ message: "Group not found!", error: error });
        });
}

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        groupName: number (new lectureCode),
        username: string[]
    }
}
Create a new group with the list of users, return groupId
**/
async function getGroups(req: Request, res: Response) {
    const username = req.query.username as string;
    await Users.findByPk(username, {
        include: [
            {
                model: Groups,
            },
        ],
    })
        .then((user) => {
            user
                ?.getGroups()
                .then((groups) => {
                    res
                        .status(200)
                        .json({ groups: groups.map((group) => group.toJSON()) });
                })
                .catch((err) => {
                    res.status(404).json({
                        message: `error occurred when trying to find groups associated with user: ${err}`,
                    });
                });
        })
        .catch(() => {
            res.status(404).json({ message: "user could not be found!" });
        });
}

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        groupName: number (new lectureCode),
        username: string[]
    }
}
Create a new group with the list of users, return groupId
**/
async function getUsersInGroup(req: Request, res: Response) {
    const groupId = req.query.groupId as string;
    await Groups.findByPk(groupId, {
        include: [
            {
                model: Users,
            },
        ],
    })
        .then(async (group) => {
            await group
                ?.getUsers()
                .then((users) => {
                    res.status(200).json({ users: users.map((user) => user.toJSON()) });
                })
                .catch((err) => {
                    res.status(404).json({
                        message: `error occurred when trying to find groups associated with user: ${err}`,
                    });
                });
        })
        .catch(() => {
            res.status(404).json({ message: "user could not be found!" });
        });
}

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        groupName: number (new lectureCode),
        username: string[]
    }
}
Create a new group with the list of users, return groupId
**/
async function createGroup(req: Request, res: Response) {
    const { groupName, moduleCode, username } = req.body;
    await Groups.create({
        name: groupName,
        moduleCode: moduleCode,
    })
        .then((group) => {
            Users.findByPk(username, {
                include: [
                    {
                        model: Groups,
                    },
                ],
            })
                .then((user) => {
                    group.addUser(user as Users);
                    res.status(200).json({
                        id: group.id,
                        moduleCode: moduleCode,
                        name: groupName,
                    });
                })
                .catch(() => {
                    res.status(404).json({ message: "user could not be found!" });
                });
        })
        .catch((err) => {
            res.status(401).json({ message: err.message });
        });
}

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        groupId: number
    }
}
Create a new group with the list of users, return groupId
**/
async function deleteGroup(req: Request, res: Response) {
    const { groupId } = req.body;
    await Groups.destroy({
        where: {
            id: groupId,
        },
    });
    await Users_Groups.destroy({
        where: {
            groupId: groupId,
        },
    });
}

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        groupId: number (new lectureCode)
    }
}
Modifies the lessons being taken by the user for particular module in the database and returns the number of values updated
    **/
async function addUserToGroup(req: Request, res: Response) {
    const { username, groupId } = req.body;
    return await Groups.findByPk(groupId, {
        include: [
            {
                model: Users,
            },
        ],
    })
        .then((group) => {
            Users.findByPk(username)
                .then((user) => {
                    group?.addUser(user as Users);
                    res.status(200).json({ message: "User added to group!" });
                })
                .catch(() => {
                    res.status(404).json({ message: "User not found!" });
                });
        })
        .catch(() => {
            res.status(404).json({ message: "Group not found!" });
        });
}

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        groupId: number (new lectureCode)
    }
}
Modifies the lessons being taken by the user for particular module in the database and returns the number of values updated
    **/
async function removeUserFromGroup(req: Request, res: Response) {
    const { username, groupId } = req.body;
    await Groups.findByPk(groupId, {
        include: [
            {
                model: Users,
            },
        ],
    }).then((group) => {
        Users.findByPk(username).then((user) => {
            group?.removeUser(user as Users);
        });
    });
}

export default {
    getGroupId,
    getGroups,
    getUsersInGroup,
    createGroup,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup,
};
