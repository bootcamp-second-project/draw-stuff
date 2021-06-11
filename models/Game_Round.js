const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Game = require('./Game');

class Round extends Model {};

Round.init({
  // id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   primaryKey: true,
  //   autoIncrement: true
  // },
  complete: {
    type: DataTypes.BOOLEAN,
  },
  round_number: {
    type: DataTypes.INTEGER,
  },
  phrase: {
    type: DataTypes.STRING,
  }
},
{
  // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: 'game_round'
}
)

module.exports = Round;