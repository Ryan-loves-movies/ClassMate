import express from 'express';
const expressRouter = express.Router();
import groupController from '@controllers/groupController';

const { getGroupId, createGroup, deleteGroup, addUserToGroup, removeUserFromGroup } = groupController;

expressRouter.post('/group', createGroup);
expressRouter.delete('/group', deleteGroup);
expressRouter.get('/group/user', getGroupId);
expressRouter.delete('/group/user', removeUserFromGroup);
expressRouter.put('/group/user', addUserToGroup);

export default expressRouter;
