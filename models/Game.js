const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Users = require('./Users');

// create our Users model
class Game extends Model { }

// define table columns and configuration
Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    draw_list: {
      type: DataTypes.STRING,
    },
    rounds: {
      type: DataTypes.INTEGER
    },
    round_time: {
      type: DataTypes.INTEGER
    },
    complete: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'game'
  }
);

module.exports = Game;