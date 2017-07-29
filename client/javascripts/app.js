'use strict'

var todoApp = angular.module('todoApp', ['ngRoute','ngFlash', 'ngSanitize']);

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
    .when('/account/:_id', {
        templateUrl: 'client/views/account.html',
        controller: 'accountController'
    })
});

todoApp.service('sharingService', ['$location', function($location){



}]);

todoApp.controller('layoutsController', ['Flash', 'sharingService', '$scope','$location', '$http',
                                    function(Flash, sharingService, $scope, $location, $http){

    $scope.$on('logged in', function(){
        $scope.user = sharingService.user;
    });

    $scope.$on('profileController created', function(){
        $scope.$broadcast('load todos');
    });

    // Check to see if Logged in upon refresh
    if(!sharingService.user){
        $http.get('/api/isLoggedIn').then(function(reaction){

            if(reaction.data){
                sharingService.user = reaction.data;
                $scope.user = reaction.data;
                $scope.$broadcast('load todos');
            } else {

                // If not logged in redirect to home page
                if($location.path() !== '/'){
                    $location.path('/');
                    Flash.create('danger', 'Please Sign In');
                }

                // Redirect to home page if URL is changed while not logged in
                $scope.$on('$locationChangeSuccess', function(event){
                    if(!$scope.user && $location.path() !== '/'){
                        $location.path('/');
                        Flash.create('danger', 'Please Sign In');
                        
                    }
                });
            }
        }, sharingService.errorHandler);
    } 

    $scope.logout = function(){
        $http.get('/logout').then(function(reaction){
            $location.path('/');
            $scope.user = null;
            sharingService.user = null;
            Flash.create(reaction.data.type, reaction.data.message);
        }, sharingService.errorHandler);
    }

}]);

todoApp.controller('welcomeController', ['sharingService','Flash', '$scope', '$http', '$location', function(sharingService, Flash, $scope, $http, $location){
    $scope.loginForm = {
        email: '',
        password: ''
    }

    $scope.login = function(){
        $http.post('/login', $scope.loginForm).then(function(reaction){

            // reaction.data.userId will only be present if login was successful
            let id = reaction.data.userId;
            if(id){
                $http.get('/api/user/' + id ).then(function (data){
                    sharingService.user  = data.data;
                    $scope.$emit('logged in');

                    $location.path('/' + sharingService.user.username);
                }, sharingService.errorHandler);
            }
            Flash.create(reaction.data.type, reaction.data.message);
        }, sharingService.errorHandler);
    };

    $scope.signupForm = {
        email: '',
        password: '',
        username: ''
    }
    $scope.signup = function(){
        $http.post('/api/user', $scope.signupForm).then(function(reaction){
            let id = reaction.data.userId;
            if(id){
                $http.get('/api/user/' + id ).then(function (data){
                    sharingService.user  = data.data;
                    $scope.$emit('logged in');

                    $location.path('/' + sharingService.user.username);
                }, sharingService.errorHandler);
            }
            Flash.create(reaction.data.type, reaction.data.message);
        });
    };
}]);

todoApp.controller('profileController', ['Flash', 'sharingService', '$routeParams', '$scope', '$http', '$location', 
                                    function(Flash, sharingService, $routeParams, $scope, $http, $location){

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

    $scope.user = sharingService.user;

    // Loading User's To-do Items
    $scope.$on("load todos", function(){
        
        $http.get('/api/todos/' + sharingService.user._id).then(function(items){
                $scope.todos = items.data;
                
                // Loading Open To-dos
                $scope.open = filter($scope.todos, {completed: false});

                // Loading Finished To-dos
                $scope.done = filter($scope.todos, {completed: true});

        }, sharingService.errorHandler);
    });

    $scope.$emit('profileController created');

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

        $http.post('api/todo', {todo: $scope.addTodoText}).then(function(reaction){
            var newTodo = reaction.data.newTodo;
            $scope.open[newTodo._id] = newTodo;
            $scope.addTodoText = '';
            console.log(reaction.data.type);
            Flash.create(reaction.data.type, reaction.data.message);
        }, sharingService.errorHandler);
    }

    // Deletes items
    $scope.areYouSure = function(item) {
        alert = $mdDialog.alert({
            title: 'Attention',
            textContent: 'This is an example of how easy dialogs can be!',
            ok: 'Close'
        });
    };

    $scope.deleteTodo = function(item){
        if(!confirm("Are you sure you want to delete?")){
            return;    
        }
        $http.delete(`/api/todo/${item._id}`).then(function(data){
            var list = whichList(item.completed);
            delete $scope[list[1]][item._id];
        }, sharingService.errorHandler);
    };

    // Edit Items
    $scope.editObject = {
        text: '',
        _id: ''
    };

    function toggleShow(doWhat, id){
        switch(doWhat){
            case "editShow":
                var original = angular.element( document.querySelector( '#show'+id ) );
                original.addClass('hidden');
        
                var editBox = angular.element(document.querySelector('#edit'+id));
                editBox.removeClass('hidden');
                break;
            case "editHide":
                var original = angular.element( document.querySelector( '#show'+id ) );
                original.removeClass('hidden');

                var editBox = angular.element(document.querySelector('#edit'+id));
                editBox.addClass('hidden');
                break;
        }
    }

    $scope.editTodo = function(item){
        var oldOne = $scope.editObject._id;
        if(oldOne){
            toggleShow("editHide", oldOne);
        }
        
        $scope.editObject.text = item.todo;
        $scope.editObject._id = item._id;
        toggleShow("editShow", item._id);
    };

    $scope.saveTodo = function(item){
        var newText = $scope.editObject.text;
        
        $http.put('/api/todo/'+item._id, {todo: newText}).then(function(data){
            
            $scope.open[item._id].todo = newText;
 
            toggleShow("editHide", item._id);
        }, sharingService.errorHandler);
    };
}]);

todoApp.controller('accountController', ['Flash', 'sharingService', '$scope', '$location', '$http', 
                                    function(Flash, sharingService, $scope, $location, $http){

    $scope.deleteAccount = function(){
        $http.delete('/api/user').then(function(reaction){
            $scope.user = null;
            sharingService.user = null;
            $location.path('/');
            Flash.create(reaction.data.type, reaction.data.message);
        }, sharingService.errorHandler);
    };

}]);

todoApp.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        };
});