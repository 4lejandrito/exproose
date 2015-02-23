var rekuire = require('rekuire');
var config = require('config');
var mongoose = require('mongoose');
var mapper = require('mean-mock').mapper;
var db = require('mean-mock').db;
var exproose = rekuire('src/exproose');

module.exports = function(app, data, mappings) {

    try {
        app = app || exproose();
        mappings = mappings || rekuire('test/sample/data/db') || {};
    } catch (e) {}

    beforeEach(function(done) {
        mapper.start(config.mapper.port, mappings, function() {
            app.start(function() {
                db.apply(mongoose.connection.db, data, done);
            });
        });
    });

    afterEach(function(done) {
        app.stop(function() {
            mapper.stop(done);
        });
    });

    return {
        url: function(path) {
            return 'http://localhost:' + config.port + path;
        },
        http: rekuire('src/util/rest')
    };

};
