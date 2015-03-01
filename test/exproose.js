require('./helper');

var rekuire = require('rekuire');
var exproose = rekuire('src/exproose');

describe("exproose", function() {

    it('is a function', function() {
        expect(exproose).to.be.a('function');
    });

    describe('when called with no arguments', function() {
        it('returns an instance of application', function() {
            expect(exproose()).to.be.instanceOf(rekuire('src/application'));
        });
    });

    describe('has the properties', function() {
        describe('config', function() {
            it("is the config module", function() {
                expect(exproose.config).to.eq(require('config'));
            });
        });
    });
});
