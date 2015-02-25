var rekuire = require('rekuire');
var chai = require("chai");
chai.use(require("sinon-chai"));
var expect = chai.expect;
var sinon = require('sinon').sandbox.create();
var exproose = rekuire('src/exproose');
var config = require('config');
var db = rekuire('src/db');
var express = require('express');
var mongoose = rekuire('mongoose');

describe("exproose model", function() {

    it("is a function", function() {
        expect(exproose.model).to.be.a('function');
    });

    describe('when called with (name, plugin)', function() {
        it("returns a mongoose model class with the given plugin applied", function() {
            var Model = exproose.model('test', function(schema, options) {
                schema.add({testProp: { type: String, required: true}});
                schema.methods.testMethod = function() {};
            });
            expect(Object.getPrototypeOf(Model)).to.eq(mongoose.Model);
            expect(Model.modelName).to.eq('test');
            expect(Model.schema.paths).to.have.property('testProp');
            expect(Model.prototype.testMethod).to.be.a('function');
        });
    });
});
