var todoApp = angular.module('todoApp', ['ngRoute','ngFlash']);

todoApp.config(function($routeProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'views/login.html',
        controller:  'welcomeController'
    })
    .when('/:_id', {
        templateUrl: 'views/profile.html',
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

    $http.get('/api/user/' + $routeParams._id ).then(function (data){
    
        $scope.user  = data.data;
        userService.user = data.data;
        userService.notifyObservers();

    }, function(data, status){
        console.log("Error: " + status);
        console.log(data);
    });
}]);