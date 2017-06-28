var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded();
var config = require('../config/configGetter');
var jwt = require('jsonwebtoken');
var User = require('../models/userModel');
var bcrypt = require('bcrypt');
var cookie = require('cookie-parser');

router.post('/login', urlEncodedParser, cookie(config.getCookieSecret()), function(req, res){
    User.findOne({email: req.body.email.toUpperCase()}, function(err, user){
        if(err) throw err;
        if(!user){
            res.json({success: false, message: "User not found"});
        } else if (user){
            bcrypt.compare(req.body.password, user.password, function(err, isPasswordRight) {
                if(isPasswordRight){
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, config.getSecret(), {expiresIn: '4h'});
                    console.log(user);
                    res.cookie('user', user);
                    res.cookie('auth', token);
                    res.redirect('/api/user/'+ user._id);
                }else{
                    res.json({success: false, message: "Wrong Password"});
                }
            });
        }

    });
});

module.exports = router;