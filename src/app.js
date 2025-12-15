const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');
const errorRouter = require('./routes/error');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // check! 배포 시 true로 변경 필요
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(expressLayouts);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/music', express.static('public/sound'));

app.use('/', indexRouter);
app.use('/game', gameRouter);
app.use(errorRouter);

module.exports = app;