import { Sequelize } from 'sequelize';

// For development
const sequelize = new Sequelize('ClassMate', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    // logging: false
    // logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

// // For testing
// const sequelize = new Sequelize('ClassMateTest', 'postgres', 'postgres', {
//     host: 'localhost',
//     port: 5432,
//     dialect: 'postgres',
//     logging: false
//     // logging: process.env.NODE_ENV === 'production' ? false : console.log,
// });

// For Production
// const sequelize = new Sequelize('postgres', 'postgres', 'ClassMate123!1', {
//     host: 'db.tubxvcrohjakulghoizg.supabase.co',
//     port: 6543,
//     dialect: 'postgres'
// });


export async function createSequelizeConnection(instance: Sequelize) {
    try {
        await instance.authenticate();
        console.log('Connection to database established!');
        return 'Connection to database established!';
    } catch (err) {
        console.error('Unable to connect to database', err);
        return 'Failed to connect to database!';
    }
}

// createSequelizeConnection(sequelize);
export default sequelize;
