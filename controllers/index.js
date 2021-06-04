const router = require('express').Router();
const gameRoutes = require('./gamecontoller');
const usersRoutes = require('./accountcontroller');
const playRoute = require('./play-routes');

// route for front end
router.use('/play', playRoutes);
<<<<<<< HEAD
// route to interact with users table in database
router.use('/api/users', usersRoute);
// route to interact with game table in database
router.use('/api/game', gameRoute);

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});
=======

// route to interact with users table in database
router.use('/api/users', usersRoute);

// route to interact with game table in database
router.use('/api/game', gameRoute);
>>>>>>> 77d0242b47b7eeecfb43c2e034d12c784405a7ee

module.exports = router;
