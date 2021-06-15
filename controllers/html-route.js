const router = require('express').Router();
const path = require('path')

router.get('/', (req, res) => {
  res.render('index');
});

// rendering for score pages will happen at /game/1/score
router.get('/game/:id/score', async (req, res) => {
  res.render('score')
})

module.exports = router