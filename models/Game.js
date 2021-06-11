const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Users = require('./Users');
const Round = require('./Game_Round')


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
      type: DataTypes.JSON,
    },
    rounds: {
      type: DataTypes.INTEGER
    },
    round_time: {
      type: DataTypes.INTEGER
    },
    started: {
      type: DataTypes.BOOLEAN,
    },
    complete: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    hooks: {
      // set up afterCreate hook for rounds
      async afterCreate(newRoundData) {
        const { draw_list, rounds } = newRoundData.dataValues
        const { phrases } = draw_list
        console.log(phrases)
        const random = Math.floor(Math.random() * phrases.length)
        for (let i = 0; i < rounds; i++) {
          Round.create({
            round_number: i + 1,
            phrase: phrases[Math.floor(Math.random() * phrases.length)]
          })
        }
        return newRoundData
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'game'
  }
);

module.exports = Game;