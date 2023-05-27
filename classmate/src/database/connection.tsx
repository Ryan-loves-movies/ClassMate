const Sequelize = require('sequelize');

const sequelize = new Sequelize('orbital', 'root', 'Classmate123!', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Connection to database established!'))
    .catch((err: any): void => console.error("Unable to connect to database", err));

export default sequelize;
