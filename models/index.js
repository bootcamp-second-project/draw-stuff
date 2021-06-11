const Game = require('./Game');
const Users = require('./Users');
const Game_Users = require('./Game_Users');
const Round = require('./Game_Round')

Game.belongsToMany(Users, {
  through: Game_Users
})

Users.belongsToMany(Game, {
  through: Game_Users
})

Game.hasMany(Round, {
  foreignKey: 'game_id'
})

module.exports = { Users, Game, Game_Users };