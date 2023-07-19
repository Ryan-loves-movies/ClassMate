import expressApp from '@server/server';
const request = require('supertest');
const app = request(expressApp);
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@server/config';
import sequelize, { createSequelizeConnection } from 'database/connection';
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

