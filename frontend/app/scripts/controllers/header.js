'use strict';

/**
 * @ngdoc function
 * @name jwtNgNodeApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the jwtNgNodeApp
 */
angular.module('jwtNgNodeApp')
  .controller('HeaderCtrl', function ($scope, authToken) {
    $scope.isAuthenticated = authToken;
  });
