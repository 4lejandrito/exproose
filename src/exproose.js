var Application = require('./application');

var exproose = module.exports = function() {
    return new Application();
};

exproose.config = require('config');
