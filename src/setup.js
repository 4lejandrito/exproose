var rekuire = require('rekuire');
var config = require('config');
var mongoose = require('mongoose');
var mapper = require('mean-mock').mapper;
var db = require('mean-mock').db;
var exproose = rekuire('src/exproose');
var rest = require('restler');

module.exports = function(app, data, mappings) {

    var mapperPort = 8001;
    try {
        app = app || exproose();
        data = data || rekuire('test/sample/data/db') || {};
        mappings = mappings || rekuire('test/sample/data/mappings') || {};
        mapperPort = config.mapper.port;
    } catch (e) {}

    beforeEach(function(done) {
        mapper.start(mapperPort || 8001, mappings, function() {
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

    return new (rest.service(function() {}, {
        baseURL: 'http://localhost:' + (config.port || 8000)
    }))();
};
