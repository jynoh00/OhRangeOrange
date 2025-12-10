const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Router(index): index.ejs render');
    res.render('index');
});

router.get('/game', (req, res) => {
    console.log('Router(index): game.ejs render');
    res.render('game');
})

module.exports = router;