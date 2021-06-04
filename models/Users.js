const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Users model
class Users extends Model {}

// define table columns and configuration
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement:true

    },
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [4-30]
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
    game_id: {
      references: {
        model: 'game',
        key: 'id'
      }
    }
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