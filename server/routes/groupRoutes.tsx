import express from 'express';
const expressRouter = express.Router();
import groupController from '@controllers/groupController';
import generateTimetable from '@server/solver/solverController';

const {
    getGroupId,
    getGroups,
    getUsersInGroup,
    createGroup,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup
} = groupController;

expressRouter.get('/group/user', getGroups);
expressRouter.get('/group', getUsersInGroup);
expressRouter.post('/group', createGroup);
expressRouter.delete('/group', deleteGroup);
expressRouter.delete('/group/user', removeUserFromGroup);
expressRouter.put('/group/user', addUserToGroup);
expressRouter.put('/group/optimize', generateTimetable);

export default expressRouter;
