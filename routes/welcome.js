var express = require('express');
var router = express.Router();
var path = require('path');

module.exports = function(app, passport){

    app.get('/', function(req, res){
        res.sendFile(path.join(__dirname, '../', 'client', 'views', 'layouts.html'));
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    }));
};