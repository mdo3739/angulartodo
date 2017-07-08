var express = require('express');
var User = require('../models/userModel');
var config = require('../config/configGetter');

module.exports = function(app, passport){
    app.post('/api/user', function(req, res){
        var newUser = User({
            email: req.body.email.toUpperCase(),
            username: req.body.username,
            memberSince: Date.now()
        });

        newUser.password = newUser.generateHash(req.body.password);

        newUser.save(function(err){
            if(err) {throw err;}
            else {res.send("Save Successful");}
        });
        
    });

    app.get('/api/user/:_id', function(req, res){
        User.findById(req.params._id, function(err, user){
            if(err){throw err;}
            else {
                res.send(user);
            }
        });
    });
};