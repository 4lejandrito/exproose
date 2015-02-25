var config = require('config');
var express = require('express');
var db = require('./util/db');
var controllers = require('require-directory')(module, 'controllers');
var mongoose = require('mongoose');

module.exports = exproose = function() {

    var app = express();
    var api = express.Router();

    app.start = function(callback) {

        var server = this.server = app.listen(config.port || 8000);

        this.server.on('listening', function() {
            db.start(function() {
                if (callback) callback.apply(this, arguments);
            });
        });

        this.server.on('close', function() {
            db.stop();
        });
    };

    app.stop = function(callback) {
        this.server.close(callback);
    };

    app.api = function() {
        return api;
    };

    api.get('/', controllers.info.get);

    app.use(require('body-parser').json());
    app.use('/', require('express').static('src/public'));
    app.use('/api', api);

    return app;
};

exproose.model = function(name, schema) {
    return mongoose.model(name, mongoose.Schema(schema));
};

exproose.config = require('config');
exproose.setup = require('./util/setup');
