'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpenseHistoryCtrl
 * @description
 * # ExpenseHistoryCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpensesHistoryCtrl', function ($scope, $rootScope, $http, $location, $cookieStore,
        CategoryService, $uibModal, ModalTemplateService, host_name) {

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
      $scope.expenses = angular.fromJson(response.data);
    },
    function(response){
      // ERROR: inform the user
      $uibModal.open({
        animation: true,
        template: ModalTemplateService.getInfoTemplate(),
        controller: 'WarningPopupController',
        resolve: {
          items: function() {
            return {
              title: 'Information!',
              message: 'Expenses could NOT be loaded!',
              onYesCallback: null
            };
          },
        }
      });
   });

  // EDIT EXPENSE FUNCTIONALITY
  $scope.editExpense = function(index) {
    //TODO: implement edit expense function
    $uibModal.open({
      animation: true,
      template: ModalTemplateService.getEditExpenseTemplate(),
      controller: 'EditExpensePopupController',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            title: 'Information!',
            message: 'Expense successfully deleted!',
            onYesCallback: null
          };
        },
      }
    });
  }

  // DELETE EXPENSE FUNCTIONALITY
  $scope.deleteExpense = function(index) {

      // Function to be executed if the user press Yes on modal window
      var deleteHTTPRequest = function() {
        // prepare delete request
        var expense_id = $scope.expenses[index].id;
        var req = {
          method: 'DELETE',
          url: host_name + '/expense/delete/' + expense_id,
           headers: {
             'Content-Type': "application/json",
             'Authorization': $cookieStore.get('mmtlt')
           }
         }
        // make server request
        $http(req).then(
          function(response){

            $scope.expenses.splice(index, 1);
            $uibModal.open({
              animation: true,
              template: ModalTemplateService.getInfoTemplate(),
              controller: 'WarningPopupController',
              resolve: {
                items: function() {
                  return {
                    title: 'Information!',
                    message: 'Expense successfully deleted!',
                    onYesCallback: null
                  };
                },
              }
            });
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
                    message: 'Expense was NOT deleted!',
                    onYesCallback: null
                  };
                },
              }
            });
         });
       }

      $uibModal.open({
        animation: true,
        template: ModalTemplateService.getWarningTemplate(),
        controller: 'WarningPopupController',
        scope: $scope,
        resolve: {
          items: function() {
            return {
              title: 'Warning!',
              message: 'Are you sure do you want to delete expense [' + $scope.expenses[index].name + '] ?',
              onYesCallback: deleteHTTPRequest
            };
          },
        }
      });
   }

   // REDIRECT TO ADD EXPENSE PAGE
   $scope.addExpenseAttempt = function() {
      $location.path('/add_expense');
   }
});
