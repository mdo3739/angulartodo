var express = require('express');
var router = express.Router();
var ToDo = require('../models/toDoModel');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
var jsonParser = bodyParser.json();

router.post('/', jsonParser, function(req, res){
    var newToDo = ToDo({
        user: req.body.user,
        todo: req.body.todo,
        dateCreated: Date.now(),
        completed: false
    });
    newToDo.save(function(err){
        if(err) {throw err;}
        else {res.send("Save Successful");}
    });
});

router.put('/', jsonParser, function(req, res){

    ToDo.findByIdAndUpdate(
        
        req.body._id, 
        { 
            todo: req.body.todo,
            completed: req.body.completed,
        }, 
        function(err, todo) {
            if (err) throw err;
            else {res.send('Update Successful');}
        }
    );
});

router.delete('/:_id', function(req, res){
    ToDo.deleteOne({_id: req.params._id}, function(err, result){
        if (err){ throw err;}
        else {res.send('Delete Successful');}
    });
});

module.exports = router;