import sequelize from '@server/database/connection';
import {
    Association,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManySetAssociationsMixin,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from 'sequelize';
import Modules from '@models/Modules';
import Groups from '@models/Groups';
import Users_Modules from '@models/Users_Modules';
import { BelongsToManyRemoveAssociationsMixin } from 'sequelize';
import GroupRequests from './GroupRequests';
import { HasManyRemoveAssociationsMixin } from 'sequelize';

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

    declare getGroupRequests: HasManyGetAssociationsMixin<GroupRequests>;
    declare addGroupRequest: HasManyAddAssociationMixin<GroupRequests, number>;
    declare addGroupRequests: HasManyAddAssociationsMixin<
        GroupRequests,
        number
    >;
    declare removeGroupRequest: HasManyRemoveAssociationMixin<
        GroupRequests,
        number
    >;
    declare removeGroupRequests: HasManyRemoveAssociationsMixin<
        GroupRequests,
        number
    >;

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

export default Users;
