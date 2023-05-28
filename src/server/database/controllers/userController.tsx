// User for connection with mySQL and { Request, Response } with express api
import User from '@server/database/models/user';
import config from '@server/config';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Model } from 'sequelize';

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
    return jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'invalid token' });
        }
        if (decoded) {
            return res.status(200).json({ message: 'Token validated!' });
        }
    });
}

const createUser = (req: Request, res: Response) => {
    const { email, username, password }: profile = req.body;
    console.log(email);

    try {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            console.log(hashedPassword);
            if (err) {
                throw err;
            }
            if (hashedPassword) {
                return User.create({ username: username, email: email, password: hashedPassword });
            }
        });
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
        }).then((user: Model) => {
            if (!user) {
                return res.status(404).json({ message: 'No existing user found' });
            }
            bcrypt.compare(password, user.dataValues.password as string, (err, authenticated) => {
                if (err) {
                    throw err;
                }
                if (authenticated) {
                    const token = jwt.sign(req.body, config.JWT_SECRET, { expiresIn: '1d' })
                    return res.status(200).json({
                        message: 'User authenticated',
                        token: token
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
    // Clear JWT token on client-side AND invalidate token on server-side
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
        }).then((user: Model) => {
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
    try {
        validateRequest(req, res);
        return await User.update(req.body, {
            where: {
                username: req.body.username
            }
        }).then((rowsUpdated: number) => {
            console.log(`Updated ${rowsUpdated} rows.`);
        })
            .catch((error: Error) => {
                console.error('Error updating row:', error);
            });
    } catch (err) {
        throw err;
    }
}

async function resetPassword(req: Request, res: Response) {
    // Do user authentication first
    // Update password after
    try {
        validateRequest(req, res);
        return await User.update(req.body, {
            where: {
                password: req.body.password
            }
        }).then((rowsUpdated: number) => {
            console.log(`Updated ${rowsUpdated} rows.`);
        }).catch((error: Error) => {
            console.error('Error updating row:', error);
        });
    } catch (err) {
        throw err;
    }
}

async function verifyEmail(req: Request, res: Response) {
    try {
        validateRequest(req, res);
        return res.json({ message: 'Email verified???????' });
    } catch (err) {
        throw err;
    }
}

async function deleteUser(req: Request, res: Response) {
    try {
        validateRequest(req, res);
        return await User.destroy({
            where: {
                username: req.body.username
            }
        }).then((rowsDeleted: number) => {
            console.log(`Deleted ${rowsDeleted} rows.`);
        }).catch((error: Error) => {
            console.error('Error deleting row:', error);
        });
    } catch (err) {
        throw err;
    }

}

export default { createUser, logIn, logOut, getProfile, updateProfile, resetPassword, verifyEmail, deleteUser };
