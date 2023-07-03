require('module-alias/register');
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import authorizeUserRouter from '@server/routes/authorizeUserRoute';
import userRouter from '@server/routes/userRoutes';
import groupRouter from '@server/routes/groupRoutes';
import moduleRouter from '@server/routes/moduleRoutes';
import freeUserRouter from '@server/routes/freeUserRoutes';
import authorizeToken from '@server/middleware/auth';
import sequelize from '@server/database/connection';

const expressApp = express();
const port = 8080;

expressApp.use(express.json({ limit: '10mb' }));
expressApp.use(cors());
expressApp.use('/authorized', authorizeToken);
expressApp.use('/authorized', authorizeUserRouter);
expressApp.use('/authorized', userRouter);
expressApp.use('/authorized', groupRouter);
expressApp.use('/authorized', moduleRouter);
expressApp.use('/', freeUserRouter);

expressApp.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle on database close
process.on('SIGINT', () => {
    sequelize.close();
    process.exit();
});

export default expressApp;
