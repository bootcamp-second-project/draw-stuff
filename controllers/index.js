const router = require('express').Router();
const gameRoute = require('./gamecontoller');
const usersRoute = require('./accountcontroller');
const playRoute = require('./play-routes');

// route for front end
router.use('/play', playRoute);

// route to interact with users table in database
router.use('/api/users', usersRoute);
// route to interact with game table in database
router.use('/api/game', gameRoute);

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;
