'use strict';
angular.module('jwtNgNodeApp')
  .controller('LogoutCtrl', function (authToken,$state) {
    authToken.removeToken();
    $state.go('main');
  });
