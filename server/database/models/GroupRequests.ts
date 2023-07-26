import sequelize from '@server/database/connection';
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';
import Users from '@models/Users';
import Groups from '@models/Groups';

class GroupRequests extends Model<
    InferAttributes<GroupRequests>,
    InferCreationAttributes<GroupRequests>
> {
    declare requestee: string;
    declare requestor: string;
    declare groupId: number;
    declare message: string;
}

GroupRequests.init(
    {
        message: {
            type: DataTypes.STRING(100),
            allowNull: false,
            // primaryKey: true
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Groups
            },
            unique: 'fakeCompositePrimaryKey'
        },
        requestee: {
            type: DataTypes.STRING(30),
            allowNull: false,
            references: {
                model: Users
            },
            unique: 'fakeCompositePrimaryKey'
        },
        requestor: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'fakeCompositePrimaryKey'
        }
    },
    {
        sequelize,
        tableName: 'GroupRequests',
        timestamps: false
    }
);

export default GroupRequests;
