// Setting variables
var express = require('express');
var app = express();
var config = require('./config/configGetter.js');
var mongoose = require('mongoose');
var toDoroutes = require('./routes/toDoRouter.js');
var userRoutes = require('./routes/userRouter.js');
var loginRoutes = require('./routes/login');
var jwt    = require('jsonwebtoken');
var morgan = require('morgan');
var repl = require('repl');

var port = process.env.PORT || 8000;

// Middlewares
app.set('view engine', 'jade');
app.use('/api/todo', toDoroutes);
app.use('/api/user', userRoutes);
app.use('/login', loginRoutes);
app.use(morgan('dev'));

// Connecting to database
mongoose.connect(config.getMongoConnection());
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'Could not connect to database'));
connection.once('open', function(){
    console.log('Connection successful!');
});

app.listen(port);