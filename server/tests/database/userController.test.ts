// Set up the express app with default routes first
require('module-alias/register');
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import authorizeUserRouter from '@server/routes/authorizeUserRoute';
import userRouter from '@server/routes/userRoutes';
import groupRouter from '@server/routes/groupRoutes';
import moduleRouter from '@server/routes/moduleRoutes';
import freeUserRouter from '@server/routes/freeUserRoutes';
import authorizeToken from '@server/middleware/auth';

const expressApp = express();

expressApp.use(express.json({ limit: '10mb' }));
expressApp.use(cors());
expressApp.use('/authorized', authorizeToken);
expressApp.use('/authorized', authorizeUserRouter);
expressApp.use('/authorized', userRouter);
expressApp.use('/authorized', groupRouter);
expressApp.use('/authorized', moduleRouter);
expressApp.use('/', freeUserRouter);

// Import all relevant libraries for mocking and testing
import request from 'supertest';
const app = request(expressApp);
import jwt from 'jsonwebtoken';
import config from '@server/config';

describe('Test the controllers for the database: ', () => {
    const auth = jwt.sign(
        {
            username: 'userTest',
            password: 'test123'
        },
        config.JWT_SECRET,
        { expiresIn: '5m' } // Expiry in 5 minutes
    );
    const mockBody = {
        email: 'usertest@gmail.com',
        username: 'userTest',
        password: 'test123',
        photo: {
            type: 'Buffer',
            data: [1, 2, 3]
        }
    };
    const mockBody1 = {
        email: 'usertest1@gmail.com',
        username: 'userTest1',
        password: 'test123',
        photo: {
            type: 'Buffer',
            data: [1, 2, 3, 4, 5, 6]
        }
    };
    const mockBody2 = {
        email: 'usertest2@gmail.com',
        username: 'lolol',
        password: 'test123',
        photo: {
            type: 'Buffer',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
    };

    // createUser
    test('createUser() on "/register" route should create new user properly', async () => {
        const wrongBodies = [];
        for (let wrongUsername of ['', 'testtest1']) {
            for (let wrongEmail of ['', 'test@gmail.com']) {
                for (let wrongPassword of ['', 'lolol']) {
                    for (let wrongPhoto of [[], [1, 2, 3]]) {
                        if (
                            wrongUsername === 'testtest1' &&
                            wrongEmail === 'test@gmail.com' &&
                            wrongPassword === 'lolol' &&
                            wrongPhoto.join(',') === '1,2,3'
                        ) {
                            continue;
                        }
                        wrongBodies.push({
                            email: wrongEmail,
                            username: wrongUsername,
                            password: wrongPassword,
                            photo: {
                                type: 'Buffer',
                                data: wrongPhoto
                            }
                        });
                    }
                }
            }
        }
        // Bodies with any missing arguments should return '`(missing body)` required!'
        await Promise.all(
            wrongBodies.map(async (wrongBody) => {
                const res = await app
                    .post('/register')
                    .send(wrongBody)
                    .expect(404);
                expect(res.status).toEqual(404);
                expect(res.body).toMatchObject({
                    message: expect.stringContaining(' required!')
                });
            })
        );

        // Correct body shold create user successfully!
        let res = await app.post('/register').send(mockBody).expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            message: 'User created successfully!'
        });
        res = await app.post('/register').send(mockBody1).expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            message: 'User created successfully!'
        });
        res = await app.post('/register').send(mockBody2).expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            message: 'User created successfully!'
        });
    });

    // Log in should work normally after user creation
    test('Log in should work after user creation', async () => {
        // Wrong username - should return user not found
        let res = await app
            .post('/login')
            .send({
                username: 'lolo12l3',
                password: 'test123'
            })
            .expect(404);
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject({
            message: 'User not found!'
        });

        // Wrong password - should return unauthorized
        res = await app
            .post('/login')
            .send({
                username: 'userTest',
                password: 'lolol'
            })
            .expect(401);
        expect(res.status).toEqual(401);
        expect(res.body).toMatchObject({
            message: 'Unauthorized!'
        });

        // Correct username and password - should return status 200
        res = await app
            .post('/login')
            .send({
                username: mockBody.username,
                password: mockBody.password
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'User authorized!',
            token: expect.any(String)
        });
        res = await app
            .post('/login')
            .send({
                username: mockBody1.username,
                password: mockBody1.password
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'User authorized!',
            token: expect.any(String)
        });
        res = await app
            .post('/login')
            .send({
                username: mockBody1.username,
                password: mockBody1.password
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'User authorized!',
            token: expect.any(String)
        });
    });

    // Search users should return correct search results
    test('searchUsers() handler should return list of search results', async () => {
        // No headers for authorization should return missing token
        let res = await app
            .get('/authorized/users')
            .query({ query: mockBody.username, limit: 0 })
            .expect(404);
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject({
            message: 'Token required!'
        });

        // Invalid headers for authorization should return unauthorized
        res = await app
            .get('/authorized/users')
            .set('Authorization', 'dkjnsdn3.d23kd')
            .query({ query: mockBody.username, limit: 0 })
            .expect(401);
        expect(res.status).toEqual(401);
        expect(res.body).toMatchObject({
            message: 'Unauthorized!'
        });

        // Searching should return correct search results
        res = await app
            .get('/authorized/users')
            .set('Authorization', auth)
            .query({ query: '', limit: 0 })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            users: [
                {
                    username: mockBody.username,
                    photo: mockBody.photo
                },
                {
                    username: mockBody1.username,
                    photo: mockBody1.photo
                },
                {
                    username: mockBody2.username,
                    photo: mockBody2.photo
                }
            ]
        });
        res = await app
            .get('/authorized/users')
            .set('Authorization', auth)
            .query({ query: 'userTe', limit: 0 })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            users: [
                {
                    username: mockBody.username,
                    photo: mockBody.photo
                },
                {
                    username: mockBody1.username,
                    photo: mockBody1.photo
                }
            ]
        });
        res = await app
            .get('/authorized/users')
            .set('Authorization', auth)
            .query({ query: 'lol', limit: 0 })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            users: [
                {
                    username: mockBody2.username,
                    photo: mockBody2.photo
                }
            ]
        });
    });

    // getProfile should return profile contents properly
    test('getProfile() handler should return profile details properly', async () => {
        // No headers for authorization should return missing token
        let res = await app
            .get('/authorized/profile')
            .query({ username: mockBody.username })
            .expect(404);
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject({
            message: 'Token required!'
        });

        // Invalid headers for authorization should return unauthorized
        res = await app
            .get('/authorized/profile')
            .set('Authorization', 'dkjnsdn3.d23kd')
            .query({ username: mockBody.username })
            .expect(401);
        expect(res.status).toEqual(401);
        expect(res.body).toMatchObject({
            message: 'Unauthorized!'
        });

        // Should return profile details correctly with the right headers!
        res = await app
            .get('/authorized/profile')
            .set('Authorization', auth)
            .query({ username: mockBody.username })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            username: mockBody.username,
            email: mockBody.email,
            photo: mockBody.photo
        });
        res = await app
            .get('/authorized/profile')
            .set('Authorization', auth)
            .query({ username: mockBody1.username })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            username: mockBody1.username,
            email: mockBody1.email,
            photo: mockBody1.photo
        });
        res = await app
            .get('/authorized/profile')
            .set('Authorization', auth)
            .query({ username: mockBody2.username })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            username: mockBody2.username,
            email: mockBody2.email,
            photo: mockBody2.photo
        });
    });

    // userController testing
    // updateProfilePhoto() should update profile photo properly
    test('updateProfilePhoto() should update the photo data', async () => {
        let res = await app
            .put('/authorized/profile/photo')
            .set('Authorization', auth)
            .send({
                username: mockBody.username,
                photo: mockBody2.photo
            })
            .expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            message: 'Photo updated!'
        });
        res = await app
            .put('/authorized/profile/photo')
            .set('Authorization', auth)
            .send({
                username: mockBody2.username,
                photo: mockBody1.photo
            })
            .expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            message: 'Photo updated!'
        });

        // Check that updated photos are correct
        res = await app
            .get('/authorized/profile')
            .set('Authorization', auth)
            .query({ username: mockBody.username })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            username: mockBody.username,
            email: mockBody.email,
            photo: mockBody2.photo
        });
        res = await app
            .get('/authorized/profile')
            .set('Authorization', auth)
            .query({ username: mockBody2.username })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            username: mockBody2.username,
            email: mockBody2.email,
            photo: mockBody1.photo
        });
    });

    test('logOut function should work well', async () => {
        let res = await app
            .post('/authorized/logout')
            .set('Authorization', auth)
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Logout successful!'
        });
    });

    // Delete user after tests are done
    test('Delete user after tests', async () => {
        let res = await app
            .delete('/authorized/delete-profile')
            .set('Authorization', auth)
            .query({ username: mockBody.username })
            .expect(204);
        expect(res.status).toEqual(204);
        res = await app
            .delete('/authorized/delete-profile')
            .set('Authorization', auth)
            .query({ username: mockBody1.username })
            .expect(204);
        expect(res.status).toEqual(204);
        res = await app
            .delete('/authorized/delete-profile')
            .set('Authorization', auth)
            .query({ username: mockBody2.username })
            .expect(204);
        expect(res.status).toEqual(204);
    });
});
