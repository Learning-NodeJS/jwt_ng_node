'use strict';

angular
  .module('jwtNgNodeApp')
  .config(function($urlRouterProvider, $stateProvider, $httpProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('main',{
      url:'/',
      templateUrl: '/views/main.html'
    })
    .state('register',{
      url:'/register',
      templateUrl: '/views/register.html',
      controller: 'RegisterCtrl'
    })
    .state('login',{
      url:'/login',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })
    .state('jobs',{
      url:'/jobs',
      templateUrl: '/views/jobs.html',
      controller: 'JobsCtrl'
    })
    .state('logout',{
      url:'/logout',
      //templateUrl: '/views/main.html',
      controller: 'LogoutCtrl'
    });

  })
  .constant('API_URL', 'http://localhost:3000/')
  .run(function ($window) {
    var params = $window.location.search.substring(1);
    if(params && $window.opener && $window.opener.location.origin === $window.location.origin){
      var pairs = params.split('=');
      var code = decodeURIComponent(pairs[1]);
      $window.opener.postMessage(code, $window.location.origin);
    }
    console.log(params);
  });
