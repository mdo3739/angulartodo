'use strict'

var todoApp = angular.module('todoApp', ['ngRoute','ngFlash', 'ui.bootstrap', 'ngSanitize']);

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

    var updateUser = function(){
        $scope.user = sharingService.user;
    };

    sharingService.registerObserverCallback(updateUser);
}]);

todoApp.controller('welcomeController', ['Flash', '$scope', '$http', function(Flash, $scope, $http){
    
}]);

todoApp.controller('profileController', ['Flash', 'sharingService', '$routeParams', '$scope', '$http',
                                      function(Flash, sharingService, $routeParams, $scope, $http){

    function filter(obj, condition) {
        var result = {};
        var key = Object.keys(condition)[0]
        for(var item in obj){
            if(condition[key] === obj[item][key]){
                result[item] = obj[item];
            }
        }
        return result;
    };

    function whichList(boolean){
        if(boolean) return ['open', 'done'];
        else return ['done', 'open'];
    }

    // Loading User
    $http.get('/api/user/' + $routeParams._id ).then(function (data){
    
        $scope.user  = data.data;
        sharingService.user = data.data;
        sharingService.notifyObservers();
        
        // Loading User's To-do Items////
        $http.get('/api/todos/' + $scope.user._id).then(function(items){
            $scope.todos = items.data;
  
            // Loading Open To-dos
            $scope.open = filter($scope.todos, {completed: false});
            
            // Loading Finished To-dos
            $scope.done = filter($scope.todos, {completed: true});

        }, sharingService.errorHandler);
        ////////////////////////////////

    }, sharingService.errorHandler);

    // If item is checked off, moves item to $scope.done and vice-versa
    $scope.checked = function(item) {
        $http.put(`/api/todo/${item._id}`, {completed: (!item.completed)}).then(function(success){

            // If item.completed === false, I would need to delete item from $scope.open and add it to $scope.done
            // whichList allows me to do this, plus vice versa
            var list = whichList(item.completed);
            $scope[list[0]][item._id] = $scope[list[1]][item._id];
            delete $scope[list[1]][item._id];
        $scope[list[0]][item._id].completed = !item.completed;
        }, sharingService.errorHandler);
    };

    // Adds New Items
    $scope.addTodo = function(){
        $http.post('api/todo', {todo: $scope.addTodoText}).then(function(item){
            $scope.open[item.data._id] = item.data;
            $scope.addTodoText = '';
        }, sharingService.errorHandler);
    }

    // Deletes items
    $scope.deleteTodo = function(item){
        $http.delete(`/api/todo/${item._id}`).then(function(data){
            var list = whichList(item.completed);
            delete $scope[list[1]][item._id];
        }, sharingService.errorHandler);
    };

    // Edit Items
    $scope.editPopover = {
        templateUrl: 'client/views/editPopoverTemplate.html',
        content: 'Edit',
        isOpen: false
    };

    $scope.editTodo = function(item){
        $scope.editPopover.content = item.todo;
        $scope.editPopover.isOpen = true;
        console.log('Hello');
    };

    $scope.saveTodo = function(item){
        $http.put('api/todo/' + item._id, {todo: $scope.editPopover.content}).then(function(data){
            $scope.open[item._id].todo = $scope.editPopover.content;
            
            $scope.editPopover.isOpen = false;
            console.log($scope.editPopover.isOpen);
        }, sharingService.errorHandler);
    };
}]);