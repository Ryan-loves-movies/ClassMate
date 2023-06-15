const Sequelize = require('sequelize');

// const sequelize = new Sequelize('classmate', 'rtyt', 'Database.2023', {
//     host: 'rtyt.cif3jijsurfi.ap-southeast-2.rds.amazonaws.com',
//     port: 3306,
//     dialect: 'mysql',
// });

const sequelize = new Sequelize('classmate', 'root', 'Classmate123!', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});


sequelize.authenticate()
    .then(() => console.log('Connection to database established!'))
    .catch((err: any): void => console.error("Unable to connect to database", err));

export default sequelize;
