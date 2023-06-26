import { Error as SequelizeError } from "sequelize";

const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'ClassMate123!1', {
    host: 'db.tubxvcrohjakulghoizg.supabase.co',
    port: 6543,
    dialect: 'postgres'
});


sequelize.authenticate()
    .then(() => console.log('Connection to database established!'))
    .catch((err: SequelizeError): void => console.error("Unable to connect to database", err));

export default sequelize;
