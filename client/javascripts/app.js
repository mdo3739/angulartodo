var todoApp = angular.module('todo-app', ['ngRoute']);

todoApp.config(function($routeProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'views/login.html',
        controller: 'homeController'
    })
});

todoApp.controller('homeController', function(){

});