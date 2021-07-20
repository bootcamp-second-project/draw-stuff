const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Users = require('./Users');
const Round = require('./Round')


// create our Users model
class Game extends Model { }

// define table columns and configuration
Game.init(
  {
    id: {
      // id will be an integer
      type: DataTypes.INTEGER,
      // id cannot be null
      allowNull: false,
      // id is a primary key
      primaryKey: true,
      // id integer will go up by 1 with every new id
      autoIncrement: true
    },
    draw_list: {
      // drawing list will be in json format
      type: DataTypes.JSON,
    },
    rounds: {
      // round number is an integer
      type: DataTypes.INTEGER
    },
    round_time: {
      // round time is an integer
      type: DataTypes.INTEGER
    },
    started: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    complete: {
      // determines whether or not the game is complete. this will be either true or false
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    hooks: {
      // set up afterCreate hook for rounds to be created
      async afterCreate(newGameData) {
        const { id, draw_list, rounds } = newGameData.dataValues
        const { phrases } = draw_list
        const random = Math.floor(Math.random() * phrases.length)
        for (let i = 0; i < rounds; i++) {
          Round.create({
            complete: false,
            round_number: i + 1,
            phrase: phrases[Math.floor(Math.random() * phrases.length)],
            // just 
            game_id: id
          })
        }
        return newGameData
      }
    },
    sequelize,
    // don't change createdAt or updatedAt timestamps
    timestamps: false,
    // DAO is basically similar to an object. freezeTableName refers to the name of the table being changed to that of said object.
    freezeTableName: true,
    // change from camelCase to snake_case
    underscored: true,
    // set the name of the model
    modelName: 'game'
  }
);

// export this model
module.exports = Game;