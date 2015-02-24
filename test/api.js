var rekuire = require('rekuire');
var expect = require('chai').expect;
var exproose = rekuire('src/exproose');

describe("REST API", function() {

    var http = exproose.setup(exproose());

    describe('/api', function() {
        it("/ returns the version from the process package.json", function (done) {
            http.get('/api').on('success', function(data, response) {
                expect(response.statusCode).to.equal(200);
                expect(data).to.eql({
                    version: require(process.cwd() + '/package.json').version
                });
                done();
            });
        });
    });
});
