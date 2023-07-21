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
// import bcrypt from 'bcrypt';
import config from '@server/config';

describe('Test the controllers for the database: ', () => {
    const auth = jwt.sign(
        {
            username: 'authTest',
            password: 'test123'
        },
        config.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Need to create user first for verification later
    test('create user for testing:', async () => {
        const mockBody = {
            username: 'authTest',
            password: 'test123',
            email: 'authtest@gmail.com',
            photo: {
                type: 'Buffer',
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }
        };
        const res = await app.post('/register').send(mockBody).expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            message: 'User created successfully!'
        });
    });

    // validateRequest should validate jwt token prroperly
    test('validateRequest() on "/user" route should validate the jwt token that has been issued correctly', async () => {
        // Constants required for testing
        const emptyAuth = '';
        const wrongAuth = 'aercgvhbjnsa12321.xasdjj32';

        // Testing portion
        // Wrong token should return 401
        let res = await app
            .get('/authorized/user')
            .set('Authorization', wrongAuth)
            .expect(401);
        expect(res.status).toEqual(401);
        expect(res.body).toMatchObject({
            message: 'Unauthorized!'
        });

        // Empty token should return 404
        res = await app
            .get('/authorized/user')
            .set('Authorization', emptyAuth)
            .expect(404);
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject({
            message: 'Token required!'
        });

        // Missing headers should return 404
        res = await app.get('/authorized/user').expect(404);
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject({
            message: 'Token required!'
        });

        // Correct headers with validated JWT should return decoded information
        res = await app
            .get('/authorized/user')
            .set('Authorization', auth)
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'User authorized!'
        });
    });

    // Delete user after tests are done
    test('Delete user after tests', async () => {
        const res = await app
            .delete('/authorized/delete-profile')
            .set('Authorization', auth)
            .query({ username: 'authTest' })
            .expect(204);
        expect(res.status).toEqual(204);
    });
});
