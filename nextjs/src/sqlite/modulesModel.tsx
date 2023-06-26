import sequelize from "@sqlite/modulesConnection";
import { DataTypes } from 'sequelize';

const modules = sequelize.define('ModulesForMods', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
} 
);

export default modules;
