import sequelize from '@server/database/connection.jsx';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare username: string;
    declare password: string;
    declare email: string;

    declare mod1: string | null;
    declare mod1LecCode: string | null;
    declare mod1LecDay: string | null;
    declare mod1LecStartTime: string | null;
    declare mod1LecEndTime: string | null;
    declare mod1TutCode: string | null;
    declare mod1TutDay: string | null;
    declare mod1TutStartTime: string | null;
    declare mod1TutEndTime: string | null;
    declare mod1LabCode: string | null;
    declare mod1LabDay: string | null;
    declare mod1LabStartTime: string | null;
    declare mod1LabEndTime: string | null;

    declare mod2: string | null;
    declare mod2LecCode: string | null;
    declare mod2LecDay: string | null;
    declare mod2LecStartTime: string | null;
    declare mod2LecEndTime: string | null;
    declare mod2TutCode: string | null;
    declare mod2TutDay: string | null;
    declare mod2TutStartTime: string | null;
    declare mod2TutEndTime: string | null;
    declare mod2LabCode: string | null;
    declare mod2LabDay: string | null;
    declare mod2LabStartTime: string | null;
    declare mod2LabEndTime: string | null;

    declare mod3: string | null;
    declare mod3LecCode: string | null;
    declare mod3LecDay: string | null;
    declare mod3LecStartTime: string | null;
    declare mod3LecEndTime: string | null;
    declare mod3TutCode: string | null;
    declare mod3TutDay: string | null;
    declare mod3TutStartTime: string | null;
    declare mod3TutEndTime: string | null;
    declare mod3LabCode: string | null;
    declare mod3LabDay: string | null;
    declare mod3LabStartTime: string | null;
    declare mod3LabEndTime: string | null;

    declare mod4: string | null;
    declare mod4LecCode: string | null;
    declare mod4LecDay: string | null;
    declare mod4LecStartTime: string | null;
    declare mod4LecEndTime: string | null;
    declare mod4TutCode: string | null;
    declare mod4TutDay: string | null;
    declare mod4TutStartTime: string | null;
    declare mod4TutEndTime: string | null;
    declare mod4LabCode: string | null;
    declare mod4LabDay: string | null;
    declare mod4LabStartTime: string | null;
    declare mod4LabEndTime: string | null;

    declare mod5: string | null;
    declare mod5LecCode: string | null;
    declare mod5LecDay: string | null;
    declare mod5LecStartTime: string | null;
    declare mod5LecEndTime: string | null;
    declare mod5TutCode: string | null;
    declare mod5TutDay: string | null;
    declare mod5TutStartTime: string | null;
    declare mod5TutEndTime: string | null;
    declare mod5LabCode: string | null;
    declare mod5LabDay: string | null;
    declare mod5LabStartTime: string | null;
    declare mod5LabEndTime: string | null;

    declare mod6: string | null;
    declare mod6LecCode: string | null;
    declare mod6LecDay: string | null;
    declare mod6LecStartTime: string | null;
    declare mod6LecEndTime: string | null;
    declare mod6TutCode: string | null;
    declare mod6TutDay: string | null;
    declare mod6TutStartTime: string | null;
    declare mod6TutEndTime: string | null;
    declare mod6LabCode: string | null;
    declare mod6LabDay: string | null;
    declare mod6LabStartTime: string | null;
    declare mod6LabEndTime: string | null;

    declare mod7: string | null;
    declare mod7LecCode: string | null;
    declare mod7LecDay: string | null;
    declare mod7LecStartTime: string | null;
    declare mod7LecEndTime: string | null;
    declare mod7TutCode: string | null;
    declare mod7TutDay: string | null;
    declare mod7TutStartTime: string | null;
    declare mod7TutEndTime: string | null;
    declare mod7LabCode: string | null;
    declare mod7LabDay: string | null;
    declare mod7LabStartTime: string | null;
    declare mod7LabEndTime: string | null;

    declare mod8: string | null;
    declare mod8LecCode: string | null;
    declare mod8LecDay: string | null;
    declare mod8LecStartTime: string | null;
    declare mod8LecEndTime: string | null;
    declare mod8TutCode: string | null;
    declare mod8TutDay: string | null;
    declare mod8TutStartTime: string | null;
    declare mod8TutEndTime: string | null;
    declare mod8LabCode: string | null;
    declare mod8LabDay: string | null;
    declare mod8LabStartTime: string | null;
    declare mod8LabEndTime: string | null;

    declare mod9: string | null;
    declare mod9LecCode: string | null;
    declare mod9LecDay: string | null;
    declare mod9LecStartTime: string | null;
    declare mod9LecEndTime: string | null;
    declare mod9TutCode: string | null;
    declare mod9TutDay: string | null;
    declare mod9TutStartTime: string | null;
    declare mod9TutEndTime: string | null;
    declare mod9LabCode: string | null;
    declare mod9LabDay: string | null;
    declare mod9LabStartTime: string | null;
    declare mod9LabEndTime: string | null;

    declare mod10: string | null;
    declare mod10LecCode: string | null;
    declare mod10LecDay: string | null;
    declare mod10LecStartTime: string | null;
    declare mod10LecEndTime: string | null;
    declare mod10TutCode: string | null;
    declare mod10TutDay: string | null;
    declare mod10TutStartTime: string | null;
    declare mod10TutEndTime: string | null;
    declare mod10LabCode: string | null;
    declare mod10LabDay: string | null;
    declare mod10LabStartTime: string | null;
    declare mod10LabEndTime: string | null;

    declare mod11: string | null;
    declare mod11LecCode: string | null;
    declare mod11LecDay: string | null;
    declare mod11LecStartTime: string | null;
    declare mod11LecEndTime: string | null;
    declare mod11TutCode: string | null;
    declare mod11TutDay: string | null;
    declare mod11TutStartTime: string | null;
    declare mod11TutEndTime: string | null;
    declare mod11LabCode: string | null;
    declare mod11LabDay: string | null;
    declare mod11LabStartTime: string | null;
    declare mod11LabEndTime: string | null;

    declare mod12: string | null;
    declare mod12LecCode: string | null;
    declare mod12LecDay: string | null;
    declare mod12LecStartTime: string | null;
    declare mod12LecEndTime: string | null;
    declare mod12TutCode: string | null;
    declare mod12TutDay: string | null;
    declare mod12TutStartTime: string | null;
    declare mod12TutEndTime: string | null;
    declare mod12LabCode: string | null;
    declare mod12LabDay: string | null;
    declare mod12LabStartTime: string | null;
    declare mod12LabEndTime: string | null;
}

User.init({
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
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod1LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod1LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod1LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod1LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod1TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod1TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod1TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod1TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod1LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod1LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod1LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod1LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod2: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod2LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod2LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod2LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod2LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod2TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod2TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod2TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod2TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod2LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod2LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod2LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod2LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod3: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod3LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod3LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod3LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod3LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod3TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod3TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod3TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod3TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod3LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod3LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod3LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod3LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod4: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod4LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod4LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod4LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod4LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod4TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod4TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod4TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod4TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod4LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod4LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod4LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod4LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod5: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod5LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod5LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod5LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod5LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod5TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod5TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod5TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod5TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod5LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod5LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod5LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod5LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod6: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod6LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod6LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod6LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod6LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod6TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod6TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod6TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod6TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod6LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod6LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod6LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod6LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod7: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod7LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod7LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod7LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod7LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod7TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod7TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod7TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod7TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod7LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod7LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod7LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod7LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod8: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod8LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod8LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod8LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod8LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod8TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod8TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod8TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod8TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod8LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod8LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod8LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod8LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod9: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod9LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod9LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod9LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod9LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod9TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod9TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod9TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod9TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod9LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod9LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod9LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod9LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod10: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod10LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod10LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod10LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod10LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod10TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod10TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod10TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod10TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod10LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod10LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod10LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod10LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod11: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod11LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod11LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod11LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod11LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod11TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod11TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod11TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod11TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod11LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod11LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod11LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod11LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },

    mod12: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod12LecCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod12LecDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod12LecStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod12LecEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod12TutCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod12TutDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod12TutStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod12TutEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod12LabCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod12LabDay: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    mod12LabStartTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    mod12LabEndTime: {
        type: DataTypes.STRING(4),
        allowNull: true
    }
}, {
    tableName: 'users',
    sequelize,
    timestamps: false
});

User.sync();

export default User;
