import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '@server/database/connection.jsx';

import Modules from '@models/Modules.jsx';
import Groups from '@models/Groups.jsx';

import DesignLectures from '@models/LessonTypes/DesignLectures.jsx';
import Laboratories from '@models/LessonTypes/Laboratories.jsx';
import Lectures from '@models/LessonTypes/Lectures.jsx';
import MiniProjects from '@models/LessonTypes/MiniProjects.jsx';
import PackagedLectures from '@models/LessonTypes/PackagedLectures.jsx';
import PackagedTutorials from '@models/LessonTypes/PackagedTutorials.jsx';
import Recitations from '@models/LessonTypes/Recitations.jsx';
import SectionalTeachings from '@models/LessonTypes/SectionalTeachings.jsx';
import SeminarStyleModuleClasses from '@models/LessonTypes/SeminarStyleModuleClasses.jsx';
import Tutorials from '@models/LessonTypes/Tutorials.jsx';
import TutorialType2s from '@models/LessonTypes/TutorialType2s.jsx';
import Workshops from '@models/LessonTypes/Workshops.jsx';


class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
    declare username: string;
    declare password: string;
    declare email: string;
}

Users.init({
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    }
}, {
    tableName: 'Users',
    sequelize,
    timestamps: false
});

Users.belongsToMany(Modules, { through: 'Users_Modules' });
Modules.belongsToMany(Users, { through: 'Users_Modules' });

Users.belongsToMany(Groups, { through: 'Users_Groups' });
Groups.belongsToMany(Users, { through: 'Users_Groups' });

Modules.hasMany(DesignLectures);
Modules.hasMany(Laboratories);
Modules.hasMany(Lectures);
Modules.hasMany(MiniProjects);
Modules.hasMany(PackagedLectures);
Modules.hasMany(PackagedTutorials);
Modules.hasMany(Recitations);
Modules.hasMany(SectionalTeachings);
Modules.hasMany(SeminarStyleModuleClasses);
Modules.hasMany(Tutorials);
Modules.hasMany(TutorialType2s);
Modules.hasMany(Workshops);

Modules.sync();
Users.sync();

export const lessonTypes = [DesignLectures, Laboratories, Lectures, MiniProjects, PackagedLectures, PackagedTutorials, Recitations, SectionalTeachings, SeminarStyleModuleClasses, Tutorials, TutorialType2s, Workshops];

export default Users;
