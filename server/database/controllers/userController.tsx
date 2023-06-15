// User for connection with mySQL and { Request, Response } with express api
import User from '@server/database/models/user.jsx';
import config from '@server/config.jsx';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
                return User.create({ username: username, email: email, password: hashedPassword });
            }
        });
        res.status(201).json({ message: 'User created successfully!' });
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
        await User.findOne({
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
                        message: 'User authenticated',
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
        return await User.findOne({
            where: {
                username: username
            }
        }).then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'No existing user found' });
            }

            if (req.query.mods === 'true') {
                return res.status(200).json({
                    username: user.get("username"),
                    email: user.get("email"),

                    mods: [
                        {
                            code: user.get('mod1'),
                            lecture: {
                                code: user.get('mod1LecCode'),
                                day: user.get('mod1LecDay'),
                                startTime: user.get('mod1LecStartTime'),
                                endTime: user.get('mod1LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod1TutCode'),
                                day: user.get('mod1TutDay'),
                                startTime: user.get('mod1TutStartTime'),
                                endTime: user.get('mod1TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod1LabCode'),
                                day: user.get('mod1LabDay'),
                                startTime: user.get('mod1LabStartTime'),
                                endTime: user.get('mod1LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod2'),
                            lecture: {
                                code: user.get('mod2LecCode'),
                                day: user.get('mod2LecDay'),
                                startTime: user.get('mod2LecStartTime'),
                                endTime: user.get('mod2LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod2TutCode'),
                                day: user.get('mod2TutDay'),
                                startTime: user.get('mod2TutStartTime'),
                                endTime: user.get('mod2TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod2LabCode'),
                                day: user.get('mod2LabDay'),
                                startTime: user.get('mod2LabStartTime'),
                                endTime: user.get('mod2LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod3'),
                            lecture: {
                                code: user.get('mod3LecCode'),
                                day: user.get('mod3LecDay'),
                                startTime: user.get('mod3LecStartTime'),
                                endTime: user.get('mod3LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod3TutCode'),
                                day: user.get('mod3TutDay'),
                                startTime: user.get('mod3TutStartTime'),
                                endTime: user.get('mod3TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod3LabCode'),
                                day: user.get('mod3LabDay'),
                                startTime: user.get('mod3LabStartTime'),
                                endTime: user.get('mod3LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod4'),
                            lecture: {
                                code: user.get('mod4LecCode'),
                                day: user.get('mod4LecDay'),
                                startTime: user.get('mod4LecStartTime'),
                                endTime: user.get('mod4LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod4TutCode'),
                                day: user.get('mod4TutDay'),
                                startTime: user.get('mod4TutStartTime'),
                                endTime: user.get('mod4TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod4LabCode'),
                                day: user.get('mod4LabDay'),
                                startTime: user.get('mod4LabStartTime'),
                                endTime: user.get('mod4LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod5'),
                            lecture: {
                                code: user.get('mod5LecCode'),
                                day: user.get('mod5LecDay'),
                                startTime: user.get('mod5LecStartTime'),
                                endTime: user.get('mod5LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod5TutCode'),
                                day: user.get('mod5TutDay'),
                                startTime: user.get('mod5TutStartTime'),
                                endTime: user.get('mod5TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod5LabCode'),
                                day: user.get('mod5LabDay'),
                                startTime: user.get('mod5LabStartTime'),
                                endTime: user.get('mod5LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod6'),
                            lecture: {
                                code: user.get('mod6LecCode'),
                                day: user.get('mod6LecDay'),
                                startTime: user.get('mod6LecStartTime'),
                                endTime: user.get('mod6LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod6TutCode'),
                                day: user.get('mod6TutDay'),
                                startTime: user.get('mod6TutStartTime'),
                                endTime: user.get('mod6TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod6LabCode'),
                                day: user.get('mod6LabDay'),
                                startTime: user.get('mod6LabStartTime'),
                                endTime: user.get('mod6LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod7'),
                            lecture: {
                                code: user.get('mod7LecCode'),
                                day: user.get('mod7LecDay'),
                                startTime: user.get('mod7LecStartTime'),
                                endTime: user.get('mod7LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod7TutCode'),
                                day: user.get('mod7TutDay'),
                                startTime: user.get('mod7TutStartTime'),
                                endTime: user.get('mod7TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod7LabCode'),
                                day: user.get('mod7LabDay'),
                                startTime: user.get('mod7LabStartTime'),
                                endTime: user.get('mod7LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod8'),
                            lecture: {
                                code: user.get('mod8LecCode'),
                                day: user.get('mod8LecDay'),
                                startTime: user.get('mod8LecStartTime'),
                                endTime: user.get('mod8LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod8TutCode'),
                                day: user.get('mod8TutDay'),
                                startTime: user.get('mod8TutStartTime'),
                                endTime: user.get('mod8TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod8LabCode'),
                                day: user.get('mod8LabDay'),
                                startTime: user.get('mod8LabStartTime'),
                                endTime: user.get('mod8LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod9'),
                            lecture: {
                                code: user.get('mod9LecCode'),
                                day: user.get('mod9LecDay'),
                                startTime: user.get('mod9LecStartTime'),
                                endTime: user.get('mod9LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod9TutCode'),
                                day: user.get('mod9TutDay'),
                                startTime: user.get('mod9TutStartTime'),
                                endTime: user.get('mod9TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod9LabCode'),
                                day: user.get('mod9LabDay'),
                                startTime: user.get('mod9LabStartTime'),
                                endTime: user.get('mod9LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod10'),
                            lecture: {
                                code: user.get('mod10LecCode'),
                                day: user.get('mod10LecDay'),
                                startTime: user.get('mod10LecStartTime'),
                                endTime: user.get('mod10LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod10TutCode'),
                                day: user.get('mod10TutDay'),
                                startTime: user.get('mod10TutStartTime'),
                                endTime: user.get('mod10TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod10LabCode'),
                                day: user.get('mod10LabDay'),
                                startTime: user.get('mod10LabStartTime'),
                                endTime: user.get('mod10LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod11'),
                            lecture: {
                                code: user.get('mod11LecCode'),
                                day: user.get('mod11LecDay'),
                                startTime: user.get('mod11LecStartTime'),
                                endTime: user.get('mod11LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod11TutCode'),
                                day: user.get('mod11TutDay'),
                                startTime: user.get('mod11TutStartTime'),
                                endTime: user.get('mod11TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod11LabCode'),
                                day: user.get('mod11LabDay'),
                                startTime: user.get('mod11LabStartTime'),
                                endTime: user.get('mod11LabEndTime')
                            }
                        },

                        {
                            code: user.get('mod12'),
                            lecture: {
                                code: user.get('mod12LecCode'),
                                day: user.get('mod12LecDay'),
                                startTime: user.get('mod12LecStartTime'),
                                endTime: user.get('mod12LecEndTime')
                            },
                            tutorial: {
                                code: user.get('mod12TutCode'),
                                day: user.get('mod12TutDay'),
                                startTime: user.get('mod12TutStartTime'),
                                endTime: user.get('mod12TutEndTime'),
                            },
                            lab: {
                                code: user.get('mod12LabCode'),
                                day: user.get('mod12LabDay'),
                                startTime: user.get('mod12LabStartTime'),
                                endTime: user.get('mod12LabEndTime')
                            }
                        }
                    ]

                });
            }
            return res.status(200).json({
                username: user.get("username"),
                email: user.get("email"),
            });
        });
    } catch (err) {
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
        await User.findOne({
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
            User.update(updatedDet, {
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
        return await User.update(req.body, {
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
