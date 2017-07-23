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

todoApp.service('sharingService', [ '$routeParams','$location', function($routeParams,$location){
    
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
    };



}]);

todoApp.controller('layoutsController', ['Flash', 'sharingService', '$http', '$scope', '$timeout', '$routeParams', '$location', 
                                    function(Flash, sharingService, $http, $scope, $timeout,$routeParams,$location){

    // Getting Flash messages from backend                                                                 
    $http.get('/messages').then(function (data){
    
        var message = data.data[0];
        if(message){
            Flash.create(message.type, message.message, 5000);
            $http.delete('/messages');
        }
    }, sharingService.errorHandler);

    $http.get('/api/user/' + $routeParams._id ).then(function (data){
    
        $scope.user  = data.data;
        if(!$scope.user && $location.path() !== '/'){
            $location.path('/');
            Flash.create('danger', 'Please Sign In');
            
        }
        $scope.$on('$locationChangeSuccess', function(event){
            if($location.path() === '/')Flash.create('danger', 'Please Sign In');
            $location.path('/');
        });
    }, sharingService.errorHandler);

    var updateUser = function(){
        $scope.user = sharingService.user;
    };

    sharingService.registerObserverCallback(updateUser);
}]);

todoApp.controller('welcomeController', ['sharingService','Flash', '$scope', '$http', function(sharingService, Flash, $scope, $http){
    $scope.form = {
        email: '',
        password: ''
    }

    $scope.login = function(){
        $http.post('/login', {email: $scope.form.email, password: $scope.form.password}).then(function(data){
            console.log(data);
        }, sharingService.errorHandler);
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

    // Loading User
    /*$http.get('/api/user/' + $routeParams._id ).then(function (data){
    
        $scope.user  = data.data;
        sharingService.user = data.data;
        sharingService.notifyObservers();
        if(!$scope.user){
            $location.path('/');
            Flash.create('danger', 'Please Sign In');
        }

        // Loading User's To-do Items
        $http.get('/api/todos/' + $scope.user._id).then(function(items){
            $scope.todos = items.data;
  
            // Loading Open To-dos
            $scope.open = filter($scope.todos, {completed: false});
            
            // Loading Finished To-dos
            $scope.done = filter($scope.todos, {completed: true});

        }, sharingService.errorHandler);
        

    }, sharingService.errorHandler);*/
    //$scope.user = sharingService.user;
    //console.log(sharingService.user);
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

todoApp.controller('accountController', ['sharingService', '$scope', '$routeParams', '$http', 
                                    function(sharingService, $scope, $routeParams, $http){

    $scope.id = $routeParams._id;

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