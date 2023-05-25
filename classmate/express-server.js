import express from 'express';
import { createConnection } from 'mysql';

const app = express();
const port = 8000;

app.listen(port, () => {
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

// Create route for get requests
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error executing the query:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// Route for New users
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    connection.query(`SELECT password FROM users WHERE username = '${username}'`, (err, result) => {
        if (err) {
            console.error('User does not exist', err);
            res.status(500).json({ error: 'User does not exist' });
            return;
        } else if (!(result === password)) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }
        res.status(200).json( );
    })
})
app.post('/register', (req, res) => {
  // Extract the required data from the request body
  const { username, email, password } = req.body;

  // Perform any necessary validation on the data

  // Create a new user object or interact with the database to store the user
  const newUser = {
    username,
    email,
    password
  };

  // Assuming you have a MySQL connection object named 'connection' established
  connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
    if (err) {
      console.error('Error creating a new user:', err);
      res.status(500).json({ error: 'Failed to create a new user' });
      return;
    }

    // If the user is created successfully, you can send a success message back
    res.json({ message: 'User created successfully' });
  });
});

// Handle on database close
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});
