import sequelize from '@server/database/connection.jsx';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class Groups extends Model<InferAttributes<Groups>, InferCreationAttributes<Groups>> {
    declare id: string;
    declare name: string;
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
        allowNull: false
    }
}, {
    tableName: 'Modules',
    sequelize,
    timestamps: false
});

Groups.sync();

export default Groups;
