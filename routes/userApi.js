var User = require('../models/userModel');
var crypto = require('crypto');
var Todo = require('../models/todoModel');

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
        Todo.find({userId: req.params._id}, function(err, list){
            for(let c = 0; c < list.length; c++){
                console.log(list[c]._id);
            }
        });

    });

    app.post('/api/user/:_id', function(req, res){

        User.findByIdAndRemove(req.params._id, function(err, user){
            if(err) throw err;
            else{
                Todo.remove({userId: req.params._id}, function(err, numRemoved){
                    if(err) throw err;
                    else console.log(numRemoved +" items Deleted");
                });
                flash.push({type: 'success', message: 'Account Deleted'});
                res.redirect('/');
            }
        });
    });
};