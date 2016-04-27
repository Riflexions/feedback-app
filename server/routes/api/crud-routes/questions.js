/**
 * Created by Chirag on 27-04-2016.
 */
var express = require('express');
var Question = require('./../../../models/question');
var Utils = require('./../../../utils');
var router = express.Router();
var fieldSelection = ['_id', 'text', 'type', 'options', 'createdAt', 'updatedAt'];
var volatileFields = ['text', 'type', 'options'];
router.post('/', function (req, res) {
    var q = req.body.question;
    if (!(q && q.text && q.type))
        res.boom.badRequest('Missing fields');

    // Create a new instance of the Beer model
    var question = new Question();

    // Set the beer properties that came from the POST data
    question.text = q.text;
    question.type = q.type;
    question.options = q.options ? q.options : [];

    // Save the beer and check for errors
    question.save(function (err) {
        if (!err) {
            res.status(201).json({question: Utils.pick(question, fieldSelection)});
        }
        else if (err.code == 11000) {
            res.boom.conflict('Question with same text already exists!');

        }
        else {
            res.boom.badImplementation();
        }


    });

});

router.get('/', function (req, res) {
    // Use the Question model to find all questions
    Question.find(function (err, questions) {
        if (!err) {
            res.json({
                questions: questions.map(function (d) {
                    return Utils.pick(d, fieldSelection);
                })
            });
        }
        else {
            res.boom.badImplementation();
        }


    });
})
;
router.get('/:id', function (req, res) {
    // Use the Question model to find a specific Question
    Question.findById(req.params.id, function (err, question) {
        if (!err && question) {
            res.json({question: Utils.pick(question, fieldSelection)});
        }
        else if (!question) {
            res.boom.notFound('No matching ID');
        }
        else {
            res.boom.badImplementation();
        }
    });
});


router.put('/:id', function (req, res) {
    var q = req.body.question;

    if (!q) {
        res.boom.badRequest('Missing fields');
    }
    // Use the Question model to find a specific Question
    Question.findById(req.params.id, function (err, question) {
        if (!err && question) {
            volatileFields.forEach(function (field) {
                question[field] = q[field] ? q[field] : question[field];
            });
            question.save(function (err) {
                if (!err) {
                    res.status(201).json({question: Utils.pick(question, fieldSelection)});
                }
                else if (err.code == 11000) {
                    res.boom.conflict('Question with same text already exists!');

                }
                else {
                    res.boom.badImplementation();
                }


            });
        }
        else if (!question) {
            res.boom.notFound('No matching ID');
        }
        else {
            res.boom.badImplementation();
        }
    });
});


router.delete('/:id', function (req, res) {
    // Use the Question model to find a specific Question and remove it
    Question.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else
            res.json({});
    });
});
module.exports = router;