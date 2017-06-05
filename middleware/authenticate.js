var config = require('../config/configGetter');
var urlEncodedParser = require('body-parser').urlencoded();

module.exports = function() {
  return function(req, res, next) {
    if(!req.decoded){
      return res.end("Not Logged In");
    }
    else{
      var token = req.cookies.auth;

      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.getSecret(), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });

      }
    }
  };
};
