require('module-alias/register');
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import userRouter from '@server/routes/userRoutes.jsx';
import authRouter from '@server/routes/authenticateUser.jsx';
import sequelize from '@server/database/connection.jsx';

const expressApp = express();
const port = 8080;

expressApp.use(express.json());
expressApp.use(cors());
expressApp.use('/', userRouter);
expressApp.use('/', authRouter);

expressApp.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle on database close
process.on('SIGINT', () => {
    sequelize.close();
    process.exit();
});
