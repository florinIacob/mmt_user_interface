'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp').controller('ProfileCtrl',
      ['$scope', '$rootScope', '$q', '$http', '$location', '$route', '$cookieStore',
               'CategoryService', '$uibModal', 'ModalTemplateService', 'host_name', 'CurrencyUtilFactory', 'ExpenseUtilFactory',
      function ($scope, $rootScope, $q, $http, $location, $route, $cookieStore,
        CategoryService, $uibModal, ModalTemplateService, host_name, CurrencyUtilFactory, ExpenseUtilFactory) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.loading = 0;

  $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();

  $scope.default_currency = "";
  CurrencyUtilFactory.getDefaultCurrency().then(
    function(response){
      var currency = angular.fromJson(response.data);
      $scope.default_currency = currency.value;
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
              message: 'Cannot load default currency!',
              onYesCallback: null
            };
          },
        }
      });
   });

  var currentYear = 1900 + new Date().getYear();
  var currentMonth = new Date().getMonth();

  $scope.numberOfExpensesThisMonth = 0;
  $scope.sumOfExpensesThisYear = 0;
  $scope.sumOfExpensesThisMonth = 0;
  $scope.sumOfExpensesOverall = 0;

  $scope.sumOfIncomesThisYear = 0;
  $scope.sumOfIncomesThisMonth = 0;
  $scope.sumOfIncomesOverall = 0;

  // ----------- EXPENSES AREA ----------------
  $scope.iterateExpenses = function() {
    $scope.expenses.forEach(function(expense) {

        var d = new Date(expense.creationDate);
        expense.monthAsInt = d.getMonth();
        expense.monthAsString = extractMonthAsString(d.getMonth(), false);
        expense.year = 1900 + d.getYear();

        console.log('  >> EXPENSE: ' + expense.category.name);
        console.log('      - amount: ' + expense.amount);
        console.log('      - creationDate: ' + expense.creationDate);
        console.log('      - month: ' + expense.monthAsString);
        console.log('      - year: ' + expense.year);

        $scope.sumOfExpensesOverall = $scope.sumOfExpensesOverall + (expense.defaultCurrencyAmount ? expense.defaultCurrencyAmount : expense.amount);

        if (expense.monthAsInt === currentMonth) {
          $scope.numberOfExpensesThisMonth++;
          $scope.sumOfExpensesThisMonth = $scope.sumOfExpensesThisMonth + (expense.defaultCurrencyAmount ? expense.defaultCurrencyAmount : expense.amount);
        }
        if (expense.year === currentYear) {
          $scope.sumOfExpensesThisYear = $scope.sumOfExpensesThisYear + (expense.defaultCurrencyAmount ? expense.defaultCurrencyAmount : expense.amount);
        }
      })
  }

  // Retrieve expenses
  var retrieveExpenses = function(startTime, endTime) {
    var deferred = $q.defer();
    ExpenseUtilFactory.retrieveExpensesByTimeInterval('*', startTime.getTime(), endTime.getTime()).then(
        function(response){
          // SUCCESS: change the path
          deferred.resolve(angular.fromJson(response.data));
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
       return deferred.promise;
    }

    $scope.loading++;
    $scope.expenses;
    retrieveExpenses(new Date(0), new Date()).then(function(expenses) {
      $scope.expenses = expenses;

      $scope.iterateExpenses();
      $scope.loading--;
    });

    // ---------- INCOMES AREA -------------
    $scope.iterateIncomes = function() {

      $scope.incomes.forEach(function(income) {

          var d = new Date(income.creationDate);
          income.monthAsInt = d.getMonth();
          income.monthAsString = extractMonthAsString(d.getMonth(), false);
          income.year = 1900 + d.getYear();

          console.log('  >> INCOME: ' + income.name);
          console.log('      - amount: ' + income.amount);
          console.log('      - creationDate: ' + income.creationDate);
          console.log('      - month: ' + income.monthAsString);
          console.log('      - year: ' + income.year);

          $scope.sumOfIncomesOverall = $scope.sumOfIncomesOverall + (income.defaultCurrencyAmount ? income.defaultCurrencyAmount : income.amount);

          if (income.monthAsInt === currentMonth) {
            $scope.sumOfIncomesThisMonth = $scope.sumOfIncomesThisMonth + (income.defaultCurrencyAmount ? income.defaultCurrencyAmount : income.amount);
          }
          if (income.year === currentYear) {
            $scope.sumOfIncomesThisYear = $scope.sumOfIncomesThisYear + (income.defaultCurrencyAmount ? income.defaultCurrencyAmount : income.amount);
          }
        })
    }

    // Retrieve incomes
    var retrieveIncomes = function() {
      var deferred = $q.defer();
      var req = {
            method: 'GET',
            url: host_name + '/income/findByInterval/' + (new Date().getTime() - (30*24*60*60*1000)) + '/' + new Date().getTime(),
            headers: {
              'Content-Type': "application/json",
              'Authorization': $cookieStore.get('mmtlt')
           }
         }
        // make server request
        $http(req).then(
          function(response){
            // SUCCESS: change the path
            deferred.resolve(angular.fromJson(response.data));
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
                    message: 'Incomes could NOT be loaded!',
                    onYesCallback: null
                  };
                },
              }
            });
         });
         return deferred.promise;
      }

      $scope.loading++;
      $scope.incomes;
      retrieveIncomes().then(function(incomes) {
        $scope.incomes = incomes;

        $scope.iterateIncomes();
        $scope.loading--;
      });

      $scope.onCurrencyChange = function(new_value) {
        var submitted_currency = {
           value: new_value
        }

        // prepare post request
        var req = {
           method: 'POST',
           url: host_name + '/user/default_currency',
           headers: {
             'Content-Type': "application/json",
             'Authorization': $cookieStore.get('mmtlt')
           },
           data: JSON.stringify(submitted_currency)
        }
        // make server request
        $http(req).then(
          function(response){
            // SUCCESS: change the path
            $uibModal.open({
              animation: true,
              template: ModalTemplateService.getInfoTemplate(),
              controller: 'WarningPopupController',
              resolve: {
                items: function() {
                  return {
                    title: 'Information!',
                    message: 'Succesfully changed default currency!',
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
                    title: 'Error!',
                    message: 'Cannot change default currency!',
                    onYesCallback: null
                  };
                },
              }
            });
         });
      }

      /**
       * Open modal for changing password
       */
      $scope.changePassword = function() {
        $uibModal.open({
          animation: true,
          template: ModalTemplateService.getChangePasswordTemplate(),
          controller: 'ChangePasswordController',
          resolve: {
            items: function() {
              return {
                title: 'Information!',
                message: '',
                onYesCallback: null
              };
            },
          }
        });
      }
}]);

/**
  * Function used to extract the name of the month based on the received index.
  * Used because date variables stores the month as an integer and the UI will display month as a string.
  */
var extractMonthAsString = function(monthAsInt, returnSubArray) {
  var monthStrings = ["January", "February", "March", "April", "May", "June", "July", "August",
                        "September", "October", "November", "December"];
  if (returnSubArray) {
    return monthStrings.splice(0, monthAsInt + 1);
  } else {
    return monthStrings[monthAsInt];
  }
}

/**
  * Used to generate an array with the specified length filled with zeroes.
  */
var generateZeroesArray = function(length) {
  var zeroesArray = [];
  var index;
  for (index=0; index<length; index++) {
    zeroesArray.push(0);
  }
  return zeroesArray;
}

/**
  * Returns an array with tha last 5 years.
  */
var intializeYearsArray = function() {
  var currentYear = 1900 + new Date().getYear();
  var yearsArray = [
          currentYear.toString(),
          (currentYear - 1).toString(),
          (currentYear - 2).toString(),
          (currentYear - 3).toString(),
          (currentYear - 4).toString()];
  return yearsArray;
}
