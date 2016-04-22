/**
 * Created by Chirag on 16-04-2016.
 */
var jwt=require('jsonwebtoken');
var config=require('./../../../config');
function auth(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ error: {code:403, message:"Invalid token"}});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ error: {code:403, message:"Missing token"}});

    }
};
module.exports.auth=auth;