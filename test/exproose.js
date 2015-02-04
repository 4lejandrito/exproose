var rekuire = require('rekuire');
var chai = require("chai");
chai.use(require("sinon-chai"));
var expect = chai.expect;
var sinon = require('sinon').sandbox.create();
var exproose = rekuire('src/exproose');
var config = require('config');
var db = rekuire('src/util/db');
var express = require('express');

describe("MEAN Web", function() {

    it("includes a rest client", function() {
        expect(exproose).to.have.property('rest').and.equal(rekuire('src/util/rest'));
    });

    it("includes the test setup function", function() {
        expect(exproose).to.have.property('setup').and.equal(rekuire('src/util/setup'));
    });

    it("includes the config from the config module", function() {
        expect(exproose).to.have.property('config').and.equal(config);
    });

    describe('App', function() {

        afterEach(function() {
            sinon.restore();
        });

        var app = exproose();

        it("is the express app", function() {
            expect(app).to.have.property('use');
            expect(app).to.have.property('all');
            expect(app).to.have.property('get');
            expect(app).to.have.property('post');
            expect(app).to.have.property('put');
            expect(app).to.have.property('delete');
        });

        describe('api', function() {
            it('returns the /api router', function() {
                expect(app.api().__proto__).to.eq(express.Router);
            });
        });

        describe('start', function() {

            it("calls express listen with the default port", function() {
                sinon.stub(app, 'listen').returns({on: sinon.stub()});
                var callback = function() {}
                var oldPort = config.port;

                delete config.port;
                app.start(callback);

                expect(app.listen).to.have.been.calledWith(8000);

                config.port = oldPort;
            });

            it("calls express listen with the port on config", function() {
                sinon.stub(app, 'listen').returns({on: sinon.stub()});
                var callback = function() {}

                app.start(callback);

                expect(app.listen).to.have.been.calledWith(config.port);
            });

            it("starts the db when the server is listening", function() {
                var server = {on: sinon.stub().withArgs('listening')};
                sinon.stub(app, 'listen').returns(server);
                sinon.stub(db, 'start');

                app.start();

                expect(db.start).not.to.have.been.called;

                server.on.callArg(1);

                expect(db.start).to.have.been.called;
            });

            it("calls the callback when the db has started", function() {
                var server = {on: sinon.stub().withArgs('listening').callsArg(1)};
                var callback = sinon.spy();
                sinon.stub(app, 'listen').returns(server);
                sinon.stub(db, 'start');

                app.start(callback);

                expect(callback).not.to.have.been.called;

                db.start.callArgWith(0, 'arg1', 'arg2');

                expect(callback).to.have.been.calledWith('arg1', 'arg2');
            });
        });

        describe('stop', function() {
            it("closes the server", function() {
                var server = {
                    on: sinon.spy(),
                    close: sinon.spy()
                }, callback = function() {};
                sinon.stub(app, 'listen').returns(server);

                app.start();

                expect(server.close).not.to.have.been.called;

                app.stop(callback);

                expect(server.close).to.have.been.calledWith(callback);
            });

            it("closes the database when the server is closed", function() {
                var server = {on: sinon.stub().withArgs('close')};
                sinon.stub(app, 'listen').returns(server);
                sinon.stub(db, 'stop');

                app.start();

                expect(db.stop).not.to.have.been.called;

                server.on.callArg(1);

                expect(db.stop).to.have.been.called
            });
        });
    });
});
