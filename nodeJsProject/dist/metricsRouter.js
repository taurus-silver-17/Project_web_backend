"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var dbMet = new metrics_1.MetricsHandler("../db/metrics");
var metricsRouter = express.Router();
metricsRouter.get("/:id", function (req, res) {
    dbMet.getOne("metric:" + req.session.user.username + ":" + req.params.id, function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else
            res.status(200).send(result);
    });
});
metricsRouter.get("/", function (req, res) {
    dbMet.get(req.session.user.username, function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else
            res.status(200).send(result);
    });
});
metricsRouter.post("/", function (req, res, next) {
    dbMet.save("" + req.session.user.username, req.body, function (err) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send();
    });
});
metricsRouter.delete("/:id", function (req, res) {
    dbMet.delete("metric:" + req.session.user.username + ":" + req.params.id, function (err, result) {
        if (err)
            res.status(500).send({ err: err });
        else
            res.status(200).send("saved");
    });
});
exports.default = metricsRouter;
