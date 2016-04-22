/**
 * Created by Chirag on 16-04-2016.
 */
var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('API home');
});


var authenticate=require('./authenticate');
var signup=require('./signup');
var users=require('./users');
var authMiddleware=require('./middleware/jwt-auth-verify').auth;


router.use('/authenticate',authenticate);
router.use('/signup',signup);
router.use(authMiddleware);
router.use('/users',users);

module.exports=router;