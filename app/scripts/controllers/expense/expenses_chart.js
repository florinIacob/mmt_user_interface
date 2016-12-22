'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpensesChartCtrl
 * @description
 * # ExpensesChartCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpensesChartCtrl', function ($scope, $rootScope, $q, $http, $location, $route, $cookieStore,
        CategoryService, $uibModal, ModalTemplateService, host_name, ExpenseUtilFactory, CurrencyUtilFactory, ChartUtilFactory) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.loading = true;

  $scope.yearsArray = intializeYearsArray();
  $scope.selected_year = (1900 + (new Date().getYear())).toString();
  $scope.monthsArray = extractMonthAsString(new Date().getMonth(), true);
  $scope.selected_month = extractMonthAsString(new Date().getMonth());
  $scope.show_categories_legend = true;
  $scope.toggleLegendShow = function() {
    $scope.show_categories_legend = !$scope.show_categories_legend;
  }

  $scope.graphics = ["LINEAR - Monthly progress by categories", "BAR", "PIE", "DOUGHNUT", "POLAR", "DYNAMIC"];
  $scope.graphic_type = $scope.graphics[0];

  // Retrieve expenses
  var retrieveExpensesByTimeInterval = function(startDate, endDate) {
    var deferred = $q.defer();
    ExpenseUtilFactory.retrieveExpensesByTimeInterval('*', startDate.getTime(), endDate.getTime()).then(
        function(response){
          // SUCCESS
          if (response.status == 200) {
            deferred.resolve(angular.fromJson(response.data));
          } else {
            deferred.resolve([]);
          }
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

  // EXPENSES AREA
  $scope.onPeriodSelect = function(yearChanged) {
    var month_index = new Date().getMonth();
    if (yearChanged === true) {
      if ($scope.selected_year != (1900 + new Date().getYear())) {
        month_index = 11;
        $scope.monthsArray = extractMonthAsString(month_index, true);
        $scope.selected_month = extractMonthAsString(month_index);
      } else {
        $scope.monthsArray = extractMonthAsString(new Date().getMonth(), true);
        $scope.selected_month = extractMonthAsString(new Date().getMonth());
      }

      $scope.loading = true;
      $q.all([
          CurrencyUtilFactory.getDefaultCurrency(),
          retrieveExpensesByTimeInterval(new Date($scope.selected_year, 0, 1), new Date($scope.selected_year, 11, 31)),
      ])
        .then(
            function successCallback(responses) {
              $scope.loading = false;
              var currency = angular.fromJson(responses[0].data);
              $scope.default_currency = currency.value;

              $scope.expenses = responses[1];

              // GRAPHIC ARRAYS
                // - linear
                $scope.labelsLinearOld = extractMonthAsString(month_index, true);
                $scope.seriesLinearOld = [];
                $scope.dataLinearOld = [];
                $scope.onClick = function (points, evt) {
                  console.log(points, evt);
                };
                // - bar
                $scope.labelsBar = [$scope.selected_year];
                $scope.seriesBar = [];
                $scope.dataBar = [];
                // - pie
                $scope.labelsPie = [];
                $scope.dataPie = [];
                // - doughnut
                $scope.labelsDoughnut = [];
                $scope.dataDoughnut = [];
                // - polar
                $scope.labelsPolar = [];
                $scope.dataPolar = [];
                // - dynamic
                $scope.labelsDynamic = [];
                $scope.dataDynamic = [];
                $scope.typeDynamic = 'PolarArea';
                $scope.toggleDynamicGraphic = function () {
                  $scope.typeDynamic = $scope.typeDynamic === 'PolarArea' ?
                    'Pie' : 'PolarArea';
                };

                $scope.expenses.forEach(function(expense) {

                    var d = new Date(expense.creationDate);
                    expense.monthAsInt = d.getMonth();
                    expense.monthAsString = extractMonthAsString(d.getMonth(), false);

                    console.log('  >> EXPENSE: ' + expense.category.name);
                    console.log('      - amount: ' + expense.amount);
                    console.log('      - creationDate: ' + expense.creationDate);
                    console.log('      - month: ' + expense.monthAsString);
                    console.log('      - year: ' + d.getFullYear());

                    // LINEAR graphic
                    var categ_index = $scope.seriesLinearOld.indexOf(expense.category.name);
                    if (categ_index > -1) {
                      $scope.dataLinearOld[categ_index][expense.monthAsInt] = (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount)
                          + $scope.dataLinearOld[categ_index][expense.monthAsInt];
                    } else {
                      $scope.seriesLinearOld.push(expense.category.name);
                      var currentCategoryExpensesAmountsArray = generateZeroesArray(new Date().getMonth() + 1);
                      currentCategoryExpensesAmountsArray[expense.monthAsInt] = expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount;
                      $scope.dataLinearOld.push(currentCategoryExpensesAmountsArray);
                    }

                    // BAR graphic
                    var categ_index = $scope.seriesBar.indexOf(expense.category.name);
                    if (categ_index > -1) {
                      var amounts = [(expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount) + $scope.dataBar[categ_index][0]];
                      $scope.dataBar[categ_index] = amounts;
                    } else {
                      $scope.seriesBar.push(expense.category.name);
                      var amounts = [expense.defaultCurrencyAmount == null ? (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount) : expense.defaultCurrencyAmount];
                      $scope.dataBar.push(amounts);
                    }

                    // DOUGHNUT graphic
                    categ_index = $scope.labelsDoughnut.indexOf(expense.category.name);
                    if (categ_index > -1) {
                      $scope.dataDoughnut[categ_index] = (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount) + $scope.dataDoughnut[categ_index];
                    } else {
                      $scope.labelsDoughnut.push(expense.category.name);
                      $scope.dataDoughnut.push(expense.defaultCurrencyAmount == null ? (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount) : expense.defaultCurrencyAmount);
                    }

                    // PIE graphic
                    if ($scope.selected_month == expense.monthAsString) {
                      categ_index = $scope.labelsPie.indexOf(expense.category.name);
                      if (categ_index > -1) {
                        $scope.dataPie[categ_index] = (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount) + $scope.dataPie[categ_index];
                      } else {
                        $scope.labelsPie.push(expense.category.name);
                        $scope.dataPie.push(expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount);
                      }
                    }

                    // POLAR graphic
                    categ_index = $scope.labelsPolar.indexOf(expense.category.name);
                    if (categ_index > -1) {
                      $scope.dataPolar[categ_index] = (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount) + $scope.dataPolar[categ_index];
                    } else {
                      $scope.labelsPolar.push(expense.category.name);
                      $scope.dataPolar.push((expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount));
                    }

                    // DYNAMIC graphic
                    if ($scope.selected_month == expense.monthAsString) {
                      categ_index = $scope.labelsDynamic.indexOf(expense.category.name);
                      if (categ_index > -1) {
                        $scope.dataDynamic[categ_index] = (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount) + $scope.dataDynamic[categ_index];
                      } else {
                        $scope.labelsDynamic.push(expense.category.name);
                        $scope.dataDynamic.push((expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount));
                      }
                    }
                  });
                },
                function errorCallback(response) {
                  console.error("Problems on loading graphics: " + response.data);
                  $scope.loading = false;
                }
      );
    }
  }

  $scope.expenses;
  $scope.onPeriodSelect(true);

  // ------------- UPDATED GRAPHICS ---------------------
  $scope.expenseFromDate = new Date(new Date().getFullYear(), 0, 1);
  $scope.expenseUntilDate = new Date();

  /**
   * Function to be executed when the date is changed
   */
  $scope.onDateSelect = function() {
    $scope.loading = true;
    $q.all([
        CurrencyUtilFactory.getDefaultCurrency(),
        retrieveExpensesByTimeInterval($scope.expenseFromDate, $scope.expenseUntilDate),
    ])
    .then(
        function successCallback(responses) {
          $scope.loading = false;

          var currency = angular.fromJson(responses[0].data);
          $scope.default_currency = currency.value;

          $scope.expenses = responses[1];

          // LINEAR
          $scope.labelsLinear = ChartUtilFactory.createChartLabelsArray($scope.expenseFromDate, $scope.expenseUntilDate);
          $scope.seriesLinear = [];
          $scope.dataLinear = [];
          $scope.onClick = function (points, evt) {
            console.log(points, evt);
          };

          $scope.expenses.forEach(function(expense) {
            var d = new Date(expense.creationDate);
            var currentAmount = (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount);
            currentAmount = Number(currentAmount.toFixed(2));
            var expenseMonthAsInt = ChartUtilFactory.getCorrespondingMonthIndex(d, $scope.expenseFromDate, $scope.expenseUntilDate);

            // LINEAR graphic
            var categ_index = $scope.seriesLinear.indexOf(expense.category.name);
            if (categ_index > -1) {
              $scope.dataLinear[categ_index][expenseMonthAsInt] += currentAmount;
            } else {
              $scope.seriesLinear.push(expense.category.name);
              var currentCategoryExpensesAmountsArray = generateZeroesArray(ChartUtilFactory.calculateNumberOfMonths($scope.expenseFromDate, $scope.expenseUntilDate));
              currentCategoryExpensesAmountsArray[expenseMonthAsInt] = currentAmount;
              $scope.dataLinear.push(currentCategoryExpensesAmountsArray);
            }
          });
        }
    );
  }

  $scope.onDateSelect();
});

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
