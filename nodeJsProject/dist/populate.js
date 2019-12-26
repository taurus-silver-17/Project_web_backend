"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
var dbUser;
var dbMet;
leveldb_1.LevelDB.clear("./db/users");
leveldb_1.LevelDB.clear("./db/metrics");
dbUser = new user_1.UserHandler("./db/users");
dbMet = new metrics_1.MetricsHandler("./db/metrics");
var newUsers = [
    new user_1.User("test", "t@t", "test"),
    new user_1.User("Lilian", "Lilian.delaplace@gmail.com", "test"),
];
var met = new metrics_1.Metric("" + new Date("2019-15-10").getTime(), 231);
var met2 = new metrics_1.Metric("" + new Date("2018-14-09").getTime(), 634);
var met3 = new metrics_1.Metric("" + new Date("2017-13-08").getTime(), 118);
var met4 = new metrics_1.Metric("" + new Date("2013-17-12").getTime(), 272);
var met5 = new metrics_1.Metric("" + new Date("2012-09-09").getTime(), 143);
var met6 = new metrics_1.Metric("" + new Date("2014-13-08").getTime(), 543);
var met7 = new metrics_1.Metric("" + new Date("2017-15-10").getTime(), 234);
dbUser.save(newUsers[0], function (err) { });
dbUser.save(newUsers[1], function (err) { });
dbMet.save(newUsers[0].username, met, function (err) { });
dbMet.save(newUsers[0].username, met2, function (err) { });
dbMet.save(newUsers[0].username, met3, function (err) { });
dbMet.save(newUsers[1].username, met4, function (err) { });
dbMet.save(newUsers[1].username, met5, function (err) { });
dbMet.save(newUsers[1].username, met6, function (err) { });
dbMet.save(newUsers[1].username, met7, function (err) { });
