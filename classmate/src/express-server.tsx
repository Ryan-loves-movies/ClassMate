import express from 'express';
import expressRouter from '@/routes/userRoutes';
import sequelize from '@/database/connection';

const expressApp = express();
const port = 8000;

expressApp.use('/', expressRouter);

expressApp.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle on database close
process.on('SIGINT', () => {
    sequelize.close();
    process.exit();
});

export default expressApp;
