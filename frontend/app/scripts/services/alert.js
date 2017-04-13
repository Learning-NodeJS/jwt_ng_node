'use strict';

angular.module('jwtNgNodeApp')
  .service('alert', function ($rootScope, $timeout) {
    var alertTimeout;
    return function(type,title, message, timeout){
      $rootScope.alert = {
        hasBeenShown: true,
        type: type,
        show: true,
        message: message,
        titile: title
      };
      $timeout.cancel(alertTimeout);
      alertTimeout = $timeout(function(){
          $rootScope.alert.show = false;
      }, timeout || 2000);
    };

  });
