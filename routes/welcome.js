var express = require('express');
var router = express.Router();
var path = require('path');

module.exports = function(app, passport){
    var flash = app.locals.messages;

    app.get('/', function(req, res){
        res.sendFile(path.join(__dirname, '../', 'client', 'views', 'layouts.html'));
    });

    app.post('/login', function(req, res, next){
        passport.authenticate('local', function(err, user, info){
            if(err) throw err;
            if(!user){
                flash.push({type: 'danger', message: info.message});
                res.redirect('/');
            } else {
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    flash.push({type: 'success', message: info.message});
                    return res.redirect('/#!/' + req.user._id);
                }); 
            }
        })(req, res, next);
    });

    app.get('/logout', function(req, res){
        if(!req.user){
            flash.push({type: 'warning', message: 'Already Logged Out'})
        }else{
            req.logout();
            flash.push({type: 'success', message: 'Logged Out'});
        }
        res.redirect('/');
    });
};