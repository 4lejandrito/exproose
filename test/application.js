require('./helper');

var rekuire = require('rekuire');
var Application = rekuire('src/application');
var config = require('config');
var express = require('express');
var mongoose = rekuire('mongoose');

describe("Application", function() {

    var app;

    beforeEach(function() {
        app = new Application();
    });

    describe('.app', function() {
        it("is the express app", function() {
            expect(app.app).to.have.property('use');
            expect(app.app).to.have.property('all');
            expect(app.app).to.have.property('get');
            expect(app.app).to.have.property('post');
            expect(app.app).to.have.property('put');
            expect(app.app).to.have.property('delete');
        });
    });

    describe('.api', function() {
        it('is the /api express router', function() {
            expect(Object.getPrototypeOf(app.api)).to.eq(express.Router);
        });
    });

    describe('start(callback)', function() {
        afterEach(function(done) {
            app.stop(done);
        });

        describe('starts the mongo database', function() {
            it("in the URL from config.db.url", function(done) {
                sinon.spy(mongoose, 'createConnection');

                app.start(function() {
                    expect(mongoose.createConnection)
                    .to.have.been.calledWith(app.config.db.url);
                    done();
                });
            });
        });

        describe('starts the express app', function() {
            it("in the port specified in config.port", function(done) {
                sinon.spy(app.app, 'listen');

                app.start(function() {
                    expect(app.app.listen)
                    .to.have.been.calledWith(app.config.port);
                    done();
                });
            });

            it("in the port 8000 if no port is present in config.port", function(done) {
                sinon.spy(app.app, 'listen');

                delete app.config.port;

                app.start(function() {
                    expect(app.app.listen)
                    .to.have.been.calledWith(8000);
                    done();
                });
            });

            it("and puts the server in app.server", function(done) {
                app.start(function() {
                    expect(app.server).to.be.an.instanceOf(require('http').Server);
                    done();
                });
            });
        });
    });

    describe('stop(callback)', function() {
        beforeEach(function(done) {
            app.start(done);
        });

        it("closes the server", function(done) {
            sinon.spy(app.server, 'close');

            app.stop(function() {
                expect(app.server.close).to.have.been.called;
                done();
            });
        });

        it("closes the database", function(done) {
            sinon.spy(app.connection, 'close');

            app.stop(function() {
                expect(app.connection.close).to.have.been.called;
                done();
            });
        });
    });

    describe('model(name, plugin)', function() {
        afterEach(function(done) {
            app.stop(done);
        });

        it("returns a mongoose model class with the given plugin applied", function(done) {
            app.start(function() {
                var Model = app.model('test', function(schema, options) {
                    schema.add({testProp: { type: String, required: true}});
                    schema.methods.testMethod = function() {};
                });
                expect(Object.getPrototypeOf(Model)).to.eq(mongoose.Model);
                expect(Model.modelName).to.eq('test');
                expect(Model.schema.paths).to.have.property('testProp');
                expect(Model.prototype.testMethod).to.be.a('function');
                expect(Model.collection.conn).to.eq(app.connection);
                done();
            });
        });
    });

    it(".setup is the test setup function", function() {
        expect(app.setup).to.equal(rekuire('src/setup'));
    });

    it(".config is an instance of the config from the config module", function() {
        expect(app.config).to.be.an.instanceOf(config.constructor);
    });
});
