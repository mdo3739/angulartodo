var express = require('express');
var ToDo = require('../models/toDoModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app, passport){
    app.get('/:userid', function(req, res){
        
        ToDo.find({}, function(err, todos) {
            res.send(todos.reduce(function(todoMap, item) {
                todoMap[item.id] = item;
                return todoMap;
            }, {}));
        });
    });

    app.post('/', jsonParser, function(req, res){
        var newToDo = ToDo({
            userID: req.body.userID,
            todo: req.body.todo,
            dateCreated: Date.now(),
            completed: false
        });
        newToDo.save(function(err){
            if(err) {throw err;}
            else {res.send("Save Successful");}
        });
    });

    app.put('/:_id', jsonParser, function(req, res){
        var thisOne = req.params._id;

        ToDo.findById(thisOne, function(err, user){
            if (err) throw err;
            else {
                user.todo = req.body.todo || user.todo;
                user.completed = req.body.completed || user.completed;
                user.save(function(err, result){
                    if(err) throw err;
                    else {res.send('Update Successful');}
                });
            }
        });
    });

    app.delete('/:_id', function(req, res){
        ToDo.deleteOne({_id: req.params._id}, function(err, result){
            if (err){ throw err;}
            else {res.send('Delete Successful');}
        });
    });
};