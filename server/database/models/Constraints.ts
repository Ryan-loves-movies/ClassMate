import sequelize from '@server/database/connection';
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';
import Users from '@models/Users';

class Constraints extends Model<
    InferAttributes<Constraints>,
    InferCreationAttributes<Constraints>
> {
    declare username: string;
    declare ay: number;
    declare sem: number;
    declare startTime: string;
    declare endTime: string;
}

Constraints.init(
    {
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            references: {
                model: Users
            },
            unique: 'fakePrimaryCompositeKey'
        },
        ay: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'fakePrimaryCompositeKey'
        },
        sem: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'fakePrimaryCompositeKey'
        },
        startTime: {
            type: DataTypes.STRING(4),
            allowNull: false
        },
        endTime: {
            type: DataTypes.STRING(4),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'Constraints',
        timestamps: false
    }
);

export default Constraints;
