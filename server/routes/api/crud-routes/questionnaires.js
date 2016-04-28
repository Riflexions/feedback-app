/**
 * Created by Chirag on 28-04-2016.
 */
var modelName = 'questionnaire',
    fieldSelection = ['_id', 'name', 'questions'],
    volatileFields = ['name', 'questions'],
    requiredFields = ['name', 'questions'];

var router = require('./../../../utils').createCrudRoute(modelName, fieldSelection, volatileFields, requiredFields);


module.exports = router;