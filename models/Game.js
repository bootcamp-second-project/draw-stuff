const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Users = require('./users');

// create our Users model
class Game extends Model {}

// define table columns and configuration
Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement:true

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
    drawing_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    player_1: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    player_2: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    player_3: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    player_4: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },

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