const router = require('express').Router();
const gameRoutes = require('./gamecontoller');
const usersRoutes = require('./accountcontroller');
const playRoute = require('./play-routes');

// route for front end
router.use('/play', playRoutes);
// route to interact with users table in database
router.use('/api/users', usersRoute);
// route to interact with game table in database
router.use('/api/game', gameRoute);

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;
