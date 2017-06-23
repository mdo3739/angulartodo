var todoApp = angular.module('todo-app', ['ngRoute']);

todoApp.config(function($routeProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'views/login.jade',
        controller: 'homeController'
    })
});

todoApp.controller('homeController', function(){

});