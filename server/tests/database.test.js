import expressApp from '@server/server';
const request = require('supertest');
const app = request(expressApp);
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@server/config';
import sequelize, { createSequelizeConnection } from 'database/connection';
import validateRequest from "@controllers/authController";
import groupController from "@controllers/groupController";
const { getGroupId, createGroup, deleteGroup, addUserToGroup, removeUserFromGroup } = groupController;
import moduleController from "@controllers/moduleController";
const { addModule, removeModule, updateLesson } = moduleController;
import userController from "@controllers/userController";
const { createUser, logIn, logOut, getProfile, updateProfile, resetPassword, verifyEmail, deleteUser } = userController;
import authenticateToken from '@server/middleware/auth';
import validateUser from '@server/utils/validation';
import { regUsername, regPassword, regEmail } from '@server/utils/validation';
import { Request, Response } from 'express';
import { require } from 'yargs';

let hashedPassword = '';
bcrypt.hash('test123', 10, (err, hashed) => {
    if (err) {
        console.log('Error in hashing bcrypt in test!', err);
    }
    if (hashed) {
        hashedPassword = hashed;
    }
});

const auth = jwt.sign({
    username: 'testtest',
    password: hashedPassword
}, config.JWT_SECRET, { expiresIn: '1d' });
const headers = {
    headers: {
        Authorization: auth
    }
}
const wrongAuth = 'aercgvhbjnsa12321.xasdjj32';
const emptyAuth = '';

// Test connection to database
test('createSequelizeConnection should create a Sequelize connection to the database', () => {
    expect(createSequelizeConnection(sequelize)).toEqual('Connection to database established!');
});

// validateRequest should validate jwt token prroperly
test('validateRequest should validate the jwt token that has been issued correctly', () => {
    // Wrong token should return 401
    let res = app
        .get('/authenticate')
        .set('Authorization', wrongAuth);
    expect(res.status).toEqual(401);
    res = app
        .get('/authenticate')
        .set('Authorization', emptyAuth);
    expect(res.status).toEqual(401);
    // Missing headers should return 404
    res = app
        .get('/authenticate');
    expect(res.status).toEqual(404);
    // Correct headers with validated JWT should return decoded information
    expect(validateRequest(headers, {})).toEqual({
        username: 'testtest',
        password: hashedPassword
    });
});

test('sending a post request to /group should create a new group', () => {
    const res = app
        .post('/group');
});

    res = app
        .delete('/group');

    res = app
        .get('/group/user');

    res = app
        .delete('/group/user');

    res = app
        .put('/group/user');

    res = app
        .put('/modules');

    res = app
        .delete('/modules');

    res = app
        .put('/lessons');

    res = app
        .post('/register')
        .set('Authorization', jwt.sign({
            username: test,
            password: hashedPassword
        }, config.JWT_SECRET, { expiresIn: '1d' }));
    expect(res.status).toBe(200);

    res = app
        .post('/login');

    res = app
        .post('/logut');

    res = app
        .get('/profile');

    res = app
        .put('/profile');

    res = app
        .post('/reset-password');

    res = app
        .get('/verify-email/:token');

    res = app
        .delete('/delete-profile');
