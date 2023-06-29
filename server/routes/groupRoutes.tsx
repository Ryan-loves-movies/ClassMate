import express from 'express';
const expressRouter = express.Router();
import groupController from '@controllers/groupController';

const { getGroupId, getGroups, createGroup, deleteGroup, addUserToGroup, removeUserFromGroup } = groupController;

expressRouter.get('/group/user', getGroups);
expressRouter.post('/group', createGroup);
expressRouter.delete('/group', deleteGroup);
expressRouter.delete('/group/user', removeUserFromGroup);
expressRouter.put('/group/user', addUserToGroup);

export default expressRouter;
