import sequelize from '@server/database/connection';
import {
    Association,
    BelongsToGetAssociationMixin,
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
import Users from '@models/Users';
import Lessons from '@models/Lessons';
import Modules from '@models/Modules';

class Users_Modules extends Model<
    InferAttributes<Users_Modules>,
    InferCreationAttributes<Users_Modules>
> {
    declare id: number;
    declare username: string;
    declare moduleCode: string;

    // Get user and module
    declare getUser: BelongsToGetAssociationMixin<Users>;
    declare getModule: BelongsToGetAssociationMixin<Modules>;

    // M:N association with Lessons
    declare getLessons: BelongsToManyGetAssociationsMixin<Lessons>;
    declare addLesson: BelongsToManyAddAssociationMixin<Lessons, number>;
    declare addLessons: BelongsToManyAddAssociationsMixin<Lessons, number>;
    declare setLessons: BelongsToManySetAssociationsMixin<Lessons, number>;
    declare removeLesson: BelongsToManyRemoveAssociationMixin<Lessons, number>;
    declare removeLessons: BelongsToManyRemoveAssociationsMixin<
        Lessons,
        number
    >;
    declare hasLesson: BelongsToManyHasAssociationMixin<Lessons, number>;
    declare hasLessons: BelongsToManyHasAssociationsMixin<Lessons, number>;
    declare countLessons: BelongsToManyCountAssociationsMixin;
    declare createLesson: BelongsToManyCreateAssociationMixin<Lessons>;

    // M:N association with Lessons through FixedLessons
    declare getFixedLessons: BelongsToManyGetAssociationsMixin<Lessons>;
    declare addFixedLesson: BelongsToManyAddAssociationMixin<Lessons, number>;
    declare addFixedLessons: BelongsToManyAddAssociationsMixin<Lessons, number>;
    declare setFixedLessons: BelongsToManySetAssociationsMixin<Lessons, number>;
    declare removeFixedLesson: BelongsToManyRemoveAssociationMixin<
        Lessons,
        number
    >;
    declare removeFixedLessons: BelongsToManyRemoveAssociationsMixin<
        Lessons,
        number
    >;
    declare hasFixedLesson: BelongsToManyHasAssociationMixin<Lessons, number>;
    declare hasFixedLessons: BelongsToManyHasAssociationsMixin<Lessons, number>;
    declare countFixedLessons: BelongsToManyCountAssociationsMixin;
    declare createFixedLesson: BelongsToManyCreateAssociationMixin<Lessons>;

    declare static associations: {
        user: Association<Users_Modules, Users>;
        module: Association<Users_Modules, Modules>;
        lessons: Association<Users_Modules, Lessons>;
    };
}

Users_Modules.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            references: {
                model: 'Users_Modules_Lessons',
                key: 'userId'
            }
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            references: {
                model: 'Users',
                key: 'username'
            },
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
        }
    },
    {
        sequelize,
        tableName: 'Users_Modules',
        timestamps: false
    }
);

export default Users_Modules;
