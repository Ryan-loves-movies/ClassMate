import sequelize from '@server/database/connection';
import Users from '@models/Users';
import Modules from '@models/Modules';
import Groups from '@models/Groups';
import Lessons from '@models/Lessons';
import Users_Groups from '@models/Users_Groups';
import Users_Modules from '@models/Users_Modules';
import Users_Modules_Lessons from '@models/Users_Modules_Lessons';

export async function sync() {
    // Users : Modules - M:N
    Users.belongsToMany(Modules, {
        through: Users_Modules,
        foreignKey: 'username'
    });
    Modules.belongsToMany(Users, {
        through: Users_Modules,
        foreignKey: 'moduleCode'
    });

    // Users : Users_Modules : Modules - M:1:N
    Users_Modules.belongsTo(Users, { foreignKey: 'username' });
    Users.hasMany(Users_Modules, { foreignKey: 'username' });
    Users_Modules.belongsTo(Modules, { foreignKey: 'moduleCode' });

    // Modules : Lessons - 1:M
    Lessons.belongsTo(Modules, { foreignKey: 'moduleCode' });
    Modules.hasMany(Lessons, { foreignKey: 'moduleCode' });

    // Users_Modules : Lessons - M:N
    Users_Modules.belongsToMany(Lessons, {
        through: Users_Modules_Lessons,
        foreignKey: 'userId'
    });
    Lessons.belongsToMany(Users_Modules, {
        through: Users_Modules_Lessons,
        foreignKey: 'lessonId'
    });

    // Users : Groups - M:N
    Users.belongsToMany(Groups, {
        through: Users_Groups,
        foreignKey: 'username'
    });
    Groups.belongsToMany(Users, {
        through: Users_Groups,
        foreignKey: 'groupId'
    });

    // Groups : Modules - M:1
    Groups.belongsTo(Modules, { foreignKey: 'moduleCode' });
    Modules.hasMany(Groups, { foreignKey: 'moduleCode' });

    await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
}
