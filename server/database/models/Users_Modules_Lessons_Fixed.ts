import sequelize from '@server/database/connection';
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';

class Users_Modules_Lessons_Fixed extends Model<
    InferAttributes<Users_Modules_Lessons_Fixed>,
    InferCreationAttributes<Users_Modules_Lessons_Fixed>
> {
    declare userId: number;
    declare lessonId: number;
}

Users_Modules_Lessons_Fixed.init(
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
        tableName: 'Users_Modules_Lessons_Fixed',
        timestamps: false
    }
);

export default Users_Modules_Lessons_Fixed;
