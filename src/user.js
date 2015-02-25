var mongoose = require('mongoose');

var User = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now }
});

User.methods.validPassword = function(password) {
    return password === this.password;
};

module.exports = mongoose.model('user', User);
