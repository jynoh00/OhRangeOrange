const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Router(index): index.ejs render');
    res.render('index');
});

router.get('/bgm', (req, res) => {
  res.render('bgm');
});

module.exports = router;