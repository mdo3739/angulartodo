var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/userModel');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded();
var jwt = require('jsonwebtoken');
var config = require('../config/configGetter');
var cookie = require('cookie-parser');
var authenticate = require('../middleware/authenticate');

router.post('/', urlEncodedParser, function(req, res){
    var newUser = User({
        email: req.body.email.toUpperCase(),
        password: req.body.password,
        username: req.body.username,
        memberSince: Date.now()
    });

    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if(err) throw err;
        else{
            newUser.password = hash;
            newUser.save(function(err){
                if(err) {throw err;}
                else {res.send("Save Successful");}
            });
        }
    });
    
});

router.get('/:_id', authenticate(), function(req, res){
    User.findById(req.params._id, function(err, user){
        if(err){throw err;}
        else if(user.id === req.decoded._doc._id){res.send(user);}
        else {
            res.send("This is not your profile!");
        }
    });
});

module.exports = router;