const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/', (req, res) => {
    console.log('Router(game): game.ejs render');
    res.render('game');
});

router.post('/start', gameController.startGame);
router.get('/state', gameController.getGameState);
router.post('/stop', gameController.stopGauge);
router.post('/restart', gameController.restartGauge);

module.exports = router;