'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddIncomeCtrl
 * @description
 * # AddIncomeCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddIncomeCtrl', function ($scope, $http, $location, categoryService) {

    $scope.postMessage = null;
    $scope.newCategory = null;

    $scope.categories = [];
    $scope.categories = categoryService.getCategories();

  $scope.income = {
     id: 0,
     name: "",
     category: "",
     description: "",
     amount: undefined,
     creationDate: ""
  }

  // submit button - save the expense
  $scope.submit = function() {
      var submited_income = $scope.income;

      // prepare post request
      var req = {
         method: 'POST',
         url: 'http://localhost:8080/income/add',
         headers: {
           'Content-Type': "application/json"
         },
         data: JSON.stringify(submited_income)
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

    $scope.addCategory = function() {
      categoryService.addCategory($scope.newCategory, $scope.categories);
      $scope.income.category = $scope.newCategory;
      $scope.newCategory = null;
    }
});
