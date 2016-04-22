/**
 * Created by Chirag on 16-04-2016.
 */
var express = require('express');
var User = require('./../../models/user');
var router = express.Router();

router.post('/', function (req, res, next) {
    var user = req.body.user;
    if (!(user && user.password && user.email))
        res.boom.badRequest('Missing fields');

    User.authenticate(user.email, user.password, function (err, user) {
        if (err)
            res.status(403).json(err);
        else if (!user)
            res.boom.unauthorized();
        else {
            res.json(user);
        }
    });

});
module.exports = router;