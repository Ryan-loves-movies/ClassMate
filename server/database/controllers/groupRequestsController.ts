import GroupRequests from '@models/GroupRequests';
import Groups from '@models/Groups';
import Users from '@models/Users';
import { Request, Response } from 'express';

async function getGroupRequests(req: Request, res: Response) {
    const username = req.query.username as string;

    await Users.findByPk(username, {
        include: [
            {
                model: GroupRequests
            }
        ]
    })
        .then(async (user) => {
            const groupRequests = await user?.getGroupRequests();
            return res.status(200).json({
                requests: groupRequests?.map((groupRequest) => {
                    return {
                        requestor: groupRequest.requestor,
                        requestee: groupRequest.requestee,
                        groupId: groupRequest.groupId,
                        message: groupRequest.message.substring(
                            0,
                            groupRequest.message.lastIndexOf(' ')
                        ) // Remove last word that contains groupsId for uniqueness
                    };
                })
            });
        })
        .catch(() => {
            return res.status(404).json([]);
        });
}

async function createGroupRequest(req: Request, res: Response) {
    const username = req.query.username as string;
    const groupId = parseInt(req.query.groupId as string);
    const requestee = req.query.requestee as string;

    await Groups.findByPk(groupId, {
        attributes: ['name']
    })
        .then(async (group) => {
            const groupRequest = await GroupRequests.create({
                requestor: username,
                requestee: requestee,
                groupId: groupId,
                message: `${username} is requesting for you to join ${group?.name} ${groupId}`
            });
            const user = await Users.findByPk(requestee);
            await user?.addGroupRequest(groupRequest);
            return res.status(200).json({ message: 'Created request!' });
        })
        .catch((err) => {
            return res
                .status(404)
                .json({ message: 'Group could not be found!', error: err });
        });
}

async function acceptGroupRequest(req: Request, res: Response) {
    const requestee = req.query.requestee as string;
    const requestor = req.query.requestor as string;
    const groupId = req.query.groupId as string;

    await GroupRequests.findOne({
        where: {
            requestee: requestee,
            requestor: requestor,
            groupId: groupId
        }
    })
        .then(async (groupRequest) => {
            const user = await Users.findByPk(requestee);
            await user?.removeGroupRequest(groupRequest as GroupRequests);
            await GroupRequests.destroy({
                where: {
                    message: groupRequest?.message
                }
            });
            const groupToAdd = await Groups.findByPk(groupId);
            await groupToAdd?.addUser(user as Users);
            return res.status(200).json({ message: 'Added user to group!' });
        })
        .catch((err) =>
            res.status(404).json({
                message: 'Could not find request to delete!',
                error: err
            })
        );
}

async function deleteGroupRequest(req: Request, res: Response) {
    const requestee = req.query.requestee as string;
    const requestor = req.query.requestor as string;
    const groupId = req.query.groupId as string;
    const user = await Users.findByPk(requestee);

    await GroupRequests.findOne({
        where: {
            requestee: requestee,
            requestor: requestor,
            groupId: groupId
        }
    })
        .then(async (groupRequest) => {
            await user?.removeGroupRequest(groupRequest as GroupRequests);
            await GroupRequests.destroy({
                where: {
                    message: groupRequest?.message
                }
            });
            return res.status(202).json({ message: 'Deleted!' });
        })
        .catch((err) =>
            res.status(404).json({
                message: 'Could not find request to delete!',
                error: err
            })
        );
}

export default {
    getGroupRequests,
    createGroupRequest,
    acceptGroupRequest,
    deleteGroupRequest
};
