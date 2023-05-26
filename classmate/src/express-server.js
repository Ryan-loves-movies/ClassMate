import express from 'express';
import { createConnection } from 'mysql';

const expressApp = express();
const port = 8000;

expressApp.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const connection = createConnection({
    host: '127.0.0.1',
    // host: '192.168.92.115',
    port: '3306',
    user: 'rtyt',
    password: 'Classmate123!',
    database: 'orbital',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Handle on database close
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

export default expressApp;
