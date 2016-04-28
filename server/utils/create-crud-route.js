/**
 * Created by Chirag on 28-04-2016.
 */
var express = require('express');
var pluralize = require('./pluralize');
var pick = require('./pick');

/**
 * Function module which returns a CRUD router object for the specified model
 * @param modelName
 * @param fieldSelection
 * @param volatileFields
 * @param requiredFields
 * @returns {*}
 */
module.exports = function (modelName, fieldSelection, volatileFields, requiredFields) {
    var Model = require('./../models/' + modelName);
    var router = express.Router();

    /**
     * POST /entities
     * accepts JSON POST with all fields in requiredFields to create a new Entity
     */
    router.post('/', function (req, res) {
        var q = req.body[modelName];

        //Ensure all required fields are present
        var valid = requiredFields.reduce(function (m, d) {
            return (q[d] && m);
        }, true);
        if (!(q && valid)) {
            res.boom.badRequest('Missing fields');
            return;
        }


        // Create a new instance of the model
        var entity = new Model();

        // Set the properties that came from the POST data
        var postKeys = Object.keys(q).filter(function (d) {
            return fieldSelection.indexOf(d) > -1;
        });
        postKeys.forEach(function (d) {
            entity[d] = q[d];
        });

        // Save the entity and check for errors
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

    /**
     * GET /entities
     * gives paginated response of all entities
     * Query params: page, limit, select
     */
    router.get('/', function (req, res) {
        //Query Params: page, limit, select
        var options = req.query || {};

        options.page = options.page ? +options.page : 1;
        options.limit = options.limit ? +options.limit : 10;
        options.select = options.select ? options.select : fieldSelection.join(' ');

        // Use the Model model to find all entities
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

    });

    /**
     * GET /entities/:id
     * Returns an entity as specified by :id
     */
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

    /**
     * PUT /entities/:id
     * updates an entity as specified by :id
     */
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

    /**
     * DELETE /entities/:id
     * deletes an entity as specified by :id
     */
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