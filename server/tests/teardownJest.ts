import sequelize from '../database/connection';

export default async () => {
    await sequelize.close();
    console.log('All tests done! Sequelize connection closing!');
};
