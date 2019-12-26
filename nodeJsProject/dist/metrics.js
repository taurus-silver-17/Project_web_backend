"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    Metric.fromDb = function (key, value) {
        var _a = key.split(":"), type = _a[0], user = _a[1], timestamp = _a[2];
        return { user: user, timestamp: timestamp, value: value };
    };
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    MetricsHandler.prototype.getOne = function (key, callback) {
        if (key != null) {
            this.db.get(key, function (err, res) {
                if (err)
                    callback(err, null);
                else
                    callback(null, res);
            });
        }
        else
            callback(new Error("there is no key"), null);
    };
    MetricsHandler.prototype.get = function (user, callback) {
        var Data = Array();
        var result = this.db.createReadStream()
            .on('data', function (data) {
            var MetricToGet;
            MetricToGet = Metric.fromDb(data.key, data.value);
            if (MetricToGet.user === user)
                Data.push(MetricToGet);
        })
            .on('error', function (err) {
            callback(err, []);
        })
            .on('close', function () {
            callback(null, Data);
        });
    };
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var metric = new Metric(metrics[0].metric_date, metrics[0].metric_value);
        this.db.put("metrics:" + key + ":" + metric.timestamp, "" + metric.value, function (err) {
            callback(err);
        });
    };
    MetricsHandler.prototype.delete = function (key, callback) {
        this.db.del(key, function (err, res) {
            if (err)
                callback(err, null);
            else
                callback(null, res);
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
