import sequelize from '@server/database/connection';
import {
    Association,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';
import Users_Modules from '@models/Users_Modules';

class Lessons extends Model<
    InferAttributes<Lessons>,
    InferCreationAttributes<Lessons>
> {
    declare id: number | null;
    declare lessonId: string;
    declare moduleCode: string;
    declare lessonType: string;
    declare sem: number;
    declare day: string;
    declare startTime: string;
    declare endTime: string;

    declare getUsers_Modules: BelongsToManyGetAssociationsMixin<Users_Modules>;
    declare addUser_Module: BelongsToManyAddAssociationMixin<
        Users_Modules,
        number
    >;
    declare addUsers_Modules: BelongsToManyAddAssociationsMixin<
        Users_Modules,
        number
    >;
    declare setUsers_Modules: BelongsToManySetAssociationsMixin<
        Users_Modules,
        number
    >;
    declare removeUser_Module: BelongsToManyRemoveAssociationMixin<
        Users_Modules,
        number
    >;
    declare removeUsers_Modules: BelongsToManyRemoveAssociationsMixin<
        Users_Modules,
        number
    >;
    declare hasUser_Module: BelongsToManyHasAssociationMixin<
        Users_Modules,
        number
    >;
    declare hasUsers_Modules: BelongsToManyHasAssociationsMixin<
        Users_Modules,
        number
    >;
    declare countUsers_Modules: BelongsToManyCountAssociationsMixin;
    declare createUser_Module: BelongsToManyCreateAssociationMixin<Users_Modules>;

    declare static associations: {
        users_Modules: Association<Lessons, Users_Modules>;
    };
}

Lessons.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lessonId: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: 'fakeCompositePrimaryKey'
        },
        moduleCode: {
            type: DataTypes.STRING(30),
            allowNull: false,
            references: {
                model: 'Modules',
                key: 'code'
            },
            unique: 'fakeCompositePrimaryKey'
        },
        lessonType: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: 'fakeCompositePrimaryKey'
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
            allowNull: false
        },
        endTime: {
            type: DataTypes.STRING(4),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'Lessons',
        timestamps: false
    }
);

Lessons.sync();

export default Lessons;
