"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_down_1 = require("encoding-down");
var leveldown_1 = require("leveldown");
var levelup_1 = require("levelup");
var LevelDB = /** @class */ (function () {
    function LevelDB() {
    }
    LevelDB.open = function (path) {
        var encoded = encoding_down_1.default(leveldown_1.default(path), { valueEncoding: 'json' });
        return levelup_1.default(encoded);
    };
    return LevelDB;
}());
exports.LevelDB = LevelDB;
