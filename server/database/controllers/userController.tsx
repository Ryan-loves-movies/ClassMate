// User for connection with mySQL and { Request, Response } with express api
import User from '@server/database/models/user.jsx';
import config from '@server/config.jsx';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Model } from 'sequelize';
import { AxiosError } from 'axios';

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
}


// Number of iterative hashing for password encryption
const saltRounds = 10;

function validateRequest(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
        const token = req.headers.authorization?.split(' ')[0] as string;

        if (!token) {
            res.status(404).json({ message: 'No token provided' });
            throw new AxiosError('No token provided');
        }

        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
                throw new AxiosError('Invalid token');
            }
        });
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
        validateRequest(req, res);
        return await User.findOne({
            where: {
                username: req.query.username
            }
        }).then((user: Model) => {
            if (!user) {
                return res.status(404).json({ message: 'No existing user found' });
            }

            if (req.query.mods === 'true') {
                return res.status(200).json({
                    username: user.get("username"),
                    email: user.get("email"),

                    mod1: {
                        code: user.get('mod1'),
                        lectureCode: user.get('mod1Code'),
                        lectureStartTime: user.get('mod1LecStartTime'),
                        lectureEndTime: user.get('mod1LecEndTime'),
                        tutorialCode: user.get('mod1Code'),
                        tutorialStartTime: user.get('mod1StartTimeTut'),
                        tutorialEndTime: user.get('mod1EndTimeTut'),
                        labCode: user.get('mod1Code'),
                        labStartTime: user.get('mod1LabStartTime'),
                        labEndTime: user.get('mod1LabEndTime'),
                    },


                    mod2: {
                        code: user.get('mod2'),
                        lectureCode: user.get('mod2Code'),
                        lectureStartTime: user.get('mod2LecStartTime'),
                        lectureEndTime: user.get('mod2LecEndTime'),
                        tutorialCode: user.get('mod2Code'),
                        tutorialStartTime: user.get('mod2StartTimeTut'),
                        tutorialEndTime: user.get('mod2EndTimeTut'),
                        labCode: user.get('mod2Code'),
                        labStartTime: user.get('mod2LabStartTime'),
                        labEndTime: user.get('mod2LabEndTime'),
                    },


                    mod3: {
                        code: user.get('mod3'),
                        lectureCode: user.get('mod3Code'),
                        lectureStartTime: user.get('mod3LecStartTime'),
                        lectureEndTime: user.get('mod3LecEndTime'),
                        tutorialCode: user.get('mod3Code'),
                        tutorialStartTime: user.get('mod3StartTimeTut'),
                        tutorialEndTime: user.get('mod3EndTimeTut'),
                        labCode: user.get('mod3Code'),
                        labStartTime: user.get('mod3LabStartTime'),
                        labEndTime: user.get('mod3LabEndTime'),
                    },


                    mod4: {
                        code: user.get('mod4'),
                        lectureCode: user.get('mod4Code'),
                        lectureStartTime: user.get('mod4LecStartTime'),
                        lectureEndTime: user.get('mod4LecEndTime'),
                        tutorialCode: user.get('mod4Code'),
                        tutorialStartTime: user.get('mod4StartTimeTut'),
                        tutorialEndTime: user.get('mod4EndTimeTut'),
                        labCode: user.get('mod4Code'),
                        labStartTime: user.get('mod4LabStartTime'),
                        labEndTime: user.get('mod4LabEndTime'),
                    },


                    mod5: {
                        code: user.get('mod5'),
                        lectureCode: user.get('mod5Code'),
                        lectureStartTime: user.get('mod5LecStartTime'),
                        lectureEndTime: user.get('mod5LecEndTime'),
                        tutorialCode: user.get('mod5Code'),
                        tutorialStartTime: user.get('mod5StartTimeTut'),
                        tutorialEndTime: user.get('mod5EndTimeTut'),
                        labCode: user.get('mod5Code'),
                        labStartTime: user.get('mod5LabStartTime'),
                        labEndTime: user.get('mod5LabEndTime'),
                    },


                    mod6: {
                        code: user.get('mod6'),
                        lectureCode: user.get('mod6Code'),
                        lectureStartTime: user.get('mod6LecStartTime'),
                        lectureEndTime: user.get('mod6LecEndTime'),
                        tutorialCode: user.get('mod6Code'),
                        tutorialStartTime: user.get('mod6StartTimeTut'),
                        tutorialEndTime: user.get('mod6EndTimeTut'),
                        labCode: user.get('mod6Code'),
                        labStartTime: user.get('mod6LabStartTime'),
                        labEndTime: user.get('mod6LabEndTime'),
                    },


                    mod7: {
                        code: user.get('mod7'),
                        lectureCode: user.get('mod7Code'),
                        lectureStartTime: user.get('mod7LecStartTime'),
                        lectureEndTime: user.get('mod7LecEndTime'),
                        tutorialCode: user.get('mod7Code'),
                        tutorialStartTime: user.get('mod7StartTimeTut'),
                        tutorialEndTime: user.get('mod7EndTimeTut'),
                        labCode: user.get('mod7Code'),
                        labStartTime: user.get('mod7LabStartTime'),
                        labEndTime: user.get('mod7LabEndTime'),
                    },


                    mod8: {
                        code: user.get('mod8'),
                        lectureCode: user.get('mod8Code'),
                        lectureStartTime: user.get('mod8LecStartTime'),
                        lectureEndTime: user.get('mod8LecEndTime'),
                        tutorialCode: user.get('mod8Code'),
                        tutorialStartTime: user.get('mod8StartTimeTut'),
                        tutorialEndTime: user.get('mod8EndTimeTut'),
                        labCode: user.get('mod8Code'),
                        labStartTime: user.get('mod8LabStartTime'),
                        labEndTime: user.get('mod8LabEndTime'),
                    },


                    mod9: {
                        code: user.get('mod9'),
                        lectureCode: user.get('mod9Code'),
                        lectureStartTime: user.get('mod9LecStartTime'),
                        lectureEndTime: user.get('mod9LecEndTime'),
                        tutorialCode: user.get('mod9Code'),
                        tutorialStartTime: user.get('mod9StartTimeTut'),
                        tutorialEndTime: user.get('mod9EndTimeTut'),
                        labCode: user.get('mod9Code'),
                        labStartTime: user.get('mod9LabStartTime'),
                        labEndTime: user.get('mod9LabEndTime'),
                    },


                    mod10: {
                        code: user.get('mod10'),
                        lectureCode: user.get('mod10Code'),
                        lectureStartTime: user.get('mod10LecStartTime'),
                        lectureEndTime: user.get('mod10LecEndTime'),
                        tutorialCode: user.get('mod10Code'),
                        tutorialStartTime: user.get('mod10StartTimeTut'),
                        tutorialEndTime: user.get('mod10EndTimeTut'),
                        labCode: user.get('mod10Code'),
                        labStartTime: user.get('mod10LabStartTime'),
                        labEndTime: user.get('mod10LabEndTime'),
                    },


                    mod11: {
                        code: user.get('mod11'),
                        lectureCode: user.get('mod11Code'),
                        lectureStartTime: user.get('mod11LecStartTime'),
                        lectureEndTime: user.get('mod11LecEndTime'),
                        tutorialCode: user.get('mod11Code'),
                        tutorialStartTime: user.get('mod11StartTimeTut'),
                        tutorialEndTime: user.get('mod11EndTimeTut'),
                        labCode: user.get('mod11Code'),
                        labStartTime: user.get('mod11LabStartTime'),
                        labEndTime: user.get('mod11LabEndTime'),
                    },


                    mod12: {
                        code: user.get('mod12'),
                        lectureCode: user.get('mod12Code'),
                        lectureStartTime: user.get('mod12LecStartTime'),
                        lectureEndTime: user.get('mod12LecEndTime'),
                        tutorialCode: user.get('mod12Code'),
                        tutorialStartTime: user.get('mod12StartTimeTut'),
                        tutorialEndTime: user.get('mod12EndTimeTut'),
                        labCode: user.get('mod12Code'),
                        labStartTime: user.get('mod12LabStartTime'),
                        labEndTime: user.get('mod12LabEndTime'),
                    }
                });
            }
            return res.status(200).json({
                username: user.get("username"),
                email: user.get("email"),
            });
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
