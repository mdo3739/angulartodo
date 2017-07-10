var express = require('express');
var Todo = require('../models/todoModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app, passport){
    app.get('api/todos/:userId', function(req, res){
        console.log(req.params.userId);
        Todo.find({userId: req.params.userId}, function(err, todos) {
            res.send(todos.reduce(function(todoMap, item) {
                todoMap[item.id] = item;
                return todoMap;
            }, {}));
        });
    });

    app.post('/api/todo', jsonParser, function(req, res){
        var newTodo = Todo({
            userID: req.body.userID,
            todo: req.body.todo,
            dateCreated: Date.now(),
            completed: false
        });
        newTodo.save(function(err){
            if(err) {throw err;}
            else {res.send("Save Successful");}
        });
    });

    app.put('api/todo/:_id', jsonParser, function(req, res){
        var thisOne = req.params._id;

        Todo.findById(thisOne, function(err, user){
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

    app.delete('/api/todo/:_id', function(req, res){
        Todo.deleteOne({_id: req.params._id}, function(err, result){
            if (err){ throw err;}
            else {res.send('Delete Successful');}
        });
    });

    var seedTodos = function(){
        var items = [
            {userId: '5958472396bc514604b96ca2', todo: 'Wash car'},
            {userId: '5958472396bc514604b96ca2', todo: 'Finish project'},
            {userId: '5958472396bc514604b96ca2', todo: 'Get Rich'},
            {userId: '5961679bf751e920bc6ab5cb', todo: 'Fuck Hoes'},
            {userId: '5961679bf751e920bc6ab5cb', todo: 'Ball out'},
            {userId: '5961679bf751e920bc6ab5cb', todo: 'Sleep'},
            {userId: '5961679bf751e920bc6ab5cc', todo: 'Clean Room'},
            {userId: '5961679bf751e920bc6ab5cc', todo: 'Do Laundry'},
            {userId: '5961679bf751e920bc6ab5cc', todo: 'Relax'}
        ];

        for(var l = 0; l < items.length; l++){
            var newTodo = new Todo(items[l]);
            newTodo.save();
        }
    };

    //seedTodos();
};