var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/userModel');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded();
var jwt = require('jsonwebtoken');
var config = require('../config/configGetter');
var cookie = require('cookie-parser');

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

// route middleware to verify a token
router.use(urlEncodedParser, cookie(config.getCookieSecret()), function(req, res, next) {

  var token = req.cookies.auth;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.getSecret(), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

router.get('/:_id', function(req, res){
    User.findById(_id, function(err, user){
        if(err){throw err;}
        else {res.send(user);}
    });
});

module.exports = router;