'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddExpenseCtrl
 * @description
 * # AddExpenseCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddExpenseCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, CategoryService, DateTimeService,
       $uibModal, ModalTemplateService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.newCategory = null;
  $scope.categories = [];
  $scope.categories = CategoryService.getCategoryNames();

  $scope.current_date_value = DateTimeService.createCurrentDateTimeString();
  console.log($scope.current_date_value);

  $scope.expense = {
     id: 0,
     name: "",
     category: {
        name: ""
     },
     description: "",
     amount: null,
     creationDate: null,
     currency: "USD"
  }

  // submit button - save the expense
  $scope.submit = function() {
      var submitted_expense = $scope.expense;
      if (submitted_expense.creationDate == null) {
        submitted_expense.creationDate = new Date();
      }

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
          $location.path('/expenses_history')
        },
        function(response){
          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Information!',
                  message: 'Expense not created! Please choose a category \nor use another expense name!',
                  onYesCallback: null
                };
              },
            }
          });
       });
  }

  $scope.addCategory = function() {
    CategoryService.addCategoryName($scope.newCategory, $scope.categories);
    $scope.expense.category.name = $scope.newCategory;
    $scope.newCategory = null;
  }
});
