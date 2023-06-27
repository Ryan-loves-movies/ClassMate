const Sequelize = require('sequelize');

/* const sequelize = new Sequelize('postgres', 'postgres', 'ClassMate123!1', {
    host: 'db.tubxvcrohjakulghoizg.supabase.co',
    port: 6543,
    dialect: 'postgres'
});
*/

const sequelize = new Sequelize('classmate', 'root', 'Classmate123!', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
})
export function createSequelizeConnection(instance: typeof Sequelize) {
    try {
        instance.authenticate();
        console.log('Connection to database established!');
        return 'Connection to database established!';
    } catch (err) {
        console.error("Unable to connect to database", err);
        return 'Failed to connect to database!';
    }
}

createSequelizeConnection(sequelize);
export default sequelize;
