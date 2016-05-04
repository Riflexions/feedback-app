/**
 * Created by Chirag on 16-04-2016.
 */

var express = require('express');
var User = require('./../../models/user');
var router = express.Router();
var pick = require('./../../utils/pick');

/* GET users listing. */

var fieldSelection = ['_id', 'firstname', 'lastname', 'email', 'createdAt', 'updatedAt'];

router.get('/', function (req, res, next) {

    var options = req.query || {};

    options.page = options.page ? +options.page : 1;
    options.limit = options.limit ? +options.limit : 10;
    options.select = options.select ? options.select : fieldSelection.join(' ');

    // Use the Model model to find all entities
    User.paginate({}, options, function (err, result) {
        if (!err) {
            var d = {};
            d['users'] = result.docs;
            d['meta'] = pick(result, ['total', 'limit', 'page', 'pages']);
            res.json(d);
        }
        else {
            console.error(err);
            res.boom.badImplementation();
        }

    });

});

module.exports = router;