module.exports = {
    isLoggedIn: function(){
        return function(req, res, next){
            if(!req.session){
                res.end("Please Sign In");
            } else {
                next();
            }
    }
    loggedInAndOwn: function(){
        return function(req, res, next){
            if(!req.session){
                res.end("Please Sign In");
            } else if({
                next();
            }
        }
    }
}