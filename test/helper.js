var chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon').sandbox.create();
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

beforeEach(function() {
    sinon.restore();
});
