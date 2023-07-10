import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from 'sequelize';
import sequelize from '@server/database/connection';
import Modules from '@models/Modules';
import Groups from '@models/Groups';
import Lessons from '@models/Lessons';
import Users_Modules from '@models/Users_Modules';
import Users_Groups from '@models/Users_Groups';
import Users_Modules_Lessons from '@models/Users_Modules_Lessons';
import { BelongsToManyRemoveAssociationsMixin } from 'sequelize';

class Users extends Model<
    InferAttributes<Users>,
    InferCreationAttributes<Users>
> {
    declare username: string;
    declare password: string;
    declare email: string;
    declare photo: Blob | null;

    declare getModules: BelongsToManyGetAssociationsMixin<Modules>;
    declare addModule: BelongsToManyAddAssociationMixin<Modules, number>;
    declare addModules: BelongsToManyAddAssociationsMixin<Modules, number>;
    declare setModules: BelongsToManySetAssociationsMixin<Modules, number>;
    declare removeModule: BelongsToManyRemoveAssociationMixin<Modules, number>;
    declare removeModules: BelongsToManyRemoveAssociationsMixin<
        Modules,
        number
    >;
    declare hasModule: BelongsToManyHasAssociationMixin<Modules, number>;
    declare hasModules: BelongsToManyHasAssociationsMixin<Modules, number>;
    declare countModules: BelongsToManyCountAssociationsMixin;
    declare createModules: BelongsToManyCreateAssociationMixin<Modules>;

    declare getUsers_Modules: HasManyGetAssociationsMixin<Users_Modules>;
    declare setUsers_Modules: HasManySetAssociationsMixin<
        Users_Modules,
        number
    >;
    declare createUsers_Modules: HasManyCreateAssociationMixin<Users_Modules>;

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
    };
}

Users.init(
    {
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            primaryKey: true,
            references: {
                model: Users_Modules,
                key: 'username'
            }
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
                isEmail: true
            }
        },
        photo: {
            type: DataTypes.BLOB('long'),
            allowNull: true
        }
    },
    {
        tableName: 'Users',
        sequelize,
        timestamps: false
    }
);

async function sync() {
    await Users.sync();

    Users.belongsToMany(Modules, {
        through: Users_Modules,
        foreignKey: 'username'
    });
    Modules.belongsToMany(Users, {
        through: Users_Modules,
        foreignKey: 'moduleCode'
    });

    Lessons.belongsTo(Modules, { foreignKey: 'moduleCode' });
    Modules.hasMany(Lessons, { foreignKey: 'moduleCode' });

    Users_Modules.belongsTo(Users, { foreignKey: 'username' });
    Users.hasMany(Users_Modules, { foreignKey: 'username' });
    // Below are so that u can query the user_modules rows associated with a specific user or module
    /* Users_Modules.belongsTo(Users, { foreignKey: 'userModuleId' });
        Users_Modules.belongsTo(Modules, { foreignKey: 'userModuleId' });
        Users.hasMany(Users_Modules, { foreignKey: 'username' });
        Modules.hasMany(Users_Modules, { foreignKey: 'moduleCode' }); */

    Users_Modules.belongsTo(Users, { foreignKey: 'username' });
    Users_Modules.belongsTo(Modules, { foreignKey: 'moduleCode' });

    Users.belongsToMany(Groups, {
        through: Users_Groups,
        foreignKey: 'username'
    });
    Groups.belongsToMany(Users, {
        through: Users_Groups,
        foreignKey: 'groupId'
    });
    // Below are so that u can query the user_groups rows associated with a specific user or module
    // Users_Groups.belongsTo(Users, { foreignKey: 'userGroupId' });
    // Users_Groups.belongsTo(Groups, { foreignKey: 'userGroupId' });
    // Users.hasMany(Users_Groups, { foreignKey: 'username' });
    // Modules.hasMany(Users_Groups, { foreignKey: 'groupId' });
    Groups.belongsTo(Modules, { foreignKey: 'moduleCode' });
    Modules.hasMany(Groups, { foreignKey: 'moduleCode' });

    Users_Modules.belongsToMany(Lessons, {
        through: Users_Modules_Lessons,
        foreignKey: 'userId',
        onDelete: 'CASCADE'
    });
    Lessons.belongsToMany(Users_Modules, {
        through: Users_Modules_Lessons,
        foreignKey: 'lessonId',
        onDelete: 'CASCADE'
    });

    await sequelize.sync({ alter: true });
}

sync();

export default Users;
