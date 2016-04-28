/**
 * Created by Chirag on 27-04-2016.
 */
// Load required packages
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongoosePaginate = require('mongoose-paginate');

// Define our Question schema
var QuestionSchema = new mongoose.Schema({
    text: {type: String, unique: true, required: true},
    type: {type: String, required: true},
    options: [String]
});

//Add auto timestamping
QuestionSchema.plugin(timestamps);

//Add Pagination
mongoosePaginate(QuestionSchema);

// Export the Mongoose model
module.exports = mongoose.model('questions', QuestionSchema);