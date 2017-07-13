'use strict'

var todoApp = angular.module('todoApp', ['ngRoute','ngFlash']);

todoApp.config(function($routeProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'client/views/login.html',
        controller:  'welcomeController'
    })
    .when('/:_id', {
        templateUrl: 'client/views/profile.html',
        controller: 'profileController'
    })
});

todoApp.service('sharingService', function(){
    
    // Loads user after logging in to update Navbar
    var observerCallbacks = [];
    this.registerObserverCallback = function(callback){
        observerCallbacks.push(callback);
    };
    this.notifyObservers = function(){
        angular.forEach(observerCallbacks, function(callback){
            callback();
        });
    };
    
    // Error Handler
    this.errorHandler = function(data, status){
        console.log("Error: " + status);
        console.log(data);
    }

});

todoApp.controller('layoutsController', ['Flash', 'sharingService', '$http', '$scope', '$timeout', 
                                    function(Flash, sharingService, $http, $scope, $timeout){

    // Getting Flash messages from backend                                                                 
    $http.get('/messages').then(function (data){
    
        var message = data.data[0];
        if(message){
            Flash.create(message.type, message.message, 5000);
            $http.delete('/messages');
        }
    }, sharingService.errorHandler);

    console.log()
    var updateUser = function(){
        $scope.user = sharingService.user;
    };

    sharingService.registerObserverCallback(updateUser);
}]);

todoApp.controller('welcomeController', ['Flash', '$scope', '$http', function(Flash, $scope, $http){
    
}]);

todoApp.controller('profileController', ['Flash', 'sharingService', '$routeParams', '$scope', '$http', 
                                      function(Flash, sharingService, $routeParams, $scope, $http){
    // Loading User
    $http.get('/api/user/' + $routeParams._id ).then(function (data){
    
        $scope.user  = data.data;
        sharingService.user = data.data;
        sharingService.notifyObservers();
        
        // Loading User's To-do Items////
        $http.get('/api/todos/' + $scope.user._id).then(function(items){
            $scope.todos = [];

            // Loading All To-dos
            for(var item in items.data){
                $scope.todos.push(items.data[item]);
            }

            // Loading Open To-dos
            $scope.open = $scope.todos.filter(function(todo){
                return todo.completed === false;
            });

            // Loading Finished To-dos
            $scope.done = $scope.todos.filter(function(todo){
                return todo.completed === true;
            });

        }, sharingService.errorHandler);
        ////////////////////////////////

    }, sharingService.errorHandler);

    // If item is checked off, moves item to $scope.done and vice-versa
    $scope.checked = function(item) {
        $http.put(`/api/todo/${item._id}`, {completed: (!item.completed)}).then(function(success){
            item.completed = !item.completed;
            if(item.completed === true){
                var index = $scope.open.indexOf(item);
                $scope.done.push($scope.open.splice(index, 1)[0]);
            } else if(item.completed === false){
                var index = $scope.done.indexOf(item);
                $scope.open.push($scope.done.splice(index, 1)[0]);
            }
        }, sharingService.errorHandler);
    };

    // Adds New Items
    $scope.addTodo = function(form){
        $http.post('api/todo', {todo: $scope.addTodoText}).then(function(item){
            $scope.open.push(item.data);
            $scope.addTodoText = '';
        }, sharingService.errorHandler);
    }

    // Deletes items
    $scope.deleteTodo = function(item){
        var index = $scope.done.indexOf(item);
        $http.delete(`/api/todo/${item._id}`).then(function(data){
            $scope.done.splice(index, 1);
        }, sharingService.errorHandler);
    };

    // Edit Items
    $scope.editTodo = function(item){
        if($scope.editTodo.text){
            $scope.saveTodo($scope.open.find(function(element){
                return element.todo === $scope.editTodo.text;
            }));
        }
        $scope.editTodo = {text: item.todo};
        var original = angular.element( document.querySelector( '#s'+item._id ) );
        original.addClass('hidden');

        var editBox = angular.element(document.querySelector('#e'+item._id));
        editBox.removeClass('hidden');
    };

    $scope.saveTodo = function(item){
        $http.put('/api/todo/'+item._id, {todo: $scope.editTodo.text}).then(function(data){
            var index = $scope.open.indexOf(item);
            console.log($scope.open[index]);
            $scope.open[index].todo = $scope.editTodo.text;
            console.log($scope.open[index]);
            var original = angular.element( document.querySelector( '#s'+item._id ) );
            original.removeClass('hidden');

            var editBox = angular.element(document.querySelector('#e'+item._id));
            editBox.addClass('hidden');
        }, sharingService.errorHandler );
    };
}]);