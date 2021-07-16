// import express as the router
const router = require('express').Router();
// import the game controller for use as game route
const gameRoute = require('./gamecontroller');
// import account controller for use as users route
const usersRoute = require('./accountcontroller');
// import game users route for the players in specific games
const playerRoute = require('./game-users-route');

// route for front end
router.use('/player', playerRoute);

// route to interact with users table in database
router.use('/users', usersRoute);
// route to interact with game table in database
router.use('/game', gameRoute);

// export router for these game and users routes
module.exports = router;