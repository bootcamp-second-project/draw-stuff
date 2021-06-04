const Users = require('/Users');
const Game = require('/Game');

Game.hasMany(Users, {
  foreignKey: ['drawing_user', 'player_1', 'player_1', 'player_1', 'player_1']
})

Users.belongsTo(Game, {
  foreignKey: ['drawing_user', 'player_1', 'player_1', 'player_1', 'player_1']
})

module.exports = { Users, Game };