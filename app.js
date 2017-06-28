// Setting variables
var express = require('express');
var app = express();
var config = require('./config/configGetter.js');
var mongoose = require('mongoose');
var toDoApi = require('./routes/toDoApi.js');
var userApi = require('./routes/userApi.js');
var sessionRoutes = require('./routes/session');
var jwt    = require('jsonwebtoken');
var logger = require('morgan');
var repl = require('repl');
var welcomePage = require('./routes/welcome.js');

var port = process.env.PORT || 8000;


// Middlewares
app.set('view engine', 'jade');
app.use('/api/todo', toDoApi);
app.use('/api/user', userApi);
app.use('/session', sessionRoutes);
app.use('/', welcomePage);
app.use(logger('dev'));
app.use("/javascripts", express.static(__dirname + '/client/javascripts'));
app.use('/views', express.static(__dirname + '/client/views'));

// Connecting to database
mongoose.connect(config.getMongoConnection());
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'Could not connect to database'));
connection.once('open', function(){
    console.log('Connection successful!');
});

app.listen(port);