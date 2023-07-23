import express from 'express';
const expressRouter = express.Router();
import groupRequestController from '@controllers/groupRequestsController';

const {
    getGroupRequests,
    createGroupRequest,
    acceptGroupRequest,
    deleteGroupRequest
} = groupRequestController;

expressRouter.get('/notifications', getGroupRequests);
expressRouter.post('/notifications', createGroupRequest);
expressRouter.put('/notifications', acceptGroupRequest);
expressRouter.delete('/notifications', deleteGroupRequest);

export default expressRouter;
