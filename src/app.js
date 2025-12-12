const express = require('express');
const session = require('express-session');
const path = require('path');

const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');
const errorRouter = require('./routes/error');

const app = express();

app.use(session({
    secret: 'secret-key', // 환경변수로 세션 ID 암호화 용 개인 키 (64자 이상 문자열로 작성할 것 (영문 숫자 특수문자))
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // check! 배포 시 true로 변경 필요
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/game', gameRouter);
app.use(errorRouter);

module.exports = app;