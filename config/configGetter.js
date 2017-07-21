module.exports = {
    getMongoConnection: function(){
        return process.env.PROD_MONGODB || "mongodb://localhost/angularTodo";
    },
    getSecret: function(){ 
        return process.env.SECRET || "FZvCUMrLIwA6EnLYc1F2glhZTAc3Sifpl73buBJ6kH1s9zuYQSSMvDA1fJqIT4U";
    }
};