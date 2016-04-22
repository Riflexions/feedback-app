/**
 * Created by Chirag on 16-04-2016.
 */
var express = require('express');
var User = require('./../../models/user');
var router = express.Router();
var Utils=require('./../../utils');
/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find().then(function(data){
        data=data.map(function(d){
            return  Utils.pick(d, ['firstname', 'lastname', 'email', 'createdAt','updatedAt']);
        });
        res.json({users:data});
    });

});
module.exports=router;