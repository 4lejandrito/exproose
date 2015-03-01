var rekuire = require('rekuire');
var mongoose = require('mongoose');
var mapper = require('mean-mock').mapper;
var db = require('mean-mock').db;
var exproose = rekuire('src/exproose');
var rest = require('restler');
var config = require('config');

module.exports = function(data, mappings) {

    var mapperPort = 8001;
    var app = this;
    try {
        data = data || rekuire('test/sample/data/db') || {};
        mappings = mappings || rekuire('test/sample/data/mappings') || {};
        mapperPort = config.mapper.port;
    } catch (e) {}

    beforeEach(function(done) {
        mapper.start(mapperPort || 8001, mappings, function() {
            app.start(function() {
                db.apply(app.connection.db, data, done);
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
