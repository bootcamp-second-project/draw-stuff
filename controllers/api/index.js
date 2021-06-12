const router = require('express').Router();
const gameRoute = require('./gamecontroller');
const usersRoute = require('./accountcontroller');
const playerRoute = require('./game-users-route');
// const roundRoute = require('./game-round-route');

// route for front end
router.use('/player', playerRoute);

// route to interact with users table in database
router.use('/users', usersRoute);

// route to interact with game table in database
router.use('/game', gameRoute);

module.exports = router;