const router = require('express').Router();
const { Game, Users } = require('../models');

/**
    A get request to /api/game/5
    would return info about user with ID 5

    body: none
    returns: {@link Game}
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    // Find user by primary key ID
    const game = await Game.findByPk(id);
    // Return user data as JSON
    if (game != null) {
        res.status(200).send(JSON.stringify(game));
    } else {
        res.status(400).send(`Game ID ${id} does not exist`);
    }
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