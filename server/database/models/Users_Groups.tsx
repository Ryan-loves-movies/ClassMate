import { Association, BelongsToManyGetAssociationsMixin, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '@server/database/connection';
import Groups from '@models/Groups';
import Users from '@models/Users';

class Users_Groups extends Model<InferAttributes<Users_Groups>, InferCreationAttributes<Users_Groups>> {
    declare username: string;
    declare groupId: string;

    declare getUser: BelongsToManyGetAssociationsMixin<Users>;
    declare getGroup: BelongsToManyGetAssociationsMixin<Groups>;

    declare static associations: {
        user: Association<Users_Groups, Users>;
        group: Association<Users_Groups, Groups>;
    };
}

Users_Groups.init({
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Users',
            key: 'username',
        }
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Groups',
            key: 'id',
        }
    }
}, {
    sequelize,
    tableName: 'Users_Groups',
    timestamps: false
});

export default Users_Groups;
