/**
 * Created by Chirag on 16-04-2016.
 */
var express = require('express');
var User = require('./../../models/user');
var router = express.Router();


router.post('/', function (req, res, next) {
    var user = req.body.user;

    if(!(user && user.firstname && user.password && user.email))
    res.boom.badRequest('Missing fields');
    User.register(user,function (err, user) {
        if (err)
            res.status(500).json(err);
        else if (!user)
            res.boom.badRequest();
        else{
            res.status(201).json({user:user});
        }
    });

});
module.exports=router;