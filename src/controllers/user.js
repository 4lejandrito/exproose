module.exports = {
    get: function(req, res) {
        res.send(req.user);
    }
};
