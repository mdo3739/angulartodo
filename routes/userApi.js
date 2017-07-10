var express = require('express');
var User = require('../models/userModel');
var config = require('../config/configGetter');

module.exports = function(app, passport){
    var flash = app.locals.messages;
    app.post('/api/user', function(req, res, next){
        passport.authenticate('local-signup', function(err, user, info){
            if(err) throw err;
            if(!user){
                flash.push({type: 'warning', message: info.message});
                res.redirect('/');
            } else {
                user.username = req.body.username;
                user.memberSince = Date.now();
                user.save(function(err){
                    if(err) throw err;
                    else{ console.log("Save Successful");}
                })
                
                flash.push({type: 'success', message: info.message});
                return res.redirect('/#!/' + user._id);
            }
        })(req, res, next);
    });
    
    app.get('/api/user/:_id', function(req, res){
        User.findById(req.params._id, function(err, user){
            if(err){throw err;}
            else {
                res.send(user);
            }
        });
    });

    app.get('api/users', function(req, res){
        User.find({}, function(err, todos) {
            if(err) throw err;
            res.send(todos);
        });
    });

    var seedUsers = function(){
        var users = [
            {email: 'mdo3103@ymail.com', password: 'asdf', username: 'McDeezy', admin: false},
            {email: 'mdo3739@gmail.com', password: 'booyah', username: 'Big Mike', admin: true},
            {email: 'crazidoughboi@yahoo.com', password: 'boom', username: 'McDizzle', admin: false}
        ];

        for(var i = 0; i < users.length; i++){
            var newUser = new User(users[i]);
            newUser.save();
        }
    };
    console.log('userapi');
    //seedUsers();
};