var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    userId: String,
    todo: String,
    dateCreated: { type: Date, default: Date.now() },
    completed: {type: Boolean, default: false}
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;