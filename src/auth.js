var passport        = require('passport');
var BasicStrategy   = require('passport-http').BasicStrategy;
var User            = require('./user');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new BasicStrategy(function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.validPassword(password)) { return done(null, false); }
        return done(null, user);
    });
}));

passport.use('signup', new BasicStrategy(function(username, password, done) {
    User.findOne({email: username}, function(err, user) {
        if (err) return done(err);
        if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
            new User({email: username, password: password}).save(function(err, user) {
                if (err) throw err;
                return done(null, user);
            });
        }
    });
}));

module.exports = function(app) {
    app.api().use(passport.initialize());
    return function(type) {
        return passport.authenticate(type);
    };
};
