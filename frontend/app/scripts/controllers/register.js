'use strict';

angular.module('jwtNgNodeApp')
  .controller('RegisterCtrl', function ($scope, alert, $state, authToken, auth ) {
    $scope.submit = function(){
      auth.register($scope.email, $scope.password)
      .then(
        function(res){
          alert('success', 'Account created ', 'Welcome, '+res.data.user.email+'!');
          authToken.setToken(res.data.token);
          setTimeout(function () {
            $state.go('main');
          },200);
        },
        function(err){
          alert('warning', 'Oops', 'Could not register');
        }
      );
    };
  });
