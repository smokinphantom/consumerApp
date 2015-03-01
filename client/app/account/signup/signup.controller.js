'use strict';

angular.module('consumerAppApp')
  .controller('SignupCtrl', function ($scope, $http, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;
      var salt = (Math.random() * 100000).toString();

      if(form.$valid) {

          var request = $http({
                method: 'POST',
                url: '/api/signup',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {
                        username: $scope.user.name,
                        password: passwordHash($scope.user.password, salt),
                        email: $scope.user.email,
                        phone: $scope.user.number,
                        salt: salt
                    }
      }).success(function () {


    })
    .then( function() {
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


    function passwordHash(password, salt){
      var hashedPassword = CryptoJS.SHA256(salt+password).toString();
      return hashedPassword;
    }

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
