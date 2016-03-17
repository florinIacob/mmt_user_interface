'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddExpenseCtrl
 * @description
 * # AddExpenseCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddExpenseCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, categoryService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.newCategory = null;

  $scope.categories = [];
  $scope.categories = categoryService.getCategories();

  $scope.expense = {
     id: 0,
     name: "",
     category: {
        name: ""
     },
     description: "",
     amount: null,
     creationDate: "",
     currency: "USD"
  }

  // submit button - save the expense
  $scope.submit = function() {
      var submitted_expense = $scope.expense;
      //var submitted_expense = $scope.expense;

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/expense/add',
         headers: {
           'Content-Type': "application/json",
           'Authorization': $cookieStore.get('mmtlt')
         },
         data: JSON.stringify(submitted_expense)
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

  $scope.addCategory = function() {
    categoryService.addCategory($scope.newCategory, $scope.categories);
    $scope.expense.category.name = $scope.newCategory;
    $scope.newCategory = null;
  }
});
