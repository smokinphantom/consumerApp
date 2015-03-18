

  angular.module('consumerAppApp')
    .factory('User', ['$http', function($http) {

    var urlBase = '/api';
    var dataFactory = {};

    dataFactory.getUser = function () {
        return $http.get(urlBase+'/'+'login');
    };

    dataFactory.logout = function () {
        return $http.get(urlBase+'/'+'logout');
    };

    return dataFactory;
}]);
