const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Users = require('./Users');
const Game = require('./Game');

// create our Users model
class Game_Users extends Model { }

// define table columns and configuration
Game_Users.init(
  {
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    drawing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
    // keys for game and user are added in the models index
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'game_users'
  }
);

module.exports = Game_Users;