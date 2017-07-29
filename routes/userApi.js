var User = require('../models/userModel');
var Todo = require('../models/todoModel');
var jsonParser = require('body-parser').json();
var ConfirmHash = require('../models/confirmModel');
var crypto = require('crypto');
var urlSafe = require('urlsafe-base64');
var transporter = require('../config/nodeMailer.js');
var confirmTemplate = require('../emailTemplates/confirm.js');

module.exports = function(app, passport){
    app.post('/api/user', jsonParser, function(req, res, next){
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
                    }
                    else{
                        req.logIn(user, function(err) {
                            if (err) { return next(err); }
                        });
                        res.send({type: 'success', message: info.message, userId: user._id});
                    }
                });

                crypto.randomBytes(32, function(err, buf) {
                    if (err) {
                        throw err;
                        return;
                    };

                    var string = urlSafe.encode(buf);

                    let confirm = new ConfirmHash({
                        userId: user._id,
                        token: string
                    });

                    confirm.save(function(err){
                        if(err) throw err;
                        else transporter.sendMail(confirmTemplate(confirm.token), function(err, info){
                            if(err) throw err;
                            else console.log('Message sent: ' + info.response);
                        });
                    });
                });

                
            }
        })(req, res, next);
    });
    
    app.get('/api/confirm/:token', function(req, res){
        ConfirmHash.findOne({token: req.params.token}, function(err, item){
            if(item){
                User.findById(item.userId, function(err, user){
                    user.role = 'member';
                    user.save(function(err){
                        if(err) throw err;
                        else {
                            ConfirmHash.findByIdAndRemove(item._id, function(err){
                                if(err) throw err;
                            });
                            res.send(user);
                        }
                    });
                });
            } else res.send({message: 'failure'});
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

    app.get('/api/isLoggedIn', function(req, res){
        if(req.userId){
            User.findById(req.userId, function(err, user){
                if(err) throw err;
                else res.send(user);
            });
        } else res.send();
    });

    app.delete('/api/user', function(req, res){
        let id = req.userId;
        User.findByIdAndRemove(id, function(err, user){
            if(err) res.send({type: 'danger', message: "Something went wrong. Please try again"});
            else{
                Todo.remove({userId: id}, function(err, numRemoved){
                    if(err) throw err;
                    else console.log(numRemoved +" items Deleted");
                });
                res.send({type: 'success', message: 'Account Deleted'});
            }
        });
    });
};