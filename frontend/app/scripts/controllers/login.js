'use strict';


angular.module('jwtNgNodeApp')
  .controller('LoginCtrl', function ($scope, $rootScope,  alert,$state, authToken, auth) {
    $scope.submit =function () {
      auth.login($scope.email, $scope.password)
      .then(
        function(res){
          alert('success', 'Account created ', 'Welcome, '+res.data.user.email+'!');
          authToken.setToken(res.data.token);
          setTimeout(function () {
            $state.go('main');
          },200);
        },
        function(error){
          alert('warning', 'Something Went Wrong :(', error.data.message);
        }
      );
    };
    $scope.google = function() {
      auth.googleAuth()
      .then(
        function (response) {
          console.log(response);
        },function (error) {
          console.log(error);
        }
      );
    };
});
