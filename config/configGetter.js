var variables = require('./devVariables.json');

module.exports = {
    getMongoConnection: function(){
        return process.env.PROD_MONGODB || variables.db
    },
    getSecret: function(){ 
        return process.env.SECRET || variables.secret ;
    },
    getCookieSecret: function(){return variables.cookieSecret;}
};