'use strict'

// Setting variables
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var cookieSession = require('cookie-session');
var authorization = require('./middleware/authorization.js');

// Config settings depending on environment
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
	require('./config/devConfig.js')(app);
} else if(env === 'production'){
	app.use(cookieSession({
	  name: 'cookieSession',
	  secret: process.env.SECRET,
	 
	  // Cookie Options
	  maxAge: 24 * 60 * 60 * 1000, // 24 hours 
	  secure: true
	}));
}

//require('./routes/nodemailerApi.js')();
// Middlewares
app.use("/client", express.static(__dirname + '/client'));
app.use('/dist', express.static(__dirname + '/node_modules/angular-flash-alert/dist/'));
app.use('/api', authorization);

require('./config/passport.js')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Load routes and pass in app and fully configured passport
require('./routes/todoApi.js')(app, passport);
require('./routes/userApi.js')(app, passport);
require('./routes/welcome.js')(app, passport);

// Error Handler
app.use(function errorHandler (err, req, res, next) {
  res.status(500);
  res.json({ error: err });
});

// Connecting to database
mongoose.connect(process.env.MONGODB, {useMongoClient: true});
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'Could not connect to database'));
connection.once('open', function(){
    console.log('Connection successful!');
});

app.listen(process.env.PORT);