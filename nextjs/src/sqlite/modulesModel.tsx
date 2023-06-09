import sequelize from "@/sqlite/modulesConnection";
import { DataTypes } from 'sequelize';

const modules = sequelize.define('Modules', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        indexes: [{ fields: ['code'] }]
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        indexes: [{ fields: ['title'] }]
    },
}, {
    timestamps: false
}, {
    indexes: [
        {
            name: 'idx_code_like',
            fields: ['code'],
            operator: 'LIKE',
            using: 'BTREE',
        },
        {
            name: 'idx_title_like',
            fields: ['title'],
            operator: 'LIKE',
            using: 'BTREE',
        },
    ],
});

export default modules;
