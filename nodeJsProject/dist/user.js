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
var leveldb_1 = require("./leveldb");
var User = /** @class */ (function () {
    function User(username, email, password, passwordHashed) {
        if (passwordHashed === void 0) { passwordHashed = false; }
        this.password = "";
        this.username = username;
        this.email = email;
        if (!passwordHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    User.fromDb = function (username, value) {
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new User(username, email, password);
    };
    User.prototype.setPassword = function (toSet) {
        this.password = toSet;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.validatePassword = function (toValidate) {
        console.log(this.password, toValidate);
        if (toValidate == this.password)
            return true;
        else
            return false;
    };
    return User;
}());
exports.User = User;
var UserHandler = /** @class */ (function () {
    function UserHandler(path) {
        this.db = leveldb_1.LevelDB.open(path);
    }
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null);
            else
                callback(null, User.fromDb(username, data));
        });
    };
    UserHandler.prototype.save = function (usr, callback) {
        var user = new User(usr.username, usr.email, usr.password);
        this.db.put("user:" + user.username, user.getPassword() + ":" + user.email, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.delete = function (username, callback) {
        var _this = this;
        this.db.get("user:" + username, function (first_err, first_res) {
            if (first_res != null) {
                _this.db.del("user:" + username, function (err) {
                    if (err)
                        callback(err, null);
                    else {
                        _this.db.get("user:" + username, function (get_err, get_res) {
                            if (get_res)
                                callback("delete failed", null);
                            else
                                callback(null, "delete succeded");
                        });
                    }
                });
            }
            else {
                callback("user not found", null);
            }
        });
    };
    UserHandler.prototype.put = function (username, callback, email, password) {
        var _this = this;
        this.db.get("user:" + username, function (first_err, first_res) {
            if (first_res) {
                var usr_1 = first_res;
                usr_1 = __assign(__assign({}, usr_1), { email: email ? email : usr_1.email, password: password ? password : usr_1.password });
                _this.db.del("user:" + username, function (err) {
                    if (err)
                        callback(err, null);
                    else {
                        _this.db.put("user:" + username, usr_1.password + ":" + usr_1.email, function (put_err) {
                            if (put_err)
                                callback("update failed", null);
                            else
                                callback(null, "update succeded");
                        });
                    }
                });
            }
            else
                callback("user not found", null);
        });
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
