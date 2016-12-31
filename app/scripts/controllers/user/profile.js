'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp').controller('ProfileCtrl',
      ['$scope', '$rootScope', '$q', '$http', '$location', '$route', '$cookieStore', 'IncomeUtilFactory', 'ChartUtilFactory',
               'CategoryService', '$uibModal', 'ModalTemplateService', 'host_name', 'CurrencyUtilFactory', 'ExpenseUtilFactory',
      function ($scope, $rootScope, $q, $http, $location, $route, $cookieStore, IncomeUtilFactory, ChartUtilFactory,
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

  $scope.sumOfIncomesThisYear = 0;
  $scope.sumOfIncomesThisMonth = 0;

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
          if (!response.data) {
            response.data = [];
          }
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
  var retrieveIncomes = function(startDate, endDate) {
    var deferred = $q.defer();
    // make server request
    IncomeUtilFactory.retrieveIncomesByTimeInterval('*', startDate.getTime(), endDate.getTime())
      .then(
        function success(response){

          if (!response.data) {
            response.data = [];
          }
          deferred.resolve(angular.fromJson(response.data));
        },
        function error(response){
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

  // ----------------- FUNCTIONS TO BE EXECUTED ------------------

  /**
   * Function executed to create Charts When expenses and incomes are loaded
   */
  $scope.createCharts = function(incomeArray, expenseArray) {

    // graphic arrays
    // - linear
    $scope.labelsLinear = ChartUtilFactory.createChartLabelsArray($scope.chartFromDate, $scope.chartUntilDate);
    $scope.seriesLinear = ['INCOMES in ' + $scope.default_currency, 'EXPENSES in ' + $scope.default_currency];
    var zeroesArray = generateZeroesArray(ChartUtilFactory.calculateNumberOfMonths($scope.chartFromDate, $scope.chartUntilDate));
    var zeroesArray2 = generateZeroesArray(ChartUtilFactory.calculateNumberOfMonths($scope.chartFromDate, $scope.chartUntilDate));
    $scope.dataLinear = [zeroesArray, zeroesArray2];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

    // BAR
    var startDateLabel = $scope.chartFromDate.formatDate(" ");
    var endDateLabel = $scope.chartUntilDate.formatDate(" ");
    $scope.labelsBar = [startDateLabel + ' - ' + endDateLabel];
    $scope.seriesBar = ['INCOMES in ' + $scope.default_currency, 'EXPENSES in ' + $scope.default_currency];
    $scope.dataBar = [[0], [0]];

    if (incomeArray && incomeArray.length > 0) {
      incomeArray.forEach(function(income) {
        var d = new Date(income.creationDate);

        var categ_index = ChartUtilFactory.getCorrespondingMonthIndex(d, $scope.chartFromDate, $scope.chartUntilDate);
        var incomeAmount = income.defaultCurrencyAmount == null ? income.amount : income.defaultCurrencyAmount;
        incomeAmount = Number(incomeAmount.toFixed(2));

        // LINEAR graphic
        $scope.dataLinear[0][categ_index] += incomeAmount;

        // BAR graphic
        $scope.dataBar[0][0] += incomeAmount;
      });
    }

    if (expenseArray && expenseArray.length > 0) {
      expenseArray.forEach(function(expense) {
        var d = new Date(expense.creationDate);

        var categ_index = ChartUtilFactory.getCorrespondingMonthIndex(d, $scope.chartFromDate, $scope.chartUntilDate);
        var expenseAmount = expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount;
        expenseAmount = Number(expenseAmount.toFixed(2));

        // LINEAR graphic
        $scope.dataLinear[1][categ_index] += expenseAmount;

        // BAR graphic
        $scope.dataBar[1][0] +=expenseAmount;
      });
    }
  }

  /**
   * Initiate budgets calculation
   */
  $scope.initiateBudgets = function() {
      $scope.numberOfExpensesThisMonth = 0;
      $scope.sumOfExpensesThisYear = 0;
      $scope.sumOfExpensesThisMonth = 0;

      $scope.sumOfIncomesThisYear = 0;
      $scope.sumOfIncomesThisMonth = 0;

      $scope.loading++;
      $scope.expenses;
      $q.all([
            retrieveExpenses(new Date(new Date().getFullYear(), 0, 1), new Date()),
            retrieveIncomes(new Date(new Date().getFullYear(), 0, 1), new Date())
        ]).then(function(responses) {

          $scope.expenses = responses[0];
          $scope.incomes = responses[1];

          $scope.iterateExpenses();
          $scope.iterateIncomes();

          $scope.createCharts($scope.incomes, $scope.expenses);

          $scope.loading--;
      });
  };

  $scope.initiateBudgets();

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
        // SUCCESS: open inform modal
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

        $scope.initiateBudgets();
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

  // ----------------------------- UPDATED WITH CHARTS -----------------------
  $scope.chartFromDate = new Date(new Date().getFullYear(), 0, 1);
  $scope.chartUntilDate = new Date();

  $scope.graphics = [
    "LINEAR",
    "BAR"
  ];
  $scope.graphic_index = 0;
  $scope.graphic_type = $scope.graphics[0];

  $scope.loadingCharts = 0;
  /**
   * Function executed when the date is changed
   */
  $scope.onDateSelect = function(yearChanged) {

      if (!$scope.chartFromDate) {
        $scope.chartFromDate = new Date(new Date().getFullYear(), 0, 1);
      }
      if (!$scope.chartUntilDate) {
        $scope.chartUntilDate = new Date();
      }
      $scope.loadingCharts--;

      // async execution
      $q.all([
        retrieveExpenses($scope.chartFromDate, $scope.chartUntilDate),
        retrieveIncomes($scope.chartFromDate, $scope.chartUntilDate)
      ]).then(
        function success(responseArray) {
          $scope.createCharts(responseArray[1].data, responseArray[0].data);
          $scope.loadingCharts++;
        },
        function error(errorArray) {

        }
      );
  }

  /**
   * Change graphic chart type
   */
  $scope.toggleGraphicTpye = function() {
    $scope.graphic_index ++;
    if ($scope.graphic_index >= $scope.graphics.length) {
      $scope.graphic_index = 0;
    }
    $scope.graphic_type = $scope.graphics[$scope.graphic_index];
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
