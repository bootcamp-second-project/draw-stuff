const Game = require('./Game');
const Users = require('./Users');
const Game_Users = require('./Game_Users');
const Round = require('./Round')

// join tables
Game.belongsToMany(Users, {
  through: Game_Users
})
// users can play many games
Users.belongsToMany(Game, {
  through: Game_Users
})
// games have multiple rounds
Game.hasMany(Round, {
  foreignKey: 'game_id'
})
// rounds belong to the game
Round.belongsTo(Game, {
  foreignKey: 'game_id'
})

module.exports = { Users, Game, Game_Users, Round };