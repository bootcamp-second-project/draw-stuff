const router = require('express').Router();
<<<<<<< HEAD
const { Game, Users } = require('../models');

// get information about the connected user per their session id
// accountcontroller would also have to would pass session id as the user is created
router.get('/:id', async (req, res) => {
  Game.findOne({ 
    where: { id: req.params.id },
    include: [Users],
  })
    .then((users) => res.json(categories))
    .catch((err) => res.status(500).json(err))
});
=======
const sequelize = require('../config/connection');
const { Game, Users } = require('../models')

// get information about the connected user per their session id
// include game information in the above, will need this later
  // FK for game_id in users model needed for this to work
  // FK for session in users model may be needed as well?
  // accountcontroller would also have to would pass session id as the user is created
>>>>>>> 77d0242b47b7eeecfb43c2e034d12c784405a7ee


module.exports = router;