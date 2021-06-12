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
          model: Users, 
          through: [Game_Users],
        }, 
        { 
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

// at ~/api/game/1/rounds
router.get('/:id/rounds', async (req, res) => {
  const game = await Game.findOne({
    where: { id: req.params.id },
    include: [{ 
      model: Round,
      as: 'game_rounds',
      where: { game_id: req.params.id }
    }]
  })
  // Return game data as JSON
  if (game != null) {
      res.status(200).send(game);
  } else {
      res.status(400).send(`Game ID ${req.params.id} does not exist`);
  }
})

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

    if(drawList == null || numRounds == null || roundTime == null) {
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



module.exports = router;