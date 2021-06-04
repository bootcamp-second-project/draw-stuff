const router = require('express').Router();
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


module.exports = router;