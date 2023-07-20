import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@server/config';
import Users from '@models/Users';

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
}
Verifies the JSON web token passed in request headers
**/
async function validateRequest(req: Request, res: Response) {
    const token = req.headers.authorization as string;

    if (!token || !token.trim()) {
        return res.status(404).json({ message: 'Token required!' });
    }

    return await new Promise((resolve, reject) =>
        jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
            if (err) {
                reject(err);
            }
            // Check if decoded password is correct for user
            if (decoded) {
                const username = (decoded as JwtPayload).username as string;
                const password = (decoded as JwtPayload).password as string;
                const user = await Users.findByPk(username, {
                    attributes: ['password']
                }).catch((err) => reject(err));
                await bcrypt
                    .compare(password, user?.password as string)
                    .then((authenticated) => {
                        if (authenticated) {
                            resolve('');
                        } else {
                            reject('Wrong password!');
                        }
                    })
                    .catch((err) => reject(err));
            } else {
                reject('False JWT hash!');
            }
        })
    )
        .then(() => res.status(200).json({ message: 'User authorized!' }))
        .catch((err) =>
            res.status(401).json({ message: 'Unauthorized!', error: err })
        );
}

export default validateRequest;
