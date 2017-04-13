'use strict';

angular.module('jwtNgNodeApp')
  .factory('authInterceptor', function (authToken) {
      return{
        request: function (config) {
          var token = authToken.getToken();
          if(token){
            config.headers = config.headers || {}
            config.headers.Authorization = 'Bearer '+token;
          }
          return config;
        }/*,
        response:function (response) {
          return response;
        }*/
      };
  });
angular.module('jwtNgNodeApp').config(['$httpProvider', function($httpProvider) {
    //$httpProvider.interceptors.push('APIInterceptor');
    $httpProvider.interceptors.push('authInterceptor');
}]);
