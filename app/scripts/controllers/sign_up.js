'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('SignUpCtrl', function ($scope, $http, $location) {

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
      var submited_user = $scope.user;
      var valid_attempt = true;
      if (submited_user.password !== $scope.retyped_password) {
          $scope.postMessage = "Please retype the same password!";
          $scope.retyped_password = null;
          $scope.user.password = null;
          return;
      }

      // prepare post request
      var req = {
         method: 'POST',
         url: 'http://localhost:8080/user/add',
         headers: {
           'Content-Type': "application/json"
         },
         data: JSON.stringify($scope.user)
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
