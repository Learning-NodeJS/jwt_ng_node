'use strict';

/**
 * @ngdoc function
 * @name jwtNgNodeApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jwtNgNodeApp
 */
angular.module('jwtNgNodeApp')
  .controller('JobsCtrl', function ($scope, $http, API_URL, alert, authToken) {
    var token = authToken.getToken();


    $http({
      method: 'GET',
      url: API_URL+'jobs',
      
    })
    //$http.get(API_URL+'jobs', {headers: {'Authorization': 'Bearer '+token}})
    .then(function (result) {
      $scope.jobs = result.data?result.data:{};
      console.log(result);
    },function (error) {
      console.log(error);
      alert('warning', 'unable to get jobs', error.data.message);
    });
    $scope.jobs = [

    ];
  });
