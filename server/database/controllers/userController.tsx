// Users for connection with mySQL and { Request, Response } with express api
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@server/config';
import Users from '@models/Users';
import { Op } from 'sequelize';

import { userCreator, userLogIn } from '@interfaces/user';

// Number of iterative hashing for password encryption
const saltRounds = 10;

/**
    Creates new user with empty details in the database
@param req: {
    params: {
        query: string,
        limit: number
    }
}
@param res {express.Response}
@returns void
**/
const searchUsers = async (req: Request, res: Response) => {
    const query = req.query.query as string;
    const limit = parseInt(req.query.limit as string);
    let ans;

    if (limit === 0) {
        ans = await Users.findAll({
            where: {
                username: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['username', 'photo']
        });
    } else {
        ans = await Users.findAll({
            limit: limit,
            where: {
                username: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['username', 'photo']
        });
    }

    res.status(200).json({ users: ans.map((model) => model.toJSON()) });
    return ans;
};

/**
    Creates new user with empty details in the database
@param req: {
    body: {
        username: string,
        password: string (encoded),
        email: string
    }
}
@param res {express.Response}
@returns void
**/
const createUser = (req: Request, res: Response) => {
    const { email, username, password }: userCreator = req.body;

    try {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                throw err;
            }
            if (hashedPassword) {
                return Users.create(
                    {
                        username: username,
                        email: email,
                        password: hashedPassword
                    },
                    { ignoreDuplicates: true }
                );
            }
        });
        res.status(201).json({ message: 'Users created successfully!' });
    } catch (err) {
        console.log(
            'Error while making new user in createUser() - userController.tsx, line 65\n',
            err
        );
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
    req: {
    body: {
        username: string,
        password: string (encoded),
    }
}
Verifies password of user, then returns a JSON web token with expiry in 24 hours.
    **/
async function logIn(req: Request, res: Response) {
    const { username, password }: userLogIn = req.body;
    try {
        await Users.findByPk(username, {
            attributes: ['username', 'password']
        }).then((user) => {
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'No existing user found' });
            }
            bcrypt.compare(
                password,
                user.password as string,
                (err, authenticated) => {
                    if (err) {
                        throw err;
                    }
                    if (authenticated) {
                        const token = jwt.sign(req.body, config.JWT_SECRET, {
                            expiresIn: '1d'
                        });
                        return res.status(200).json({
                            message: 'Users authenticated',
                            token: token
                        });
                    } else {
                        return res.status(401).json({
                            message:
                                'Wrong password or something wrong with server!'
                        });
                    }
                }
            );
        });
    } catch (err) {
        console.log(
            'Error while logging in in logIn() function in userController.tsx - line 95\n',
            err
        );
    }
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
}
Verifies token of user, then return log out successful message. 
    Note: Deletion of JSON web token to be done on client side
**/
async function logOut(res: Response) {
    // Clear JWT token on client-side AND invalidate token on server-side
    res.status(200).json({ message: 'Logout successful!' });
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    params: {
        username: string,
        mods: ~boolean~
    }
}
Search for the user profile on the database and returns first matching username.
        If mods is true, return all module details of user profile
    Else, only return username and email
**/
async function getProfile(req: Request, res: Response) {
    try {
        const username = req.query.username as string;
        if (!username) {
            res.status(500).json({ message: 'No username passed in params' });
            return;
        }
        /* if (req.query.mods === 'false') { */
        return await Users.findByPk(username).then((user) => {
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'No existing user found' });
            }
            return res.status(200).json({
                username: user.get('username'),
                email: user.get('email'),
                photo: user.get('photo')
            });
        });
    } catch (err) {
        console.log(
            'Error while getting profile details in getProfile() - userController.tsx - line 400?\n',
            err
        );
    }
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        photo: blob
    }
}
Updates the values of the user profile in the database and returns the number of values updated
**/
async function updateProfilePhoto(req: Request, res: Response) {
    const { username, photo } = req.body;
    return await Users.findByPk(username)
        .then((user) => {
            user?.update({
                photo: photo.data
            });
            res.status(200).json({ message: 'photo updated!' });
        })
        .catch(() => {
            res.status(404).json({ message: 'user not found!' });
        });
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        oldPassword: ~oldPassword~ (encoded),
        newPassword: ~newPassword~ (encoded)
    }
}
Resets the passowrd of the user profile in the database
**/
async function resetPassword(req: Request, res: Response) {
    // Do user authentication first
    // Update password after
    try {
        return await Users.update(req.body, {
            where: {
                password: req.body.password
            }
        })
            .then((rowsUpdated: number[]) => {
                res.status(200).json({
                    message: `Updated ${rowsUpdated} rows.`
                });
            })
            .catch((error: Error) => {
                res.status(200).json({
                    message: `Error updating row for password: ${error}`
                });
            });
    } catch (err) {
        console.log(
            'Error when updating profile in resetPassword() - line 462 in userController.tsx\n',
            err
        );
    }
}

async function verifyEmail(req: Request, res: Response) {
    try {
        return res.json({ message: 'Email verified???????' });
    } catch (err) {
        console.log(
            'Error when updating profile in verifyEmail() - line 471 in userController.tsx\n',
            err
        );
    }
}

/**
    req: {
    headers: {
        Authorization: ~token~
    },
    body: {
        username: string,
        password: string (encoded),
        email: string
    }
}
Deletes the user and user profile details from the database
**/
async function deleteUser(req: Request, res: Response) {
    try {
        return await Users.destroy({
            where: {
                username: req.body.username
            }
        }).then((rowsDeleted: number) => {
            console.log(`Deleted ${rowsDeleted} rows.`);
            return res.status(200).json({ message: 'user deleted!' });
        });
    } catch (err) {
        console.log(
            'Error when updating profile in deleteUser() - line 501 in userController.tsx\n',
            err
        );
        return res.status(404).json({ message: 'user could not be found!' });
    }
}

export default {
    searchUsers,
    createUser,
    logIn,
    logOut,
    getProfile,
    updateProfilePhoto,
    resetPassword,
    verifyEmail,
    deleteUser
};
