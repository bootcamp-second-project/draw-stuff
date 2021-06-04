const router = require('express').Router();
const sequelize = require('../config/connection');
const { Game, Users } = require('../models')

// get information about the connected user per their session id
// include game information in the above, will need this later
  // FK for game_id in users model needed for this to work
  // FK for session in users model may be needed as well?
  // accountcontroller would also have to would pass session id as the user is created


module.exports = router;