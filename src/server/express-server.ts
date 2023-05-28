import express from 'express';
import cors from 'cors';
import userRouter from '@server/routes/userRoutes';
import authRouter from '@server/routes/authenticateUser';
import sequelize from '@server/database/connection';

const expressApp = express();
const port = 8000;

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
