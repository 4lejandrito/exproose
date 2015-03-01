require('./helper');

var rekuire = require('rekuire');
var exproose = rekuire('src/exproose');

describe("REST API", function() {

    describe("authentication", function() {

        var app = exproose();
        app.api.get('/test', function(req, res) {
            res.send('authenticated');
        });
        var client = app.setup();

        it('adds basic auth to every endpoint', function(done) {
            client.get('/api/test', {
                username: '1@example.com',
                password: '1234'
            }).on('complete', function(data) {
                expect(data).to.eq('authenticated');
                done();
            });
        });

        it('returns 401 Unauthorized if the password is wrong', function(done) {
            client.get('/api/test', {
                username: '1@example.com',
                password: '12345'
            }).on('complete', function(data, response) {
                expect(response.statusCode).to.eq(401);
                expect(data).to.eq('Unauthorized');
                done();
            });
        });
    });

    describe("the request object", function() {

        var app = exproose();
        app.api.get('/test', function(req, res) {
            res.send(req.app === app);
        });
        var client = app.setup();

        it('includes the app', function(done) {
            client.get('/api/test', {
                username: '1@example.com',
                password: '1234'
            }).on('complete', function(data) {
                expect(data).to.eq(true);
                done();
            });
        });
    });

    describe('/api', function() {
        var client = exproose().setup();

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
                it('creates a new user and returns it', function(done) {
                    client.post('/api/user', {
                        query: {
                            email: 'alejandro@tardin.com',
                            password: '1234'
                        }
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
