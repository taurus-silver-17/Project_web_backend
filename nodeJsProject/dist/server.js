"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Setup
var express = require("express");
var userRouter_1 = require("./userRouter");
var metricsRouter_1 = require("./metricsRouter");
var session = require("express-session");
var levelSession = require("level-session-store");
var path_1 = require("path");
var user_1 = require("./user");
var app = express(), handles = require('./handles'), path = require('path'), bodyparser = require('body-parser');
// Config 
var port = process.env.PORT || '8080';
var LevelStore = levelSession(session);
var dbUser = new user_1.UserHandler(path_1.join(__dirname, '..', 'db', 'users'));
var authRouter = express.Router();
// Middlewares 
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('../db/sessions'),
    resave: true,
    saveUninitialized: true
}));
/*
** Routers
*/
// Auth Router (Main)
authRouter.get('/login', function (req, res) {
    res.render('login');
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
authRouter.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, function (req, res) {
    res.render('index', { name: req.session.username });
});
app.use("/", handles);
app.use(authRouter);
app.use('/user', userRouter_1.default);
app.use("/metrics", metricsRouter_1.default);
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on http://localhost:" + port);
});
