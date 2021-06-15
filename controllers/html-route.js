const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index');
});

// play game page will render at whatever id
router.get('/play/:id', (req, res) => {
  res.render('play');
})

// rendering for score pages will happen at /game/1/score
router.get('/game/:id/score', async (req, res) => {
  res.render('score')
})

module.exports = router