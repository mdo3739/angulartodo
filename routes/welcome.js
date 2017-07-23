var path = require('path');

module.exports = function(app, passport){
    app.get('/', function(req, res){
        res.sendFile(path.join(__dirname, '../', 'client', 'views', 'layouts.html'));
    });

    app.post('/login', function(req, res, next){
        passport.authenticate('local-login', function(err, user, info){
            if(err) throw err;
            if(!user){
                res.send({type: 'danger', message: info.message});
            } else {
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    flash.push({type: 'success', message: info.message});
                    res.send(user._id);
                }); 
            }
        })(req, res, next);
    });

    app.get('/logout', function(req, res){
        if(!req.user){
            res.send({type: 'warning', message: 'Already Logged Out'})
        }else{
            req.logout();
            flash.push({type: 'success', message: 'Logged Out'});
        }
        res.redirect('/');
    });
};