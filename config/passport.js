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

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){

            User.findOne({'email': email.toUpperCase()}, function(err, user){
                if(err) return done(err);
                if(user){
                    return done(null, false, {message: "You already have an account!"});
                } else{
                    var newUser = new User();
                    newUser.email = email.toUpperCase();
                    newUser.password = newUser.generateHash(password);
                    newUser.save(function(err){
                        if(err) throw err;
                        return done(null, newUser, {message: 'Account Created. Please confirm you email'});
                    });
                }
            });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({'email': email.toUpperCase()}, function(err, user){
            if(err) return done(err);
            if(!user){
                return done(null, false, {message: "User Not Found"});
            }
            if (!user.validPassword(password)){
                return done(null, false, {message: "Wrong Password"});
            }

            // all is well, return successful user
            return done(null, user, {message: "Logged In"});
        });
    }));
}; 