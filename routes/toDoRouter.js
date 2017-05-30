var express = require('express');
var router = express.Router();
var ToDo = require('../models/toDoModel');

router.get('/', function(req, res){
    res.render('home');
});

router.post('/', function(req, res){
    
});

module.exports = router;