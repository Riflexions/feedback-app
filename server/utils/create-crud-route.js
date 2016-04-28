/**
 * Created by Chirag on 28-04-2016.
 */
var express = require('express');
var pluralize = require('./pluralize');
var pick = require('./pick');
module.exports = function (modelName, fieldSelection, volatileFields, requiredFields) {
    var Model = require('./../models/' + modelName);
    var router = express.Router();
    //var fieldSelection = ['_id', 'text', 'type', 'options', 'createdAt', 'updatedAt'];
    //var volatileFields = ['text', 'type', 'options'];


    router.post('/', function (req, res) {
        var q = req.body[modelName];
        var valid = requiredFields.reduce(function (m, d) {
            return (q[d] && m);
        }, true);
        if (!(q && valid))
            res.boom.badRequest('Missing fields');

        // Create a new instance of the model
        var entity = new Model();

        // Set the properties that came from the POST data
        var postKeys = Object.keys(q).filter(function (d) {
            return fieldSelection.indexOf(d) > -1;
        });
        postKeys.forEach(function (d) {
            entity[d] = q[d];
        });

        // Save the beer and check for errors
        entity.save(function (err) {
            if (!err) {
                var d = {};
                d[modelName] = pick(entity, fieldSelection);
                res.status(201).json(d);
            }
            else if (err.code == 11000) {
                res.boom.conflict('Model with same text already exists!');

            }
            else {
                res.boom.badImplementation();
            }


        });

    });

    router.get('/', function (req, res) {
        //Query Params: page, limit
        var options = req.query || {};

        options.page = options.page ? +options.page : 1;
        options.limit = options.limit ? +options.limit : 10;
        options.select = options.select ? options.select : fieldSelection.join(' ');
        // Use the Model model to find all questions
        Model.paginate({}, options, function (err, result) {
            if (!err) {
                var d = {};
                d[pluralize(modelName)] = result.docs;
                d['meta'] = pick(result, ['total', 'limit', 'page', 'pages']);
                res.json(d);
            }
            else {
                console.error(err);
                res.boom.badImplementation();
            }

        });

    })
    ;
    router.get('/:id', function (req, res) {
        // Use the Model model to find a specific Model
        Model.findById(req.params.id, function (err, entity) {
            if (!err && entity) {
                var d = {};
                d[modelName] = pick(entity, fieldSelection);
                res.json(d);
            }
            else if (!entity) {
                res.boom.notFound('No matching ID');
            }
            else {
                res.boom.badImplementation();
            }
        });
    });


    router.put('/:id', function (req, res) {
        var q = req.body[modelName];

        if (!q) {
            res.boom.badRequest('Missing fields');
        }
        // Use the Model model to find a specific Model
        Model.findById(req.params.id, function (err, entity) {
            if (!err && entity) {
                volatileFields.forEach(function (field) {
                    entity[field] = q[field] ? q[field] : entity[field];
                });
                entity.save(function (err) {
                    if (!err) {
                        var d = {};
                        d[modelName] = pick(entity, fieldSelection);
                        res.status(201).json(d);
                    }
                    else if (err.code == 11000) {
                        res.boom.conflict('Model with same text already exists!');

                    }
                    else {
                        res.boom.badImplementation();
                    }


                });
            }
            else if (!entity) {
                res.boom.notFound('No matching ID');
            }
            else {
                res.boom.badImplementation();
            }
        });
    });


    router.delete('/:id', function (req, res) {
        // Use the Model model to find a specific Model and remove it
        Model.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                res.send(err);
            else
                res.json({});
        });
    });
    return router;
};