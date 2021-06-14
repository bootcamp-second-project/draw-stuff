const router = require('express').Router();
const { Game, Users, Game_Users, Round } = require('../../models');

// at ~/api/game/rounds
router.get('/rounds', async (req, res) => {
  const rounds = await Round.findAll();
  // Return rounds data as JSON
  if (rounds != null) {
      res.status(200).send(rounds);
  } else {
      res.status(400).send(`rounds do not exist`);
  }
})

router.get('/:id/round/:num', async (req, res) => {
  const gameId = req.params.id
  const roundNum = req.params.num
  const round = await Round.findOne(
    { where: { round_number: roundNum, game_id: gameId } }
  )
  if (round != null) {
    res.status(200).send(round);
  } else {
    res.status(400).send(`round does not exist`);
  }
})

// at ~/api/game/1/round/1, update complete value
router.put('/:id/round/:num', async (req, res) => {
  const gameId = req.params.id
  const roundNum = req.params.num
  const roundOver = req.body.complete
  const playerDoneDrawing = req.body.player_done
  // req.body looks like: { "complete": true, "player_done": true }
  if (playerDoneDrawing) {
    const currentRound = await Round.findOne(
      { where: { round_number: roundNum, game_id: gameId } }
    )
    // grab players left from round
    const playersLeft = currentRound.left_to_draw
    playersLeft.sort((a, b) => (a < b ? -1 : 1))
    const removed = playersLeft.shift() // remove the first value
    const roundUpdate = await Round.update(
      { left_to_draw: playersLeft },
      { where: { round_number: roundNum, game_id: gameId } }
    )
    if (roundUpdate != null) {
      res.status(200).send(roundUpdate);
    } else {
      res.status(400).send(`round does not exist`);
    }
  } else {
    const roundUpdate = await Round.update(
      { complete: roundOver },
      { where: { round_number: roundNum, game_id: gameId } }
    )
    if (roundUpdate != null) {
      res.status(200).send(roundUpdate);
    } else {
      res.status(400).send(`round does not exist`);
    }
  }
})

/**
    A get request to /api/game/5
    would return info about user with ID 5

    body: none
    returns: {@link Game}
 */
router.get('/:id', async (req, res) => {
    // Find game by primary key ID
    const game = await Game.findOne({
      where: { id: req.params.id },
      include: [
        {
          // get user data with game
          model: Users, 
          through: [Game_Users],
        }, 
        { 
          // get round data with game
          model: Round,
          as: 'game_rounds'
        }
      ]
    })
    // Return game data as JSON
    if (game != null) {
        res.status(200).send(game);
    } else {
        res.status(400).send(`Game ID ${req.params.id} does not exist`);
    }
});
/**
    A get request to /api/game
    this returns all of the game ids
    body: none
*/
router.get('/', async (req, res) => {
    const games = await Game.findAll();
    res.status(200).send(games.map((game) => game.id));
});

/**
    A post request to /api/game

    body: {
        draw_list: string,
        rounds: number,
        round_time: number
    }
    returns: {@link Game}
 */
router.post('/', async (req, res) => {
    const drawList = req.body.draw_list;
    const numRounds = req.body.rounds;
    const roundTime = req.body.round_time;

    if (drawList == null || numRounds == null || roundTime == null) {
        res.status(400).send({ "Error": "draw_list, rounds and round_time must all not be null" });
    } else {
        const newGame = await Game.create({
            draw_list: drawList,
            rounds: numRounds,
            round_time: roundTime,
            complete: false
        });
        res.status(200).send(newGame);
    }
});

// update complete & started booleans at /api/game/1/play
router.put('/:id/play', async (req, res) => {
  const gameId = req.params.id;
  const complete = req.body.complete;
  const started = req.body.started;

  if (complete === null || gameId === null || started === null) {
    res.status(400).send({ "Error":"no nulls for id, complete or started" });
  } else {
    const drawingUpdate = await Game.update(req.body, {
      where: { "id": gameId}
    })
    res.status(200).send(drawingUpdate)
  }
})

module.exports = router;