import sequelize from '@server/database/connection';
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';

class Users_Modules_Lessons extends Model<
    InferAttributes<Users_Modules_Lessons>,
    InferCreationAttributes<Users_Modules_Lessons>
> {
    declare userId: number;
    declare lessonId: number;
}

Users_Modules_Lessons.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users_Modules',
                key: 'id'
            }
        },
        lessonId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Lessons',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'Users_Modules_Lessons',
        timestamps: false
    }
);

export default Users_Modules_Lessons;
