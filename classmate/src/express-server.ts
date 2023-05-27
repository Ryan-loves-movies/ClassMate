import express from 'express';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authenticateUser';
import sequelize from './database/connection';

const expressApp = express();
const port = 8000;

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
