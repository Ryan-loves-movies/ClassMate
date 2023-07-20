import { Request, Response } from 'express';
import { Op } from 'sequelize';

import Groups from '@models/Groups';
import Users from '@models/Users';
import Users_Groups from '@models/Users_Groups';
import Modules from '@models/Modules';

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
Create a new group with the list of users, return groupId **/
async function getGroups(req: Request, res: Response) {
    const username = req.query.username as string;
    const actAy = parseInt(req.query.ay as string);
    const actSem = parseInt(req.query.semester as string);

    await Users.findByPk(username, {
        include: [
            {
                model: Groups
            }
        ]
    })
        .then(async (user) => {
            const groups = (await user?.getGroups())?.filter(
                (group) => group.ay === actAy && group.sem === actSem
            );
            return res.status(200).json({
                groups: groups?.map((group) => group.toJSON())
            });
        })
        .catch(() => {
            return res
                .status(404)
                .json({ message: 'user could not be found!' });
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
                model: Users
            }
        ]
    })
        .then(async (group) => {
            const users = await group?.getUsers();
            return res.status(200).json({
                users: users?.map((user) => {
                    return {
                        username: user.username,
                        email: user.email,
                        photo: user.photo
                    };
                })
            });
        })
        .catch(() => {
            res.status(404).json({ message: 'user could not be found!' });
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
Checks if module code exists and is correct, if not in correct format -> Corrects it!
Create a new group with the list of users, return groupId
**/
async function createGroup(req: Request, res: Response) {
    const { groupName, moduleCode, color, username, ay, semester } = req.body;
    const actAy = parseInt(ay);
    const actSem = parseInt(semester);

    await Modules.findOne({
        where: {
            code: {
                [Op.iLike]: `${moduleCode}`
            }
        }
    })
        .then(async (module) => {
            const moduleCode = module?.code as string;
            await Groups.create({
                name: groupName,
                moduleCode: moduleCode,
                color: color,
                ay: actAy,
                sem: actSem
            });
            const user = await Users.findByPk(username);
            const group = await Groups.findOne({
                where: {
                    name: groupName,
                    moduleCode: moduleCode,
                    color: color,
                    ay: actAy,
                    sem: actSem
                }
            });
            await group?.addUser(user as Users);

            return res.status(201).json({
                id: group?.id,
                moduleCode: moduleCode,
                name: groupName,
                color: color
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(404).json({ message: 'Module does not exist!' });
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
            id: groupId
        }
    });
    await Users_Groups.destroy({
        where: {
            groupId: groupId
        }
    })
        .then(() => {
            res.status(200).json({ message: 'Group successfully deleted' });
        })
        .catch((err) => {
            res.status(401).json({ message: err });
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
                model: Users
            }
        ]
    })
        .then(async (group) => {
            const user = await Users.findByPk(username);
            await group?.addUser(user as Users);
            return res.status(200).json({ message: 'User added to group!' });
        })
        .catch(() => {
            return res.status(404).json({ message: 'Group not found!' });
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
    const username = req.query.username as string;
    const groupId = parseInt(req.query.groupId as string);
    return await Groups.findByPk(groupId, {
        include: [
            {
                model: Users
            }
        ]
    })
        .then(async (group) => {
            if (
                await group?.countUsers().then((userCount) => userCount === 1)
            ) {
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
                return res.status(200).json({ message: 'Removed user!' });
            }

            const user = await Users.findByPk(username);
            await group?.removeUser(user as Users);
            return res.status(200).json({ message: 'Removed user!' });
        })
        .catch(() => {
            return res.status(404).json({ message: 'Cannot find group!' });
        });
}

export default {
    // getGroupId,
    getGroups,
    getUsersInGroup,
    createGroup,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup
};
