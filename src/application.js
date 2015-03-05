var express = require('express');
var controllers = require('require-directory')(module, 'controllers');
var auth = require('./auth');
var monk = require('monk');
var bodyParser = require('body-parser');
var config = require('config');
var extend = require('extend');

var Application = module.exports = function() {
    this.app = express();
    this.api = express.Router();

    var authenticate = auth(this);

    var self = this;
    this.app.use('*', function(req, res, next) {
        req.app = self; next();
    });

    this.api.get('/', controllers.info.get);
    this.api.post('/user', controllers.user.create);
    this.api.use('*', authenticate('basic'));
    this.api.get('/user', controllers.user.get);

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use('/', express.static('src/public'));
    this.app.use('/api', this.api);
};

Application.prototype = {

    setup: require('./setup'),

    start: function(callback) {
        var self = this;
        this.db = monk(config.db.url).on('open', function() {
            self.server = self.app.listen(config.port || 8000, callback);
        });
    },

    stop: function(callback) {
        var self = this;
        this.server.close(function() {
            self.db.close(callback);
        });
    }
};
