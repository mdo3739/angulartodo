var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var toDoSchema = new Schema({
    user: String,
    todo: String,
    dateCreated: { type: Date, default: Date.now },
    completed: {type: Boolean, default: false}
});

var ToDo = mongoose.model('ToDo', toDoSchema);

module.exports = ToDo;