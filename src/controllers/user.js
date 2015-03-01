module.exports = {
    get: function(req, res) {
        res.send(req.user);
    },

    create: function(req, res) {
        var email = req.body.email;
        var password = req.body.password;

        req.app.User.findOne({email: email}, function(err, user) {
            if (err) throw err;
            if (user) {
                return res.send(400, 'Existing user');
            } else {
                new req.app.User({email: email, password: password}).save(function(err, user) {
                    if (err) throw err;
                    res.send(user);
                });
            }
        });
    }
};
