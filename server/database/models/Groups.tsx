import sequelize from '@server/database/connection';
import { Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToSetAssociationMixin, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import Modules from '@models/Modules';
import Users from '@models/Users';

class Groups extends Model<InferAttributes<Groups>, InferCreationAttributes<Groups>> {
    declare id: number | null;
    declare name: string;
    declare moduleCode: string;

    declare getUsers: BelongsToManyGetAssociationsMixin<Users>;
    declare addUser: BelongsToManyAddAssociationMixin<Users, number>;
    declare addUsers: BelongsToManyAddAssociationsMixin<Users, number>;
    declare setUsers: BelongsToManySetAssociationsMixin<Users, number>;
    declare removeUser: BelongsToManyRemoveAssociationMixin<Users, number>;
    declare removeUsers: BelongsToManyRemoveAssociationsMixin<Users, number>;
    declare hasUser: BelongsToManyHasAssociationMixin<Users, number>;
    declare hasUsers: BelongsToManyHasAssociationsMixin<Users, number>;
    declare countUsers: BelongsToManyCountAssociationsMixin;
    declare createUser: BelongsToManyCreateAssociationMixin<Users>;

    declare getModule: BelongsToGetAssociationMixin<Modules>;
    declare setModule: BelongsToSetAssociationMixin<Modules, number>;
    declare createModule: BelongsToCreateAssociationMixin<Users>;

    declare static associations: {
        users: Association<Modules, Users>;
    };
}

Groups.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    moduleCode: {
        type: DataTypes.STRING(30),
        allowNull: false,
        references: {
            model: "Modules",
            key: "code"
        }
    }
}, {
    sequelize,
    tableName: 'Groups',
    timestamps: false
});

Groups.sync();

export default Groups;
