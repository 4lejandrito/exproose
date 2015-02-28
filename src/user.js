var mongoose = require('mongoose');

module.exports = function(schema) {
    schema.add({
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        date: { type: Date, default: Date.now }
    });

    schema.methods.validPassword = function(password) {
        return password === this.password;
    };
};
