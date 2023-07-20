// Users for connection with mySQL and { Request, Response } with express api
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@server/config';
import Users from '@models/Users';

import { userLogIn } from '@interfaces/user';

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

    if (limit === 0) {
        await Users.findAll({
            where: {
                username: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['username', 'photo']
        })
            .then((ans) =>
                res
                    .status(200)
                    .json({ users: ans.map((model) => model.toJSON()) })
            )
            .catch((err) =>
                res.status(404).json({ message: 'No users found!', error: err })
            );
    } else {
        await Users.findAll({
            limit: limit,
            where: {
                username: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['username', 'photo']
        })
            .then((ans) =>
                res
                    .status(200)
                    .json({ users: ans.map((model) => model.toJSON()) })
            )
            .catch((err) =>
                res.status(404).json({ message: 'No users found!', error: err })
            );
    }
};

/**
    Creates new user with empty details in the database
@param req: {
    body: {
        username: string,
        password: string (encoded),
        email: string,
        photo: blob
    }
}
@param res {express.Response}
@returns void
**/
const createUser = async (req: Request, res: Response) => {
    const { email, username, password, photo } = req.body;

    if (!username) {
        return res.status(404).json({ message: 'Username required!' });
    }
    if (!email) {
        return res.status(404).json({ message: 'Email required!' });
    }
    if (!password) {
        return res.status(404).json({ message: 'Password required!' });
    }
    if (photo.data.length === 0) {
        return res.status(404).json({ message: 'Photo required!' });
    }

    return bcrypt
        .hash(password, saltRounds)
        .then(async (hashedPassword) => {
            if (hashedPassword) {
                await Users.create(
                    {
                        username: username,
                        email: email,
                        password: hashedPassword,
                        photo: photo.data
                    },
                    { ignoreDuplicates: true }
                );
                return res
                    .status(201)
                    .json({ message: 'User created successfully!' });
            } else {
                throw Error('Could not hash password!');
            }
        })
        .catch((err) =>
            res.status(500).json({ message: 'Server Error!', error: err })
        );
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
    return await Users.findByPk(username, {
        attributes: ['username', 'password']
    })
        .then(async (user) => {
            return await bcrypt
                .compare(password, user?.password as string)
                .then((authenticated) => {
                    if (authenticated) {
                        const token = jwt.sign(
                            req.body as userLogIn,
                            config.JWT_SECRET,
                            {
                                expiresIn: '1d'
                            }
                        );
                        return res.status(200).json({
                            message: 'User authorized!',
                            token: token
                        });
                    } else {
                        return res.status(401).json({
                            message: 'Unauthorized!'
                        });
                    }
                });
        })
        .catch((err) => {
            return res
                .status(404)
                .json({ message: 'User not found!', error: err });
        });
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
async function logOut(req: Request, res: Response) {
    // Clear JWT token on client-side AND invalidate token on server-side
    return res.status(200).json({ message: 'Logout successful!' });
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
    const username = req.query.username as string;
    if (!username) {
        return res.status(400).json({ message: 'Username required!' });
    }

    return await Users.findByPk(username, {
        attributes: ['username', 'email', 'photo']
    })
        .then((user) => {
            return res.status(200).json({
                username: user?.username,
                email: user?.email,
                photo: user?.photo
            });
        })
        .catch((err) =>
            res.status(404).json({ message: 'User not found!', error: err })
        );
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
        .then(async (user) => {
            await user?.update({
                photo: photo.data
            });
            return res.status(201).json({ message: 'Photo updated!' });
        })
        .catch(() => {
            return res.status(404).json({ message: 'User not found!' });
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
                res.status(201).json({
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
    const username = req.query.username as string;

    return await Users.destroy({
        where: {
            username: username
        }
    })
        .then((rowsDeleted: number) => {
            // console.log(`Deleted ${rowsDeleted} rows.`);
            return res.status(204).json({});
        })
        .catch((err) => {
            console.log(
                'Error when updating profile in deleteUser() - line 501 in userController.tsx\n',
                err
            );
            return res
                .status(404)
                .json({ message: 'User could not be found!' });
        });
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
