'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddExpenseCtrl
 * @description
 * # AddExpenseCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddExpenseCtrl', function ($scope, $http, $location, $cookies, categoryService, host_name) {

  $scope.postMessage = $cookies.get('mmtlt-cookie');
  $scope.newCategory = null;

  $scope.categories = [];
  $scope.categories = categoryService.getCategories();

  $scope.expense = {
     id: 0,
     name: "",
     category: "",
     description: "",
     amount: null,
     creationDate: ""
  }

  // submit button - save the expense
  $scope.submit = function() {
      var submitted_expense = {
        a: "Ana",
        b: "ss"
      }
      //var submitted_expense = $scope.expense;

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/expense/add',
         headers: {
           'Content-Type': "application/json",
           'Access-Control-Allow-Origin' : '*',
           'Access-Control-Expose-Headers': 'mmtlt',
           'mmtlt': $cookies.get('mmtlt-cookie')
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
    $scope.expense.category = $scope.newCategory;
    $scope.newCategory = null;
  }
});
