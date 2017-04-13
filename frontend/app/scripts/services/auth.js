'use strict';

angular.module('jwtNgNodeApp')
  .service('auth', function ($http,API_URL, $window) {

    this.login = function(email, password){
      var user = {
        email: email,
        password: password
      };
      return $http.post(API_URL+'login', user);
    }
    this.register = function(email, password){
      var user = {
        email: email,
        password: password
      };
      return $http.post(API_URL+'register', user);
    }
    var urlBuilder = [];
    var clientId = '155078410981-ll7l93v5v4jk09uo1oiliahp51aok22r.apps.googleusercontent.com';
    urlBuilder.push('response_type=code',
                    'client_id=' + clientId,
                    'redirect_uri='+window.location.origin,
                    'scope=profile email');

    this.googleAuth = function () {
      var url = "https://accounts.google.com/o/oauth2/auth?"+urlBuilder.join('&');
      var options="width:500, height=500, left=" + ($window.outerwidth - 500)/2+ ", top="+ ($window.outerHeight -500 )/2.5;
      var popup = $window.open(url,'', options);
      $window.focus();

      $window.addEventListener('message', function (event) {
        if(event.origin ===  $window.location.origin){
          var code = event.data;
          popup.close();
          $http.post(API_URL+'auth/google', {
            code:code,
            clientId : clientId,
            redirectUri: window.location.origin
          });
        }
      })
    }
  });
