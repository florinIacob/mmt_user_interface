'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('SignUpCtrl', function ($scope, $http, $location, host_name) {

  $scope.postMessage = null;
  $scope.retyped_password = null;

  $scope.user = {
     id: 0,
     email: "",
     username: "",
     password: "",
     firstName: "",
     surname: "",
     birthdate: "",
     activated: ""
  }

  // submit button - save the user
  $scope.submit = function() {
      var submitted_user = $scope.user;
      var valid_attempt = true;
      if (submitted_user.password !== $scope.retyped_password) {
          $scope.postMessage = "Please retype the same password!";
          $scope.retyped_password = null;
          $scope.user.password = null;
          return;
      }

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/user/add',
         headers: {
           'Content-Type': "application/json",
           'Access-Control-Allow-Origin' : '*'
         },
         data: JSON.stringify(submitted_user)
      }
      // make server request
      $http(req).then(
        function(){
          // SUCCESS: change the path
          $location.path('/home')
        },
        function(response){
          $scope.postMessage = response.data || "Request failed!";
       });
  }
});
