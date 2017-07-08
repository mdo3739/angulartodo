// API for flash messages
module.exports = function(app){
    var flash = app.locals.messages;
    
    app.get('/messages', function(req, res){
        res.send(app.locals.messages);
    });

    app.delete('/messages', function(req, res){
        flash.splice(0, 1);
        console.log('Flash Deleted');
    });
};