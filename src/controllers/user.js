module.exports = {
    get: function(req, res) {
        res.send(req.user);
    },

    create: function(req, res) {
        var users = req.app.db.get('users');
        var email = req.body.email;
        var password = req.body.password;

        users.findOne({email: email}, function(err, user) {
            if (err) throw err;
            if (user) {
                return res.status(400).send('Existing user');
            } else {
                users.insert({email: email, password: password}, function(err, user) {
                    if (err) throw err;
                    res.send(user);
                });
            }
        });
    }
};
