'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpenseHistoryCtrl
 * @description
 * # ExpenseHistoryCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpensesHistoryCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, $uibModal,
        categoryService, modalTemplateService, host_name) {

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
      $scope.expenses = angular.fromJson(response.data);
    },
    function(response){
      //TODO: open error popup
   });

  // EDIT EXPENSE FUNCTIONALITY
  $scope.editExpense = function(index) {
    //TODO: implement edit expense function
  }

  // DELETE EXPENSE FUNCTIONALITY
  $scope.deleteExpense = function(index) {

      $uibModal.open({
        animation: false,
        template: modalTemplateService.getWarningTemplate(),
        controller: 'WarningPopupController',
        resolve: {
          items: function() {
            return {
              title: 'Warning!',
              message: 'Are you sure do you want to delete expense [' + $scope.expenses[index].name + '] ?',
              onYesCallback: function() {
                alert('Yes function called! : ' + $scope.expenses[index].name);
              }
            };
          },
        }
      });

      var expense_id = $scope.expenses[index].id;
      $scope.expenses.splice(index, 1);

      // prepare delete request
      var req = {
        method: 'DELETE',
        url: host_name + '/expense/deletesas/' + expense_id,
         headers: {
           'Content-Type': "application/json",
           'Authorization': $cookieStore.get('mmtlt')
         }
       }
      // make server request
      $http(req).then(
        function(response){
          //$dialog.dialog({}).open('add_expense.html');
        },
        function(response){
          //TODO: open error popup
          //$dialog.dialog({}).open('add_expense.html');
       });
   }
});
