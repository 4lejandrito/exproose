var util = require('util');
var mongoose = require('mongoose');
var config = require('config').db;

var db = {
    start: function(cb) {
        mongoose.connect(config.url, cb);
    },
    stop: function(cb) {
        mongoose.connection.close(cb);
    }
};

module.exports = db;
