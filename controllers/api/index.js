const router = require('express').Router();
const gameRoute = require('./gamecontroller');
const usersRoute = require('./accountcontroller');
const playerRoute = require('./game-users-route');

// route for front end
router.use('/player', playerRoute);

// route to interact with users table in database
router.use('/users', usersRoute);

// route to interact with game and associated round tables
router.use('/game', gameRoute);



module.exports = router;