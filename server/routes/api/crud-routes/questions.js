/**
 * Created by Chirag on 28-04-2016.
 */

module.exports = require('./../../../utils').createCrudRoute('question', ['_id', 'text', 'type', 'options', 'createdAt', 'updatedAt'], ['text', 'type', 'options'], ['text', 'type']);