import sequelize from '@server/database/connection.jsx';
import { DataTypes } from 'sequelize';

const User = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    mod1: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod1LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod2LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod3: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod3LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod4: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod4LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod5: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod5LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod6: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod6LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod7: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod7LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod8: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod8LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod9: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod9LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod10: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod10LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod11: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod11LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    mod12: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12LecCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12LecStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12LecEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12TutCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12TutStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12TutEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12LabCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12LabStartTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod12LabEndTime: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

export default User;
