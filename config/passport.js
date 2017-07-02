var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userModel.js');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({'email': email.toUpperCase()}, function(err, user){
            if(err) return done(err);
            if(!user){
                console.log("User not found");
                return done(null, false);
            }
            if (!user.validPassword(password)){
                console.log("Wrong Password");
                return done(null, false);
            }

            // all is well, return successful user
            return done(null, user);
        });
    }));
}; 