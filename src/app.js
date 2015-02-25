var config = require('config');
var express = require('express');
var db = require('./db');
var controllers = require('require-directory')(module, 'controllers');
var auth = require('./auth');

module.exports = function() {

    var app = express();
    var api = express.Router();

    app.start = function(callback) {

        this.server = app.listen(config.port || 8000);

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

    var authenticate = auth(app);

    api.get('/', controllers.info.get);
    api.post('/user', authenticate('signup'), function(req, res) {
        res.send(req.user);
    });

    api.use('*', authenticate('basic'));

    api.get('/user', function(req, res) {
        res.send(req.user);
    });

    app.use(require('body-parser').json());
    app.use('/', require('express').static('src/public'));
    app.use('/api', api);

    return app;
};
