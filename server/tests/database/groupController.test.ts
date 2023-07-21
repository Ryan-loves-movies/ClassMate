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
import { sync } from '@models/SyncModels';

describe('Test the controllers for the database: ', () => {
    beforeAll(async () => {
        await sync();
    });

    const auth = jwt.sign(
        {
            username: 'groupTest',
            password: 'test123'
        },
        config.JWT_SECRET,
        { expiresIn: '5m' } // Expiry in 5 minutes
    );
    const mockBody = {
        email: 'grouptest@gmail.com',
        username: 'groupTest',
        password: 'test123',
        photo: {
            type: 'Buffer',
            data: [1, 2, 3]
        }
    };
    const mockBody1 = {
        email: 'grouptest1@gmail.com',
        username: 'groupTest1',
        password: 'test123',
        photo: {
            type: 'Buffer',
            data: [1, 2, 3, 4, 5, 6]
        }
    };
    const mockBody2 = {
        email: 'grouptest2@gmail.com',
        username: 'groupiee',
        password: 'test123',
        photo: {
            type: 'Buffer',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
    };
    const mockGroup = {
        groupName: 'test',
        moduleCode: 'CS2030',
        color: 'rgb(255, 255, 255, 0.8)',
        username: 'groupTest',
        ay: 2023,
        semester: 1
    };
    let groupId: number;

    // Create the users for the tests
    test('createUser() on "/register" route should create new user properly', async () => {
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

    // Try creating groups
    test('createGroup() on "/group" route should create new group properly', async () => {
        let res = await app
            .post('/authorized/group')
            .set('Authorization', auth)
            .send(mockGroup)
            .expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            moduleCode: 'CS2030',
            name: 'test',
            color: 'rgb(255, 255, 255, 0.8)'
        });
    });

    // Get groups should return correct groups
    test('getGroups() on "/group" route should create new group properly', async () => {
        let res = await app
            .get('/authorized/group/user')
            .set('Authorization', auth)
            .query({
                username: mockGroup.username,
                ay: mockGroup.ay,
                semester: mockGroup.semester
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body.groups).toMatchObject([
            {
                id: expect.any(Number),
                ay: mockGroup.ay,
                color: mockGroup.color,
                moduleCode: mockGroup.moduleCode
            }
        ]);
        groupId = res.body.groups[0].id;
    });

    // Should be able to add users to group
    test('addUserToGroup() on "/group/user" route should add user to group properly', async () => {
        let res = await app
            .put('/authorized/group/user')
            .set('Authorization', auth)
            .send({
                username: mockBody1.username,
                groupId: groupId
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'User added to group!'
        });
        res = await app
            .put('/authorized/group/user')
            .set('Authorization', auth)
            .send({
                username: mockBody2.username,
                groupId: groupId
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'User added to group!'
        });
    });

    // Remove user from group
    test('removeUserFromGroup() on "/group/user" route should add user to group properly', async () => {
        let res = await app
            .delete('/authorized/group/user')
            .set('Authorization', auth)
            .query({
                username: mockBody2.username,
                groupId: groupId
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Removed user!'
        });
    });

    // Get users in the group - mockBody and mockBody1
    test('getUsersInGroup() on "/group" route should add user to group properly', async () => {
        let res = await app
            .get('/authorized/group')
            .set('Authorization', auth)
            .query({
                groupId: groupId
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            users: expect.arrayContaining([
                {
                    username: mockBody1.username,
                    email: mockBody1.email,
                    photo: mockBody1.photo
                },
                {
                    username: mockBody.username,
                    email: mockBody.email,
                    photo: mockBody.photo
                }
            ])
        });
    });

    // Removing all users from group should delete group
    test('removeUserFromGroup() on "/group/user" route should add user to group properly', async () => {
        let res = await app
            .delete('/authorized/group/user')
            .set('Authorization', auth)
            .query({
                username: mockBody.username,
                groupId: groupId
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Removed user!'
        });
        res = await app
            .delete('/authorized/group/user')
            .set('Authorization', auth)
            .query({
                username: mockBody1.username,
                groupId: groupId
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Removed user!'
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
