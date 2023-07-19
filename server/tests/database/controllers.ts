import expressApp from '@server/server';
const request = require('supertest');
const app = request(expressApp);
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@server/config';

// authController testing
// validateRequest should validate jwt token prroperly
test('validateRequest() on "/user" route should validate the jwt token that has been issued correctly', () => {
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
    const wrongAuth = 'aercgvhbjnsa12321.xasdjj32';
    const emptyAuth = '';

    // Testing portion
    // Wrong token should return 401
    let res = app.get('/authenticate').set('Authorization', wrongAuth);
    expect(res.status).toEqual(401);
    // Empty token should also return 401
    res = app.get('/authenticate').set('Authorization', emptyAuth);
    expect(res.status).toEqual(401);
    // Missing headers should return 404
    res = app.get('/authenticate');
    expect(res.status).toEqual(404);
    // Correct headers with validated JWT should return decoded information
    res = app.get('/authenticate').set('Authorization', auth);
    expect(res.status).toEqual(200);
});

// async function createGroup(req: Request, res: Response) {
//     const { groupName, moduleCode, color, username, ay, semester } = req.body;
//     const actAy = parseInt(ay);
//     const actSem = parseInt(semester);
//
//     await Modules.findOne({
//         where: {
//             code: {
//                 [Op.iLike]: `${moduleCode}`
//             }
//         }
//     })
//         .then(async (module) => {
//             const moduleCode = module?.code as string;
//             const group = await Groups.create({
//                 name: groupName,
//                 moduleCode: moduleCode,
//                 color: color,
//                 ay: actAy,
//                 sem: actSem
//             });
//             const user = await Users.findByPk(username, {
//                 include: [
//                     {
//                         model: Groups
//                     }
//                 ]
//             });
//             await group.addUser(user as Users);
//
//             return res.status(200).json({
//                 id: group.id,
//                 moduleCode: moduleCode,
//                 name: groupName,
//                 color: color
//             });
//         })
//         .catch(() => {
//             return res.status(404).json({ message: 'Module does not exist!' });
//         });
// }
// // groupController tests
// test('createGroup() on "/group" route should create group in database and return group details in response', () => {
//     let mockBody = {
//         groupName: 'testtest',
//         moduleCode: 'CS2030',
//         color: 'rgb(255,255,255,0.8)',
//         username: 'testtesttest',
//         ay: '2023',
//         semester: '1'
//     }
//
//     let res = 
//
// })
// test('getGroups() on "/group/user" route should return groups that user is in correctly')
//
// expressRouter.get('/group/user', getGroups);
// expressRouter.get('/group', getUsersInGroup);
// expressRouter.post('/group', createGroup);
// expressRouter.delete('/group', deleteGroup);
// expressRouter.delete('/group/user', removeUserFromGroup);
// expressRouter.put('/group/user', addUserToGroup);
// expressRouter.put('/group/optimize', generateTimetable);
//
// // import validateRequest from '@controllers/authController';
// // import groupController from '@controllers/groupController';
// // const {
// //     getGroups,
// //     getUsersInGroup,
// //     createGroup,
// //     deleteGroup,
// //     addUserToGroup,
// //     removeUserFromGroup
// // } = groupController;
// // import moduleController from '@controllers/moduleController';
// // const {
// //     populateLessons,
// //     populateModules,
// //     hasModule,
// //     searchModules,
// //     getLessons,
// //     getPossibleLessonsForModule,
// //     getAllPossibleLessons,
// //     addModule,
// //     removeModule,
// //     updateLesson
// // } = moduleController;
// // import userController from '@controllers/userController';
// // const {
// //     searchUsers,
// //     createUser,
// //     logIn,
// //     logOut,
// //     getProfile,
// //     updateProfilePhoto,
// //     resetPassword,
// //     verifyEmail,
// //     deleteUser
// // } = userController;
