var User = require('../models/userModel');
var crypto = require('crypto');

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
                    if(err){
                        flash.push({type: 'danger', message: "Something went wrong! Please try again"});
                        res.redirect('/');
                    }
                    else{
                        console.log("Save Successful");
                        flash.push({type: 'success', message: info.message});
                    }
                })
                
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

    app.delete('api/user/:_id', function(req, res){
        User.findByIdAndRemove(req.params._id, function(err, user){
            if(err) throw err;
            else{
                flash.push({type: 'success', message: 'Account Deleted'});
                res.redirect('/');
            }
        });
    });
};