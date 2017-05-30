var express = require('express');
var app = express();
var config = require('./config/configGetter.js');
var mongoose = require('mongoose');

var port = process.env.PORT || 8000;
app.set('view engine', 'jade');
mongoose.connect(config.getMongoConnection());

app.get('/', function(req, res){
    res.render('home');
});

app.listen(port);