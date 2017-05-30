var express = require('express');
var app = express();

var port = process.env.PORT || 8000;
app.set('view engine', 'jade');

app.get('/', function(req, res){
    res.render('home');
});

app.listen(port);