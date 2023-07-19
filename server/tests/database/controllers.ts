import expressApp from '@server/server';
const request = require('supertest');
const app = request(expressApp);
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@server/config';
import { Request, Response } from 'express';

import validateRequest from '@controllers/authController';
import groupController from '@controllers/groupController';
const {
    getGroups,
    getUsersInGroup,
    createGroup,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup
} = groupController;
import moduleController from '@controllers/moduleController';
const {
    populateLessons,
    populateModules,
    hasModule,
    searchModules,
    getLessons,
    getPossibleLessonsForModule,
    getAllPossibleLessons,
    addModule,
    removeModule,
    updateLesson
} = moduleController;
import userController from '@controllers/userController';
const {
    searchUsers,
    createUser,
    logIn,
    logOut,
    getProfile,
    updateProfilePhoto,
    resetPassword,
    verifyEmail,
    deleteUser
} = userController;

// authController testing
// validateRequest should validate jwt token prroperly
test('validateRequest should validate the jwt token that has been issued correctly', () => {
    // Constants required for testing
    let hashedPassword = '';
    bcrypt.hash('test123', 10, (err, hashed) => {
        if (err) {
            console.log('Error in hashing bcrypt in test!', err);
        }
        if (hashed) {
            hashedPassword = hashed;
        }
    });

    const auth = jwt.sign(
        {
            username: 'testtest',
            password: hashedPassword
        },
        config.JWT_SECRET,
        { expiresIn: '1d' }
    );
    const headers = {
        headers: {
            Authorization: auth
        }
    };
    const wrongAuth = 'aercgvhbjnsa12321.xasdjj32';
    const emptyAuth = '';


    // Testing portion
    // Wrong token should return 401
    let res = app.get('/authenticate').set('Authorization', wrongAuth);
    expect(res.status).toEqual(401);
    res = app.get('/authenticate').set('Authorization', emptyAuth);
    expect(res.status).toEqual(401);
    // Missing headers should return 404
    res = app.get('/authenticate');
    expect(res.status).toEqual(404);
    // Correct headers with validated JWT should return decoded information
    expect(validateRequest(headers, {})).toEqual({
        username: 'testtest',
        password: hashedPassword
    });
});
