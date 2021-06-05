const router = require('express').Router();
const { Game, Users, Game_Users } = require('../models');
const path = require('path');

// room numbers automatically assigned in the db as the id
// socket room used to broadcast to only clients in the game
router.get('/:id', async (req, res) => {
  // req.body should look like this...
  //   {
  //      id: 1,
  //      room_id: ?,
  //   }
  // will update the Game with a room id
  Game.findOne({
    where: { id: req.params.id },
    include: [{
        Game_Users,
        include: [Users]
    }],
  })
    .then((game) => {
      res.json(game);
      // create a new room on the server 
      socket.join(`room_${req.params.id}`);
    })
    .catch((err) => res.status(500).json(err))
});

router.get('/', (req, res) => {
  if (!req.session?.id) {
    res.redirect('/');
  }
  res.sendFile(path.join(__dirname + '/../public/play.html'));
});



module.exports = router;
