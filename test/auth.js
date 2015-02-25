var rekuire = require('rekuire');
var expect = require('chai').expect;
var exproose = rekuire('src/exproose');

describe("API Authentication", function() {

    var app = exproose();
    app.api().get('/test', function(req, res) {
        res.send('authenticated');
    });
    var client = exproose.setup(app);

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
