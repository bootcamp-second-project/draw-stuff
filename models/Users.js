const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Game = require('./Game');

// create our Users model
class Users extends Model { }

// define table columns and configuration
Users.init(
  {
    id: {
      // id is an integer
      type: DataTypes.INTEGER,
      // id cannot be null
      allowNull: false,
      // id is a primary key
      primaryKey: true,
      // id will go up by 1 with every new creation
      autoIncrement: true

    },
    username: {
      // username will be a string
      type: DataTypes.STRING,
      // checks to see if the username is between 4 and 30 characters, displays a message if it is not
      validate: {
        len: {
          args: [4, 30],
          msg: "Username must be between 4 and 30 characters"
        }
      },
    },
    avatar_id: {
      // avatar id will be an integer
      type: DataTypes.INTEGER
    },
    session_id: {
      // session id will be a string that cannot be null
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    // connect with sequelize
    sequelize,
    // don't change createdAt and updatedAt timestamps
    timestamps: false,
    // use DAO name instead of table name
    freezeTableName: true,
    // change from camelCase to snake_case
    underscored: true,
    // set name of the model
    modelName: 'users'
  }
);

module.exports = Users;