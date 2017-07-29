var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var confirmSchema = new Schema({
  userId: String,
  hash: String
});

var Confirm = mongoose.model('Confirm', confirmSchema);

module.exports = Confirm;