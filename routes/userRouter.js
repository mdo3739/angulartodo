var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/userModel');
var bodyParser = require('body-parser');

router.get('/:id', function(req, res){
    User.findById(id, function(err, user){
        if(err){throw err;}
        else {res.send(user);}
    });
});

router.post('/', bodyParser, function(req, res){
    var newUser = User({
        email: req.body.email,
        password: req.body.password,
        username: '',
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

module.exports = router;