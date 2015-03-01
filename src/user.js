var mongoose = require('mongoose');

module.exports = function(schema) {
    schema.add({
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        date: { type: Date, default: Date.now }
    });

    schema.set('toJSON', {
        transform: function(doc, ret, options) {
            delete ret.password;
            return ret;
        }
    });

    schema.methods.validPassword = function(password) {
        return password === this.password;
    };
};
