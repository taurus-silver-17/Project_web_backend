"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var app = express(), handles = require('./handles'), metrics = require("./metrics"), path = require('path'), bodyparser = require('body-parser');
var port = process.env.PORT || '8080';
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use("/", handles);
app.get('/metrics/:id', function (req, res) {
    dbMet.getOne(req.params.id, function (err, result) {
        if (err)
            throw err;
        res.status(200).send();
    });
});
app.get('/metrics.json', function (req, res) {
    dbMet.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.delete("/metrics/:id", function (req, res) {
    dbMet.delete(req.params.id, function (err, result) {
        if (err)
            res.send({ err: err });
        else
            res.status(200).send("saved");
    });
});
app.post('/metrics/:id', function (req, res) {
    dbMet.save(req.params.id, req.body, function (err) {
        if (err)
            throw err;
        res.status(200).send();
    });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
