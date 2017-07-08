// Setting variables
var express = require('express');
var app = express();
var config = require('./config/configGetter.js');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require( 'body-parser' );

var port = process.env.PORT || 8000;

// Middlewares
app.use("/javascripts", express.static(__dirname + '/client/javascripts'));
app.use('/views', express.static(__dirname + '/client/views'));
app.use('/dist', express.static(__dirname + '/node_modules/angular-flash-alert/dist/'));
app.use(logger('dev'));
app.use(cookieParser());
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(session({ secret: config.getSecret() })); // session secret
app.locals.messages = [];

require('./config/passport.js')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Load routes and pass in app and fully configured passport
require('./routes/toDoApi.js')(app, passport);
require('./routes/userApi.js')(app, passport);
require('./routes/welcome.js')(app, passport);

// Connecting to database
mongoose.connect(config.getMongoConnection());
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'Could not connect to database'));
connection.once('open', function(){
    console.log('Connection successful!');
});

app.listen(port);