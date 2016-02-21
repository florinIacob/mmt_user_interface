'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('LoginCtrl', function ($scope, $http, $location, $cookies, host_name) {

  $scope.postMessage = "";

  $scope.user = {
     email: "",
     username: "",
     password: ""
  }

  // login button
  $scope.submit_login = function() {
      var submitted_user = $scope.user;

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/user/login',
         headers: {
           'Content-Type': "application/json",
           'Access-Control-Allow-Origin' : '*'
         },
         data: JSON.stringify(submitted_user)
      }
      // make server request
      $http(req).then(
        function(response){
          // SUCCESS: change the path
          $cookies.put('mmtlt-cookie', response.headers('mmtlt'));
          $scope.postMessage = $cookies.get('mmtlt-cookie');
          //$location.path('/home')
        },
        function(response){
          $scope.postMessage = "Request failed!";
       });
  }
});
