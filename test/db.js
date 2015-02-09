var rekuire = require('rekuire');
var chai = require("chai");
chai.use(require("sinon-chai"));
var expect = chai.expect;
var db = rekuire('src/util/db');
var sinon = require('sinon').sandbox.create();
var mongoose = require('mongoose');
var config = require('config');

describe("exproose().db()", function() {

    afterEach(function() {
        sinon.restore();
    });

    describe('start()', function() {
        it("opens the mongoose connection on start with the url from config", function() {
            sinon.stub(mongoose, 'connect');
            var callback = sinon.spy();

            db.start(callback);

            expect(mongoose.connect).to.have.been.calledWith(
                config.db.url,
                callback
            );
        });
    });

    describe('stop()', function() {
        it("closes the mongoose connection on stop", function() {
            sinon.stub(mongoose.connection, 'close');
            var callback = sinon.spy();

            db.stop(callback);

            expect(mongoose.connection.close).to.have.been.calledWith(callback);
        });
    });
});
