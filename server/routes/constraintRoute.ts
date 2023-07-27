import express from 'express';
const expressRouter = express.Router();
import constraintController from '@controllers/constraintController';

const { getConstraint, updateConstraint } = constraintController;

expressRouter.get('/constraints', getConstraint);
expressRouter.put('/constraints', updateConstraint);

export default expressRouter;
