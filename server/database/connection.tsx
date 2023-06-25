import { Error as SequelizeError } from "sequelize";

const Sequelize = require('sequelize');

const sequelize = new Sequelize('classmate', 'root', 'Classmate123!', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});


sequelize.authenticate()
    .then(() => console.log('Connection to database established!'))
    .catch((err: SequelizeError): void => console.error("Unable to connect to database", err));

export default sequelize;
