import { SequelizeScopeError } from "sequelize";

const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "src/sqlite/modules.db"
});

sequelize.authenticate()
    .then(() => console.log('Connection to sqlite3 database established!'))
    .catch((err: SequelizeScopeError): void => console.log("Unable to connect to database", err));

export default sequelize;
