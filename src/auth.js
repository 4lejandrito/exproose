var Passport        = require('passport').Passport;
var BasicStrategy   = require('passport-http').BasicStrategy;

module.exports = function(app) {
    var passport = new Passport();

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        app.User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new BasicStrategy(function(username, password, done) {
        app.User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }));

    app.api.use(passport.initialize());
    return function(type) {
        return passport.authenticate(type);
    };
};
