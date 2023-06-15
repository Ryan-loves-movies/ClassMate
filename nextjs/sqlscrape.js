const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance and establish the database connection
const sequelize = new Sequelize('orbital', 'root', 'Classmate123!', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define the Module model
const Module = sequelize.define('Module', {
  module_code: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  module_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  lect_num: {
    type: DataTypes.STRING(10)
  },
  lect_day: {
    type: DataTypes.STRING(10)
  },
  lect_startTime: {
    type: DataTypes.STRING(10)
  },
  lect_endTime: {
    type: DataTypes.STRING(10)
  },
  tut_num: {
    type: DataTypes.STRING(10)
  },
  tut_day: {
    type: DataTypes.STRING(10)
  },
  tut_startTime: {
    type: DataTypes.STRING(10)
  },
  tut_endTime: {
    type: DataTypes.STRING(10)
  },
  tut_weeks: {
    type: DataTypes.STRING(100)
  }
});

// Synchronize the model with the database
sequelize.sync()
  .then(() => {
    console.log('Module model synchronized with the database');
  })
  .catch(err => {
    console.error('Error synchronizing the model:', err);
  });

