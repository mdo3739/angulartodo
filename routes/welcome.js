var path = require('path');
var jsonParser = require('body-parser').json();

module.exports = function(app, passport){
    app.get('/', function(req, res){
        res.sendFile(path.join(__dirname, '../', 'client', 'views', 'layouts.html'));
    });

    app.post('/login', jsonParser, function(req, res, next){
        passport.authenticate('local-login', function(err, user, info){
            if(err) throw err;
            if(!user){
                res.send({type: 'danger', message: info.message});
            } else {
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    res.send({type: 'success', message: info.message, userId: user._id});
                }); 
            }
        })(req, res, next);
    });

    app.get('/logout', function(req, res){
        if(!req.user){
            res.send({type: 'warning', message: 'Already Logged Out'})
        }else{
            req.logout();
            res.send({type: 'success', message: 'Logged Out'});
        }
    });
};