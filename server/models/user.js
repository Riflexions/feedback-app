/*Source:
 https://raw.githubusercontent.com/mekentosj/oauth2-example/master/models/user.js

 */

var bcrypt = require('bcrypt');
//var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var timestamps = require('mongoose-timestamp');
var Utils = require('./../utils');
//var ValidationError = require('./../errors').ValidationError;
var boom = require('boom');

config = require('./../config'); // get our config file
// =======================
// configuration =========
// =======================
var secret = config.secret;

var UsersSchema = new Schema({
    email: {type: String, unique: true, required: true},
    hashed_password: {type: String, required: true},
    firstname: String,
    lastname: String
});

function hashPassword(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

UsersSchema.static('register', function (fields, cb) {
    var user;

    fields.hashed_password = hashPassword(fields.password);
    delete fields.password;
    user = new OAuthUsersModel(fields);
    user.save(function (err, user) {
        if (err || !user) return cb(boom.badRequest('Email already exists. Please login').output.payload, null);
        return cb(null, Utils.pick(user, ['firstname', 'lastname', 'email', 'createdAt', 'updatedAt']));

    });
});


UsersSchema.static('authenticate', function (email, password, cb) {
    this.findOne({email: email}, function (err, user) {
        if (err || !user) return cb(boom.unauthorized('Invalid username or password').output.payload);
        var userProjection = Utils.pick(user, ['firstname', 'lastname', 'email', 'createdAt', 'updatedAt']);
        var token = jwt.sign(userProjection, secret, {
            expiresIn: 1440 * 60// expires in 24 hours
        });
        if (bcrypt.compareSync(password, user.hashed_password))
        return    cb(null, {
                user: userProjection,
                token: token
            });

        cb(boom.unauthorized('Invalid username or password').output.payload);
    });
});


UsersSchema.plugin(timestamps);
mongoose.model('users', UsersSchema);

var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;
