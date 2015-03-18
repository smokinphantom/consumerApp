'use strict';

angular.module('consumerAppApp')
.controller('LoginCtrl', function ($scope, Auth, $cookieStore, $http, $location, $window) {
  $scope.user = {};
  $scope.errors = {};

  $scope.login = function(form) {
    $scope.submitted = true;

    if(form.$valid) {

          var request = $http({
                method: 'POST',
                url: '/api/login',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {
                        username: $scope.user.name,
                        password: $scope.user.password
                    }
      }).success(function (response) {
        if(response.id){
          $cookieStore.put('token', response.id);
          Auth.setCurrentUser(response.user);
      }
        console.log(Auth.getCurrentUser);
        console.log(response.user);
        //TODO
        //insert a jquery plugin to display that user was able to signup successfully

    }).error(function(response){
      console.log(response);
      $scope.user.error = response;
      
    }).then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          /*angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });*/
        });
      }
};

$scope.loginOauth = function(provider) {
  $window.location.href = '/auth/' + provider;
};
});
