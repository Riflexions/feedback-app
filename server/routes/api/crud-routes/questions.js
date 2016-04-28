/**
 * Created by Chirag on 28-04-2016.
 */
var modelName = 'question',
    fieldSelection = ['_id', 'text', 'type', 'options', 'createdAt', 'updatedAt'],
    volatileFields = ['text', 'type', 'options'],
    requiredFields = ['text', 'type'];

var router = require('./../../../utils').createCrudRoute(modelName, fieldSelection, volatileFields, requiredFields);

module.exports = router;