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

todoApp.controller('welcomeController', ['Flash', '$scope', '$http', function(Flash, $scope, $http){
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
}]);

todoApp.controller('profileController', ['Flash', '$routeParams', '$scope', '$http', function(Flash, $routeParams, $scope, $http){

    $http.get('/messages').then(function (data){
    
        var message = data.data[0];
        if(message){
            Flash.create(message.type, message.message, 5000);
            $http.delete('/messages').then(function(asdf){
                console.log('Flash Message Deleted');
                $http.get('/messages').then(function(res){
                    console.log(res.data);
                });
            });
        }
    }, function(data, status){
        console.log("Error: " + status);
        console.log(data);
    });
}]);