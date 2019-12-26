"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_down_1 = require("encoding-down");
var leveldown_1 = require("leveldown");
var levelup_1 = require("levelup");
var fs = require("fs");
var del = require("del");
var LevelDB = /** @class */ (function () {
    function LevelDB() {
    }
    LevelDB.open = function (path) {
        var encoded = encoding_down_1.default(leveldown_1.default(path), { valueEncoding: 'json' });
        return levelup_1.default(encoded);
    };
    LevelDB.clear = function (path) {
        if (fs.existsSync(path)) {
            del.sync(path, { force: true });
        }
    };
    return LevelDB;
}());
exports.LevelDB = LevelDB;
