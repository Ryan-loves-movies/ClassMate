import { SequelizeScopeError } from "sequelize";

const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'ClassMate123!1', {
    host: 'db.tubxvcrohjakulghoizg.supabase.co',
    port: 6543,
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => console.log('Connection to sqlite3 database established!'))
    .catch((err: SequelizeScopeError): void => console.log("Unable to connect to database", err));

export default sequelize;
