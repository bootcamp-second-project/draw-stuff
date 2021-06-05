const router = require('express').Router();
const { Game, Users } = require('../models');

// create game in the database
// game object should look like this
  //   {
  //      id: 1,
  //      draw_list: ['cat','dog'...],
  //      rounds: 3,
  //      round_time: 60,
  //      complete: false
  //   }

// after game object gets made and entered into db, 

module.exports = router;