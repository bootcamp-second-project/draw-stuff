const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Game = require('./Game');

// create our Users model
class Users extends Model { }

// define table columns and configuration
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true

    },
    username: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4, 30],
          msg: "Username must be between 4 and 30 characters"
        }
      },
    },
    avatar_id: {
      type: DataTypes.INTEGER
    },
    score: {
      type: DataTypes.INTEGER
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'users'
  }
);

module.exports = Users;