module.exports = function(req, res, next){
	if(req.session.passport){
		req.userId = req.session.passport.user;
	}
	if(!req.userId){
		res.end();
	}else next();
}