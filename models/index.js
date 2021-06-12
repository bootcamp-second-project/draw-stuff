const Game = require('./Game');
const Users = require('./Users');
const Game_Users = require('./Game_Users');

Game.belongsToMany(Users, {
  through: Game_Users
})

Users.belongsToMany(Game, {
  through: Game_Users
})

module.exports = { Users, Game, Game_Users };