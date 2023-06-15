import sequelize from '@server/database/connection.jsx';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class Modules extends Model<InferAttributes<Modules>, InferCreationAttributes<Modules>> {
    declare code: string;
    declare name: string;
}

Modules.init({
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
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

Modules.sync();

export default Modules;
