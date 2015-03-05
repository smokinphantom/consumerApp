'use strict';

angular.module('consumerAppApp')
  .controller('SignupCtrl', function ($scope, $http, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;
      $scope.errors = {};

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
      }).then(function (response) {
        if(response.status==200&&response.data.status==400){
          if(response.data.msg.username) {
            $scope.errors.username = response.data.msg.username;
          }
            else {
              $scope.errors.email = response.data.msg.email;
            }
        }else{
          // Account created, redirect to home
          $location.path('/');
        }

        //TODO
        //insert a jquery plugin to display that user was able to signup successfully

    }).then( function() {
          //currently this isnt used
          // Account created, redirect to home
          //$location.path('/');
    
    }).catch( function(err) {
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

    /**
     * [hashed password gets generated]
     * @param  {[type]} - String password
     * @param  {[type]} - String random salt
     * @return {[type]} - hashed+salt password
     */
    function passwordHash(password, salt){
      var hashedPassword = CryptoJS.SHA256(salt+password).toString();
      return hashedPassword;
    }

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
