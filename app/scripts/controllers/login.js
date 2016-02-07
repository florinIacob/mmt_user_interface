'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('LoginCtrl', function ($scope, $http, $location) {

  $scope.postMessage = null;

  $scope.user = {
     email: "",
     username: "",
     password: ""
  }

  // login button
  $scope.submit_login = function() {
      var submitted_user = $scope.user;
      $scope.postMessage = "LOGIN";
      // prepare post request
      var req = {
         method: 'POST',
         url: 'http://localhost:8080/user/login/',
         headers: {
           'Content-Type': "application/json"
         },
         data: JSON.stringify(submitted_user)
      }
      // make server request
      $http(req).then(
        function(response){
          // SUCCESS: change the path
          $location.path('/home')
        },
        function(response){
          $scope.postMessage = response.data || "Request failed!";
       });
  }
});
