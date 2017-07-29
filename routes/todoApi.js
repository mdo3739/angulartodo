var express = require('express');
var Todo = require('../models/todoModel');
var jsonParser = require('body-parser').json();

module.exports = function(app, passport){
    app.get('/api/todos/:userId', function(req, res){
        Todo.find({userId: req.params.userId}, function(err, todos) {
            res.send(todos.reduce(function(todoMap, item) {
                todoMap[item.id] = item;
                return todoMap;
            }, {}));
        });
    });

    app.post('/api/todo', jsonParser, function(req, res){

        var newTodo = new Todo({
            userId: req.user._id,
            todo: req.body.todo,
            dateCreated: Date.now(),
            completed: false
        });
        newTodo.save(function(err){
            if(err) {
                res.send({type: 'danger', message: 'Something went wrong. Please try again'});
            }
            else {
                res.send({type: 'success', message: 'Item Saved', newTodo})
            }
        });

    });

    app.put('/api/todo/:_id', jsonParser, function(req, res){
        var thisOne = req.params._id;  

        Todo.findById(thisOne, function(err, item){
            if (err) throw err;
            else {
                item.todo = req.body.todo || item.todo;
                switch(req.body.completed){
                    case true:
                        item.completed = true;
                        break;
                    case false:
                        item.completed = false;
                        break;
                }
                item.save(function(err, result){
                    if(err) throw err;
                    else {res.send('Update Successful');}
                });
            }
        });
    });

    app.delete('/api/todo/:_id', function(req, res){
        Todo.deleteOne({_id: req.params._id}, function(err, result){
            if (err){ throw err;}
            else {res.send('Delete Successful');}
        });
    });
};