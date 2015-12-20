'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('SignUpCtrl', function ($scope, $http) {

  $scope.postMessage = "DEFAULT";

  $scope.user = {
     id: 0,
     //email: "",
     //password: ""
     firstName: "",
     surname: "",
     birthdate: 1450044000000
  }


  // submit button - save the user
  $scope.submit = function() {
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
          $scope.postMessage = "SUCCESS";
        },
        function(){
          $scope.postMessage = "ERROR";
       });
  }
});
