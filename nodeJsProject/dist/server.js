"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metricsRouter_1 = require("./metricsRouter");
var session = require("express-session");
var levelSession = require("level-session-store");
var user_1 = require("./user");
var LevelStore = levelSession(session);
var dbUser = new user_1.UserHandler('../db/users');
var authRouter = express.Router();
var app = express(), handles = require('./handles'), metrics = require("./metrics"), path = require('path'), bodyparser = require('body-parser');
var port = process.env.PORT || '8080';
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('../db/sessions'),
    resave: true,
    saveUninitialized: true
}));
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
var userRouter = express.Router();
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.redirect('/login');
            });
        }
    });
});
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else {
            var Response_1 = __assign(__assign({}, result), { password: null });
            res.status(200).json(Response_1);
        }
    });
});
userRouter.delete('/:username', function (req, res, next) {
    if (req.params.username == req.session.user.username) {
        dbUser.delete(req.params.username, function (err, result) {
            if (err) {
                res.status(404).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else {
        res.status(401).send("You can only delete your account.");
    }
});
userRouter.put("/:username", function (req, res, next) {
    if (req.params.username === req.session.user.username) {
        dbUser.put("" + req.params.username, function (err, result) {
            if (err != null) {
                res.status(404).send(err);
            }
            else
                res.status(200).json(result);
        }, req.body ? req.body.email : undefined, req.body ? req.body.password : undefined);
    }
    else
        res.status(401).send("You can't do that.");
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
app.use('/user', userRouter);
app.use("/metrics", metricsRouter_1.default);
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on http://localhost:" + port);
});
