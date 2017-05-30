var variables = require('./envVariables.json');

module.exports = {
    getMongoConnection: function(){
        return `mongodb://${variables.mongoUserName}:${variables.mongoPwd}@ds155961.mlab.com:55961/angulartodo`
    }
}