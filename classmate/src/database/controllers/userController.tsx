import config from '@/config';
// User for connection with mySQL and { Request, Response } with express api
import User from '@/database/models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface profile {
    email: string;
    username: string;
    password: string;
}

interface minProfile {
    username: string;
    password: string;
}

interface authenticatedUser {
    username: string;
    token: string;
}


// Number of iterative hashing for password encryption
const saltRounds = 10;

function validateRequest(req: Request, res: Response) {
    const token = (req.headers.authorisation as string)?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
        return res.json(401).json({ message: 'invalid token' });
    }
}

const createUser = (req: Request, res: Response) => {
    const { email, username, password }: profile = req.body;

    try {
        const hashedPassword = bcrypt.hash(password, saltRounds);
        User.create({ username, email, hashedPassword });
        res.status(201).json({ message: 'User created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
async function logIn(req: Request, res: Response) {
    const { username, password }: minProfile = req.body;
    try {
        await User.findOne({
            where: {
                username: username
            }
        }).then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'No existing user found' });
            }
            bcrypt.compare(password, user.get('password') as string, (err, authenticated) => {
                if (err) {
                    throw err;
                }
                if (authenticated) {
                    return res.status(200).json({
                        message: 'User authenticated',
                        // ADD JWT TOKEN HERE
                        token: 'sadasd'
                    });
                } else {
                    return res.status(401).json({ message: 'Wrong password or something wrong with server!' });
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
}
async function logOut(req: Request, res: Response) {
    // Clear JWT token on client-side OR invalidate token on server-side
    res.status(200).json({ message: 'Logout successful!' });
}

async function getProfile(req: Request, res: Response) {
    try {
        const { username }: authenticatedUser = req.body;
        validateRequest(req, res);
        User.findOne({
            where: {
                username: username
            }
        }).then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'No existing user found' });
            }
            return res.status(200).json(user);
        });
    } catch (err) {
        throw err;
    }
}

async function updateProfile(req: Request, res: Response) {

}

async function resetPassword(req: Request, res: Response) {

}

async function verifyEmail(req: Request, res: Response) {

}

async function deleteUser(req: Request, res: Response) {

}

export default { createUser, logIn, logOut, getProfile, updateProfile, resetPassword, verifyEmail, deleteUser };
