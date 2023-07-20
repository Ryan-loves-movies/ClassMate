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
            username: 'modTest',
            password: 'test123'
        },
        config.JWT_SECRET,
        { expiresIn: '5m' } // Expiry in 5 minutes
    );
    const mockBody = {
        email: 'grouptest@gmail.com',
        username: 'modTest',
        password: 'test123',
        photo: {
            type: 'Buffer',
            data: [1, 2, 3]
        }
    };
    test('hasModule() should perform case insensitive search and should not mix modules up', async () => {
        let res = await app
            .get('/authorized/module')
            .set('Authorization', auth)
            .query({
                moduleCode: 'CS203',
                ay: 2023,
                semester: 1
            })
            .expect(404);
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject({
            message: 'Module does not exist!'
        });
        res = await app
            .get('/authorized/module')
            .set('Authorization', auth)
            .query({
                moduleCode: 'S2030',
                ay: 2023,
                semester: 1
            })
            .expect(404);
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject({
            message: 'Module does not exist!'
        });

        // Correct queries for modules should be successful
        res = await app
            .get('/authorized/module')
            .set('Authorization', auth)
            .query({
                moduleCode: 'CS2030',
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Module exists!'
        });
        res = await app
            .get('/authorized/module')
            .set('Authorization', auth)
            .query({
                moduleCode: 'CS2030S',
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Module exists!'
        });
    });

    test('searchModule() should perform case insensitive search', async () => {
        // Correct queries for modules should be successful
        let res = await app
            .get('/authorized/search/modules')
            .set('Authorization', auth)
            .query({
                query: 'CS2030',
                limit: 0,
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            modules: expect.arrayContaining([
                {
                    code: 'CS2030',
                    name: 'Programming Methodology II'
                },
                {
                    code: 'CS2030S',
                    name: 'Programming Methodology II'
                }
            ])
        });
        res = await app
            .get('/authorized/search/modules')
            .set('Authorization', auth)
            .query({
                query: 'BT1101',
                limit: 0,
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            modules: expect.arrayContaining([
                {
                    code: 'BT1101',
                    name: 'Introduction to Business Analytics'
                }
            ])
        });
    });

    // Create the users for the tests
    test('createUser() on "/register" route should create new user properly', async () => {
        // Correct body shold create user successfully!
        let res = await app.post('/register').send(mockBody).expect(201);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject({
            message: 'User created successfully!'
        });
    });

    test('addModule() should add module for user', async () => {
        let res = await app
            .put('/authorized/module')
            .set('Authorization', auth)
            .send({
                username: mockBody.username,
                moduleCode: 'CS2030',
                lessons: [],
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Module added with default lessons!'
        });
    });

    test('getLessons() should find all lessons associated with user', async () => {
        let res = await app
            .get('/authorized/lessons')
            .set('Authorization', auth)
            .query({
                username: mockBody.username,
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            username: 'modTest',
            modules: expect.arrayContaining([
                {
                    code: 'CS2030',
                    name: 'Programming Methodology II',
                    lessons: expect.arrayContaining([
                        {
                            id: 2796,
                            lessonId: '12C',
                            moduleCode: 'CS2030',
                            lessonType: 'Laboratory',
                            ay: 2023,
                            sem: 1,
                            weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            venue: 'COM4-02-05',
                            day: 'Friday',
                            startTime: '1200',
                            endTime: '1400',
                            size: 24,
                            chosen: true,
                            fixed: false
                        },
                        {
                            id: 2801,
                            lessonId: '05',
                            moduleCode: 'CS2030',
                            lessonType: 'Recitation',
                            ay: 2023,
                            sem: 1,
                            weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            venue: 'COM3-01-21',
                            day: 'Thursday',
                            startTime: '1100',
                            endTime: '1200',
                            size: 45,
                            chosen: true,
                            fixed: false
                        },
                        {
                            id: 2792,
                            lessonId: '1',
                            moduleCode: 'CS2030',
                            lessonType: 'Lecture',
                            ay: 2023,
                            sem: 1,
                            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            venue: 'LT19',
                            day: 'Monday',
                            startTime: '1200',
                            endTime: '1400',
                            size: 240,
                            chosen: true,
                            fixed: true
                        }
                    ])
                }
            ])
        });
    });
    // expressRouter.get('/search/modules', searchModules);
    // expressRouter.get('/module', hasModule);
    // expressRouter.put('/module', addModule);
    // expressRouter.delete('/module', removeModule);
    // expressRouter.put('/lessons', updateLesson);
    // expressRouter.get('/lessons', getLessons);
    // expressRouter.get('/module/lessons', getPossibleLessonsForModule);
    // expressRouter.get('/all/lessons', getAllPossibleLessons);

    test('updateLesson() should update lessons accordingly', async () => {
        let res = await app
            .put('/authorized/lessons')
            .set('Authorization', auth)
            .send({
                username: mockBody.username,
                lessonIds: [2793, 2798, 2839]
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Lesson updated!'
        });
    });

    test('getLessons() after updating should reflect update', async () => {
        let res = await app
            .get('/authorized/lessons')
            .set('Authorization', auth)
            .query({
                username: mockBody.username,
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            modules: expect.arrayContaining([
                {
                    code: 'CS2030',
                    lessons: expect.arrayContaining([
                        {
                            ay: 2023,
                            chosen: true,
                            day: 'Monday',
                            endTime: '1400',
                            fixed: true,
                            id: 2792,
                            lessonId: '1',
                            lessonType: 'Lecture',
                            moduleCode: 'CS2030',
                            sem: 1,
                            size: 240,
                            startTime: '1200',
                            venue: 'LT19',
                            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                        },
                        {
                            ay: 2023,
                            chosen: true,
                            day: 'Friday',
                            endTime: '1400',
                            fixed: false,
                            id: 2793,
                            lessonId: '12B',
                            lessonType: 'Laboratory',
                            moduleCode: 'CS2030',
                            sem: 1,
                            size: 24,
                            startTime: '1200',
                            venue: 'COM4-02-04',
                            weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                        },
                        {
                            ay: 2023,
                            chosen: true,
                            day: 'Wednesday',
                            endTime: '1100',
                            fixed: false,
                            id: 2798,
                            lessonId: '01',
                            lessonType: 'Recitation',
                            moduleCode: 'CS2030',
                            sem: 1,
                            size: 45,
                            startTime: '1000',
                            venue: 'COM3-01-21',
                            weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                        }
                    ]),
                    name: 'Programming Methodology II'
                }
            ]),
            username: 'modTest'
        });
    });

    test('removeModule() should find all lessons associated with user', async () => {
        let res = await app
            .delete('/authorized/module')
            .set('Authorization', auth)
            .query({
                username: mockBody.username,
                moduleCode: 'CS2030',
                ay: 2023,
                semester: 1
            })
            .expect(200);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
            message: 'Module removed!'
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
    });
});
