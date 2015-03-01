var express = require('express');
var controllers = require('require-directory')(module, 'controllers');
var auth = require('./auth');
var mongoose = require('mongoose');
var User = require('./user');
var Config = require('config').constructor;

var Application = module.exports = function() {
    this.config = new Config();

    this.app = express();
    this.api = express.Router();

    var authenticate = auth(this);

    this.api.get('/', controllers.info.get);
    this.api.post('/user', authenticate('signup'), controllers.user.get);
    this.api.use('*', authenticate('basic'));
    this.api.get('/user', controllers.user.get);

    this.app.use(require('body-parser').json());
    this.app.use('/', require('express').static('src/public'));
    this.app.use('/api', this.api);
};

Application.prototype = {

    setup: require('./setup'),

    model: function(name, plugins) {
        var Schema = new (mongoose.Schema)();
        plugins.forEach(function(plugin) { Schema.plugin(plugin); });
        return this.connection.model(name, Schema);
    },

    start: function(callback) {
        var self = this;
        this.connection = mongoose.createConnection(this.config.db.url);

        this.connection.on('connected', function() {
            self.User = self.model('user', [User]);
            self.server = self.app.listen(self.config.port || 8000, callback);
        });
    },

    stop: function(callback) {
        var self = this;
        this.server.close(function() {
            self.connection.close(callback);
        });
    }
};
