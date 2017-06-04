var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  username: String,
  memberSince: {type: Date, default: Date.now()},
  admin: {type:Boolean, default: false}
});

var User = mongoose.model('User', userSchema);

module.exports = User;