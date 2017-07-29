var User = require('../models/userModel');
var Todo = require('../models/todoModel');

module.exports = function(app, passport){
    app.post('/api/user', function(req, res, next){
        passport.authenticate('local-signup', function(err, user, info){
            if(err) throw err;
            if(!user){
                res.send({type: 'warning', message: info.message});
            } else {
                user.username = req.body.username;
                user.memberSince = Date.now();
                user.save(function(err){
                    if(err){
                        res.send({type: 'danger', message: "Something went wrong! Please try again"});
                        res.redirect('/');
                    }
                    else{
                        res.send({type: 'success', message: info.message, userId: user._id});
                    }
                })
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

    app.get('/api/isLoggedIn', function(req, res){
        if(req.userId){
            User.findById(req.userId, function(err, user){
                if(err) throw err;
                else res.send(user);
            });
        } else res.send();
    });

    app.post('/api/user/:_id', function(req, res){

        User.findByIdAndRemove(req.params._id, function(err, user){
            if(err) throw err;
            else{
                Todo.remove({userId: req.params._id}, function(err, numRemoved){
                    if(err) throw err;
                    else console.log(numRemoved +" items Deleted");
                });
                res.send({type: 'success', message: 'Account Deleted'});
            }
        });
    });
};