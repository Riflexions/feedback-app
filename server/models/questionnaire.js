/**
 * Created by Chirag on 27-04-2016.
 */
// Load required packages
var mongoose = require('mongoose');
var Question = require("question");
var timestamps = require('mongoose-timestamp');
var mongoosePaginate = require('mongoose-paginate');

// Define our Questionnaire schema
var QuestionnaireSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    questions: [Question]
});

//Add auto timestamping
QuestionnaireSchema.plugin(timestamps);

//Add Pagination
mongoosePaginate(QuestionnaireSchema);

// Export the Mongoose model
module.exports = mongoose.model('questionnaires', QuestionnaireSchema);