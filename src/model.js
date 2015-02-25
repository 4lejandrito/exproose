var mongoose = require('mongoose');

module.exports = function(name, plugin) {
    var Schema = new (mongoose.Schema)();
    Schema.plugin(plugin);
    return mongoose.model(name, Schema);
};
