import sequelize from '@server/database/connection.jsx';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class MiniProjects extends Model<InferAttributes<MiniProjects>, InferCreationAttributes<MiniProjects>> {
    declare code: string;
    declare moduleCode: string;
    declare sem: number;
    declare day: string;
    declare startTime: string;
    declare endTime: string;
}

MiniProjects.init({
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    moduleCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: "Modules",
            key: "code"
        }
    },
    sem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    day: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    startTime: {
        type: DataTypes.STRING(4),
        allowNull: false,
    },
    endTime: {
        type: DataTypes.STRING(4),
        allowNull: false,
    }
}, {
    tableName: 'MiniProjects',
    sequelize,
    timestamps: false
});

MiniProjects.sync();

export default MiniProjects;
