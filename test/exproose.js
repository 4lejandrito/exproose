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
});
