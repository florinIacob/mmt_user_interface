'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpenseHistoryCtrl
 * @description
 * # ExpenseHistoryCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpensesHistoryCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, categoryService, host_name) {

  $scope.request_result = 'DEFAULT';

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.expenses = [];

   // prepare post request
  var req = {
    method: 'GET',
    url: host_name + '/expense/find_all',
     headers: {
       'Content-Type': "application/json",
       'Authorization': $cookieStore.get('mmtlt')
     }
   }
  // make server request
  $http(req).then(
    function(response){
      // SUCCESS: change the path
      $scope.request_result = 'SUCCESS';
      $scope.expenses = angular.fromJson(response.data);
      //$location.path('/');
    },
    function(response){
       $scope.request_result = 'ERROR';
       //$location.path('/login');
   });
});
