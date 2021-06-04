const router = require('express').Router();
const { Game, Users } = require('../models');

// update currently drawing user.
router.post('/:drawing', (req, res) => {
  Game.update({})
    .then((users) => res.json(categories))
    .catch((err) => res.status(500).json(err))
})

module.exports = router;