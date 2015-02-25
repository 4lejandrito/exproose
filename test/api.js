var rekuire = require('rekuire');
var expect = require('chai').expect;
var exproose = rekuire('src/exproose');

describe("REST API", function() {

    var client = exproose.setup(exproose());

    describe('/api', function() {
        describe('/', function() {
            it('returns the version from the process package.json', function (done) {
                client.get('/api').on('success', function(data, response) {
                    expect(response.statusCode).to.equal(200);
                    expect(data).to.eql({
                        version: require(process.cwd() + '/package.json').version
                    });
                    done();
                });
            });
        });

        describe('/user', function() {
            describe('POST', function() {
                it('creates a new user through basic auth and returns it', function(done) {
                    client.post('/api/user', {
                        username: 'alejandro@tardin.com',
                        password: '1234'
                    }).on('complete', function(data) {
                        expect(data).to.include({
                            email: 'alejandro@tardin.com'
                        })//.and.not.to.have.property('password');
                        done();
                    });
                });
            });

            describe('GET', function() {
                it('returns the user from the basic auth', function(done) {
                    client.get('/api/user', {
                        username: '1@example.com',
                        password: '1234'
                    }).on('complete', function(data) {
                        expect(data).to.include({
                            email: '1@example.com'
                        })//.and.not.to.have.property('password');
                        done();
                    });
                });
            });
        });
    });
});
