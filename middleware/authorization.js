module.exports = {
    isLoggedIn: function(){
        return function(req, res, next){
            if(!req.session.user){
                res.end("Please Sign In");
            } else {
                next();
            }
    }
    loggedInAndOwn: function(){
        if(!req.session.user){
            res.end("Please Sign In");
        } else if({
            next();
        }
    }
}