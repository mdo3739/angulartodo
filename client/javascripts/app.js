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

todoApp.service('userService', function(){
    var observerCallbacks = [];

    this.registerObserverCallback = function(callback){
        observerCallbacks.push(callback);
    };

    this.notifyObservers = function(){
        angular.forEach(observerCallbacks, function(callback){
            callback();
        });
    };
});

todoApp.controller('layoutsController', ['Flash', 'userService', '$http', '$scope', '$timeout', 
                                    function(Flash, userService, $http, $scope, $timeout){

    // Getting Flash messages from backend                                                                 
    $http.get('/messages').then(function (data){
    
        var message = data.data[0];
        if(message){
            Flash.create(message.type, message.message, 5000);
            $http.delete('/messages');
        }
    }, function(data, status){
        console.log("Error: " + status);
        console.log(data);
    });

    
    var updateUser = function(){
        $scope.user = userService.user;
    };

    userService.registerObserverCallback(updateUser);
}]);

todoApp.controller('welcomeController', ['Flash', '$scope', '$http', function(Flash, $scope, $http){
    
}]);

todoApp.controller('profileController', ['Flash', 'userService', '$routeParams', '$scope', '$http', 
                                      function(Flash, userService, $routeParams, $scope, $http){
    // Loading User
    $http.get('/api/user/' + $routeParams._id ).then(function (data){
    
        $scope.user  = data.data;
        userService.user = data.data;
        userService.notifyObservers();
        
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

        }, function(data, status){
            console.log("Error: " + status);
            console.log(data);
        });
        ////////////////////////////////

    }, function(data, status){
        console.log("Error: " + status);
        console.log(data);
    });

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
        }
        , function(data, status){
            console.log("Error: " + status);
            console.log(data);
        })
    };
}]);