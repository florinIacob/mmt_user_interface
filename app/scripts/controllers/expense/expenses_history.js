'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpenseHistoryCtrl
 * @description
 * # ExpenseHistoryCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpensesHistoryCtrl', function ($scope, $rootScope, $http, $location, $route, $cookieStore,
        CategoryService, $uibModal, ModalTemplateService, ExpenseUtilFactory, DateTimeService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.expenseFromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  $scope.expenseUntilDate = new Date();

  $scope.loading = false;
  $scope.expenses = [];

  /**
   * Retrieve the List of Expenses
   *
   */
  $scope.retrieveExpenseList = function() {
    if (!$scope.expenseFromDate) {
      $scope.expenseFromDate = new Date(new Date().getFullYear(), 0, 1);
    }
    if (!$scope.expenseUntilDate) {
      $scope.expenseUntilDate = new Date();
    }

    $scope.expenses = [];
    $scope.expenseFromDate.setHours(0);
    $scope.expenseFromDate.setMinutes(0);
    $scope.expenseUntilDate.setHours(23);
    $scope.expenseUntilDate.setMinutes(59);
    $scope.loading = true;

    ExpenseUtilFactory.retrieveExpensesByTimeInterval('*', $scope.expenseFromDate.getTime(), $scope.expenseUntilDate.getTime()).then(
      function success(response){
        if (response && response.data) {
          $scope.expenses = angular.fromJson(response.data);
        }
        $scope.loading = false;
      },
      function error(response){
        // ERROR: inform the user
        $uibModal.open({
          animation: true,
          templateUrl: 'views/modal/info-modal.html',
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
        $scope.loading = false;
     });
   }

   $scope.retrieveExpenseList();

  // EDIT EXPENSE FUNCTIONALITY
  $scope.editExpense = function(expense) {

    var refreshValues = function() {
       $scope.retrieveExpenseList();
    }

    $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/edit-expense-popup.html',
      controller: 'EditExpensePopupController',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            expense: JSON.parse(JSON.stringify(expense)),
            afterEditCallback: refreshValues
          };
        },
      }
    });
  }

  // DELETE EXPENSE FUNCTIONALITY
  $scope.deleteExpense = function(expense) {

      // Function to be executed if the user press Yes on modal window
      var deleteHTTPRequest = function() {
        // prepare delete request
        var expense_id = expense.id;
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

            $scope.retrieveExpenseList();
            $uibModal.open({
              animation: true,
              templateUrl: 'views/modal/info-modal.html',
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
              templateUrl: 'views/modal/info-modal.html',
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
        templateUrl: 'views/modal/warning-modal.html',
        controller: 'WarningPopupController',
        scope: $scope,
        size: 'lg',
        resolve: {
          items: function() {
            return {
              title: 'Warning!',
              message: 'Are you sure do you want to delete expense [' + expense.name + '] ?',
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

   // ------------------- CATEGORIES AREA ----------------------
   $scope.filter_category;
   // FILTER EXPENSES BY CATEGORY
   $scope.filterByCategory = function() {

      var filterCallback = function(selected_category) {
        if (selected_category == '< ALL CATEGORIES >') {
            $scope.filter_category = undefined;
            return;
        }
        $scope.filter_category = selected_category;
      }

      $uibModal.open({
        animation: true,
        templateUrl: 'views/modal/category-filter-modal.html',
        controller: 'CategoryFilterPopupController',
        resolve: {
          items: function() {
            return {
              title: 'CATEGORY FILTER!',
              message: 'Filter expenses by category: ',
              onFilterCallback: filterCallback,
              expenses: $scope.expenses
            };
          },
        }
      });
   }

   $scope.showCategoriesColors = false;
   $scope.useColoursForCategories = function() {
      $scope.showCategoriesColors = !$scope.showCategoriesColors;
   }

   // -------------- SORTING AREA ------------------
   $scope.sortColumn = 'creationDate';
   $scope.sortReverse = true;

   $scope.changeSortingCriteria = function(columnName) {
      $scope.sortColumn = columnName;
      $scope.sortReverse = !$scope.sortReverse;
   }

   // COLOURS
   $scope.colours_map = {
       light: 'white',
       stable: 'cornsilk',
       positive: 'DodgerBlue',
       calm: 'aqua',
       balanced: 'YellowGreen',
       energized: 'Gold',
       assertive: 'Crimson',
       royal: 'BlueViolet',
       dark: 'black'
   }

  /*---- Start DATE PICKER ----*/
   $scope.format = 'dd-MMMM-yyyy';
   $scope.altInputFormats = ['M!/d!/yyyy'];
   $scope.dateOptions = DateTimeService.getDateOptions();

   $scope.datePopup1 = {
     opened: false
   };
   $scope.openDatePicker1 = function() {
     $scope.datePopup1.opened = true;
   };
   $scope.datePopup2 = {
     opened: false
   };
   $scope.openDatePicker2 = function() {
     $scope.datePopup2.opened = true;
   };
   /*---- End DATE PICKER ----*/
});
