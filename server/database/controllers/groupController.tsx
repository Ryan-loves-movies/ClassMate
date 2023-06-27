import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import Groups from '@models/Groups';
import Users from '@models/Users';
import Users_Groups from '@models/Users_Groups';
import validateRequest from '@controllers/authController';

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
    validateRequest(req, res);
    const { usernames, groupName } = req.body;
    await Groups.findOne({
        where: {
            name: groupName
        },
        include: [
            {
                model: Users,
                where: {
                    username: usernames
                }
            }
        ]
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
async function createGroup(req: Request, res: Response) {
    validateRequest(req, res);
    const { groupName, username } = req.body;
    await Groups.create({ name: groupName })
        .then((group) => {
            Users.findByPk(username, {
                include: [{
                    model: Groups
                }]
            })
                .then((user) => {
                    group.addUser(user as Users);
                    res.status(200).json({ groupId: group.id });
                })
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
    validateRequest(req, res);
    const { groupId } = req.body;
    await Groups.destroy({
        where: {
            id: groupId
        }
    });
    await Users_Groups.destroy({
        where: {
            groupId: groupId
        }
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
    validateRequest(req, res);
    const { username, groupId } = req.body;
    await Groups.findByPk(groupId, {
        include: [
            {
                model: Users,
            }]
    })
        .then((group) => {
            Users.findByPk(username)
                .then((user) => {
                    group?.addUser(user as Users);
                })
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
    validateRequest(req, res);
    const { username, groupId } = req.body;
    await Groups.findByPk(groupId, {
        include: [
            {
                model: Users,
            }]
    })
        .then((group) => {
            Users.findByPk(username)
                .then((user) => {
                    group?.removeUser(user as Users);
                })
        });
}

export default { getGroupId, createGroup, deleteGroup, addUserToGroup, removeUserFromGroup };
