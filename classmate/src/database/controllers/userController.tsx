import { Request, Response } from 'express';
import User from '../models/user';

interface creationReq {
    email: String;
    username: String;
    password: String;
}

interface getUserReq {
    username: String;
}

async function createUser(req: Request, res: Response) {
    const { email, username, password }: creationReq = req.body;

    try {
        const user = await User.create({ username, email, password });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
async function logIn(req: Request, res: Response) {
    const { username }: getUserReq = req.body;
    try {
        const user = await User.findOne({
            where: {
                username: username
            }
        });
    } catch (err) {
        console.error(err);
    }
}
async function logOut(req: Request, res: Response) {
}
async function getProfile(req: Request, res: Response) {

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
