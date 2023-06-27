import { Association, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManySetAssociationsMixin, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import sequelize from '@server/database/connection';
import Modules from '@models/Modules';
import Groups from '@models/Groups';
import Lessons from '@models/Lessons';
import Users_Modules from '@models/Users_Modules';
import Users_Groups from '@models/Users_Groups';
import Users_Modules_Lessons from '@models/Users_Modules_Lessons';
import { BelongsToManyRemoveAssociationsMixin } from 'sequelize';

// import DesignLectures from '@models/LessonTypes/DesignLectures.jsx';
// import Laboratories from '@models/LessonTypes/Laboratories.jsx';
// import Lectures from '@models/LessonTypes/Lectures.jsx';
// import MiniProjects from '@models/LessonTypes/MiniProjects.jsx';
// import PackagedLectures from '@models/LessonTypes/PackagedLectures.jsx';
// import PackagedTutorials from '@models/LessonTypes/PackagedTutorials.jsx';
// import Recitations from '@models/LessonTypes/Recitations.jsx';
// import SectionalTeachings from '@models/LessonTypes/SectionalTeachings.jsx';
// import SeminarStyleModuleClasses from '@models/LessonTypes/SeminarStyleModuleClasses.jsx';
// import Tutorials from '@models/LessonTypes/Tutorials.jsx';
// import TutorialType2s from '@models/LessonTypes/TutorialType2s.jsx';
// import Workshops from '@models/LessonTypes/Workshops.jsx';
// import Users_Modules from '@models/Users_Modules.jsx';
// import Users_Groups from '@models/Users_Groups.jsx';

// export const lessonTypes = [
//     DesignLectures,
//     Laboratories,
//     Lectures,
//     MiniProjects,
//     PackagedLectures,
//     PackagedTutorials,
//     Recitations,
//     SectionalTeachings,
//     SeminarStyleModuleClasses,
//     Tutorials,
//     TutorialType2s,
//     Workshops
// ];

class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
    declare username: string;
    declare password: string;
    declare email: string;

    declare getModules: BelongsToManyGetAssociationsMixin<Modules>;
    declare addModule: BelongsToManyAddAssociationMixin<Modules, number>;
    declare addModules: BelongsToManyAddAssociationsMixin<Modules, number>;
    declare setModules: BelongsToManySetAssociationsMixin<Modules, number>;
    declare removeModule: BelongsToManyRemoveAssociationMixin<Modules, number>;
    declare removeModules: BelongsToManyRemoveAssociationsMixin<Modules, number>;
    declare hasModule: BelongsToManyHasAssociationMixin<Modules, number>;
    declare hasModules: BelongsToManyHasAssociationsMixin<Modules, number>;
    declare countModules: BelongsToManyCountAssociationsMixin;
    declare createModules: BelongsToManyCreateAssociationMixin<Modules>;

    declare getUsers_Modules: BelongsToManyGetAssociationsMixin<Users_Modules>;
    declare addUser_Module: BelongsToManyAddAssociationMixin<Users_Modules, number>;
    declare addUsers_Modules: BelongsToManyAddAssociationsMixin<Users_Modules, number>;
    declare setUsers_Modules: BelongsToManySetAssociationsMixin<Users_Modules, number>;
    declare removeUser_Module: BelongsToManyRemoveAssociationMixin<Users_Modules, number>;
    declare removeUsers_Modules: BelongsToManyRemoveAssociationsMixin<Users_Modules, number>;
    declare hasUser_Module: BelongsToManyHasAssociationMixin<Users_Modules, number>;
    declare hasUsers_Modules: BelongsToManyHasAssociationsMixin<Users_Modules, number>;
    declare countUsers_Modules: BelongsToManyCountAssociationsMixin;
    declare createUsers_Modules: BelongsToManyCreateAssociationMixin<Users_Modules>;

    declare getGroups: BelongsToManyGetAssociationsMixin<Groups>;
    declare addGroup: BelongsToManyAddAssociationMixin<Groups, number>;
    declare addGroups: BelongsToManyAddAssociationsMixin<Groups, number>;
    declare setGroups: BelongsToManySetAssociationsMixin<Groups, number>;
    declare removeGroup: BelongsToManyRemoveAssociationMixin<Groups, number>;
    declare removeGroups: BelongsToManyRemoveAssociationsMixin<Groups, number>;
    declare hasGroup: BelongsToManyHasAssociationMixin<Groups, number>;
    declare hasGroups: BelongsToManyHasAssociationsMixin<Groups, number>;
    declare countGroups: BelongsToManyCountAssociationsMixin;
    declare createGroup: BelongsToManyCreateAssociationMixin<Groups>;

    declare modules?: NonAttribute<Modules[]>;
    declare groups?: NonAttribute<Groups[]>;
    declare users_modules?: NonAttribute<Users_Modules[]>;

    declare static associations: {
        modules: Association<Users, Modules>;
        groups: Association<Users, Groups>;
        users_modules: Association<Users, Users_Modules>;
    }
}

Users.init({
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    }
}, {
    tableName: 'Users',
    sequelize,
    timestamps: false
});

async function sync() {
    await Users.sync();

    Users.belongsToMany(Modules, { through: Users_Modules, foreignKey: 'username' });
    Modules.belongsToMany(Users, { through: Users_Modules, foreignKey: 'moduleCode' });
    // Below are so that u can query the user_modules rows associated with a specific user or module
    /* Users_Modules.belongsTo(Users, { foreignKey: 'userModuleId' });
    Users_Modules.belongsTo(Modules, { foreignKey: 'userModuleId' });
    Users.hasMany(Users_Modules, { foreignKey: 'username' });
    Modules.hasMany(Users_Modules, { foreignKey: 'moduleCode' }); */

    Users.belongsToMany(Groups, { through: Users_Groups, foreignKey: 'username' });
    Groups.belongsToMany(Users, { through: Users_Groups, foreignKey: 'groupId' });
    // Below are so that u can query the user_groups rows associated with a specific user or module
    // Users_Groups.belongsTo(Users, { foreignKey: 'userGroupId' });
    // Users_Groups.belongsTo(Groups, { foreignKey: 'userGroupId' });
    // Users.hasMany(Users_Groups, { foreignKey: 'username' });
    // Modules.hasMany(Users_Groups, { foreignKey: 'groupId' });

    Users_Modules.belongsToMany(Lessons, { through: Users_Modules_Lessons, foreignKey: 'id' });
    Lessons.belongsToMany(Users_Modules, { through: Users_Modules_Lessons, foreignKey: 'id' });

    await sequelize.sync({ force: true });

    Users.hasHooks
}

sync();

export default Users;
