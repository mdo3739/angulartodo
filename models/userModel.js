var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new Schema({
  email: String,
  password: String,
  username: String,
  memberSince: {type: Date, default: Date.now()},
  admin: {type:Boolean, default: false}
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

module.exports = User;