const router = require('express').Router();
const { Game, Users, Game_Users } = require('../../models');

// get information about the connected user per their game
router.post('/', async (req, res) => {
  const gameId = req.body.game_id;
  const playerId = req.body.player_id;

  if(gameId == null || playerId == null) {
      res.status(400).send({ "Error": "game_id and player_id must both not be null" });
  } else {
      const newUser = await Game_Users.create({
          "game_id": gameId,
          "player_id": playerId,
          "score": 0,
          "drawing": false
      });
      res.status(200).send(newUser);
  }
});

module.exports = router;