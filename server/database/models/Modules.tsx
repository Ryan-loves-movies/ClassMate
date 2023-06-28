import sequelize from '@server/database/connection';
import { Association, DataTypes, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import Users from '@models/Users';

class Modules extends Model<InferAttributes<Modules>, InferCreationAttributes<Modules>> {
    declare code: string;
    declare name: string;

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

    declare static associations: {
        users: Association<Modules, Users>;
    };
}

Modules.init({
    code: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Modules',
    timestamps: false
});

Modules.sync();

export default Modules;
