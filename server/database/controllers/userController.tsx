// Users for connection with mySQL and { Request, Response } with express api
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AxiosError } from 'axios';
import config from '@server/config.jsx';
import Users, { lessonTypes } from '@models/Users.jsx';

interface profile {
    email: string;
    username: string;
    password: string;
}

interface minProfile {
    username: string;
    password: string;
}

interface modDet {
    code: string;
    day: string;
    startTime: string;
    endTime: string;
}

interface modType {
    code: string;
    lecture: modDet;
    tutorial: modDet;
    lab: modDet;
}

// Number of iterative hashing for password encryption
const saltRounds = 10;

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        * }
        * Verifies the JSON web token passed in request headers
        * */
function validateRequest(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
        const token = req.headers.authorization as string;

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

/** 
    * req: {
    *   body: {
        *   username: string,
        *   password: string (encoded),
        *   email: string
        *   }
        * }
        * Creates new user with empty details in the database
        * */
const createUser = (req: Request, res: Response) => {
    const { email, username, password }: profile = req.body;

    try {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                throw err;
            }
            if (hashedPassword) {
                return Users.create({ username: username, email: email, password: hashedPassword });
            }
        });
        res.status(201).json({ message: 'Users created successfully!' });
    } catch (err) {
        console.log("Error while making new user in createUser() - userController.tsx, line 65\n", err);
        res.status(500).json({ message: 'Server Error' });
    }
}

/** 
    * req: {
    *   body: {
        *   username: string,
        *   password: string (encoded),
        *   }
        * }
        * Verifies password of user, then returns a JSON web token with expiry in 24 hours.
            * */
async function logIn(req: Request, res: Response) {
    const { username, password }: minProfile = req.body;
    try {
        await Users.findOne({
            where: {
                username: username
            }
        }).then((user) => {
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
                        message: 'Users authenticated',
                        token: token
                    });
                } else {
                    return res.status(401).json({ message: 'Wrong password or something wrong with server!' });
                }
            });
        });
    } catch (err) {
        console.log("Error while logging in in logIn() function in userController.tsx - line 95\n", err);
    }
}

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        * }
        * Verifies token of user, then return log out successful message. 
            * Note: Deletion of JSON web token to be done on client side
        * */
async function logOut(req: Request, res: Response) {
    validateRequest(req, res);
    // Clear JWT token on client-side AND invalidate token on server-side
    res.status(200).json({ message: 'Logout successful!' });
}

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        *   params: {
            *   username: string,
            *   mods: ~boolean~
            *   }
            * }
            * Search for the user profile on the database and returns first matching username.
                    * If mods is true, return all module details of user profile
                * Else, only return username and email
            * */
async function getProfile(req: Request, res: Response) {
    try {
        validateRequest(req, res);
        const username = req.query.username as string;
        if (!username) {
            res.status(500).json({ message: "No username passed in params" })
            return;
        }
        if (req.query.mods === 'true') {
            return await Users.findOne({
                where: {
                    username: username
                },
                include: lessonTypes
            })
                .then((user) => {
                    if (!user) {
                        return res.status(404).json({ message: 'No existing user found' });
                    }
                    return res.status(200).json({
                        username: user.get("username"),
                        email: user.get("email"),
                    });

                });
        }

        return await Users.findOne({
            where: {
                username: username
            },
            include: lessonTypes
        })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No existing user found' });
                }
                return user.get(lessonTypes[0].name);
                // return res.status(200).json({
                //     username: user.get("username"),
                //     email: user.get("email"),

                //     mods: lessonTypes.map((lessonType) => user.get(lessonType.name))
                //         [
                //         {
                //             code: user.get('mod1'),
                //             lecture: {
                //                 code: user.get('mod1LecCode'),
                //                 day: user.get('mod1LecDay'),
                //                 startTime: user.get('mod1LecStartTime'),
                //                 endTime: user.get('mod1LecEndTime')
                //             },
                //             tutorial: {
                //                 code: user.get('mod1TutCode'),
                //                 day: user.get('mod1TutDay'),
                //                 startTime: user.get('mod1TutStartTime'),
                //                 endTime: user.get('mod1TutEndTime'),
                //             },
                //             lab: {
                //                 code: user.get('mod1LabCode'),
                //                 day: user.get('mod1LabDay'),
                //                 startTime: user.get('mod1LabStartTime'),
                //                 endTime: user.get('mod1LabEndTime')
                //             }
                //         }
                //     ]
                // });
            })
    }
    catch (err) {
        console.log("Error while getting profile details in getProfile() - userController.tsx - line 400?\n", err);
    }
}

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        *   body: {
            *   username: string,
            *   ~updatedRowKey~: ~updatedRowValue~
            *   }
            * }
            * Updates the values of the user profile in the database and returns the number of values updated
            * */
async function updateProfile(req: Request, res: Response) {
    try {
        validateRequest(req, res);
        const { username, ...updatedValsRaw } = req.body;
        const updatedVals = updatedValsRaw as modType;
        await Users.findOne({
            where: {
                username: username
            }
        }).then((details) => {
            // Check if module in database already
            //     If not yet, then get last empty mod number
            //     Else, then get mod number of module
            const allMods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => details?.get(`mod${num}`) || null);
            console.log(details);
            console.log(allMods.find((modCode) => modCode === updatedVals.code));
            console.log(allMods.filter((modCode) => modCode !== null));
            const modNoToChange =
                allMods.find((modCode) => modCode === updatedVals.code) ||
                (allMods.filter((modCode) => modCode !== null).length + 1)
            const updatedDet = {
                [`mod${modNoToChange}`]: updatedVals.code,
                [`mod${modNoToChange}LecCode`]: updatedVals.lecture.code,
                [`mod${modNoToChange}LecDay`]: updatedVals.lecture.day,
                [`mod${modNoToChange}LecStartTime`]: updatedVals.lecture.startTime,
                [`mod${modNoToChange}LecEndTime`]: updatedVals.lecture.endTime,
                [`mod${modNoToChange}LabCode`]: updatedVals.lab.code,
                [`mod${modNoToChange}LabDay`]: updatedVals.lab.day,
                [`mod${modNoToChange}LabStartTime`]: updatedVals.lab.startTime,
                [`mod${modNoToChange}LabEndTime`]: updatedVals.lab.endTime,
                [`mod${modNoToChange}TutCode`]: updatedVals.tutorial.code,
                [`mod${modNoToChange}TutDay`]: updatedVals.tutorial.day,
                [`mod${modNoToChange}TutStartTime`]: updatedVals.tutorial.startTime,
                [`mod${modNoToChange}TutEndTime`]: updatedVals.tutorial.endTime
            }
            Users.update(updatedDet, {
                where: {
                    username: username
                }
            })
                .then((rowsUpdated: number[]) => {
                    res.status(200).json({ message: `Updated rows ${rowsUpdated}.` });
                })
                .catch((error: Error) => {
                    res.status(500).json({ message: 'Error updating rows in database using updateProfile() in userController.tsx -- line 514:' });
                    console.log('Error updating rows in database using updateProfile() in userController.tsx -- line 514:', error);
                });
        });
    } catch (err) {
        console.log("Error when updating profile in updateProfile() - line 462 in userController.tsx\n", err);
    }
}

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        *   body: {
            *   username: string,
            *   oldPassword: ~oldPassword~ (encoded),
            *   newPassword: ~newPassword~ (encoded)
            *   }
            * }
            * Resets the passowrd of the user profile in the database
            * */
async function resetPassword(req: Request, res: Response) {
    // Do user authentication first
    // Update password after
    try {
        validateRequest(req, res);
        return await Users.update(req.body, {
            where: {
                password: req.body.password
            }
        }).then((rowsUpdated: number[]) => {
            res.status(200).json({ message: `Updated ${rowsUpdated} rows.` });
        }).catch((error: Error) => {
            res.status(200).json({ message: `Error updating row for password: ${error}` });
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

/** 
    * req: {
    *   headers: {
        *   Authorization: ~token~
        *   },
        *   body: {
            *   username: string,
            *   password: string (encoded),
            *   email: string
            *   }
            * }
            * Deletes the user and user profile details from the database
            * */
async function deleteUser(req: Request, res: Response) {
    try {
        validateRequest(req, res);
        return await Users.destroy({
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
