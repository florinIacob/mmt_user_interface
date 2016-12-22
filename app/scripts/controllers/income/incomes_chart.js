'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:IncomesChartCtrl
 * @description
 * # IncomesChartCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('IncomesChartCtrl', function ($scope, $rootScope, $q, $http, $location, $route, $cookieStore,
        $uibModal, ModalTemplateService, CurrencyUtilFactory, IncomeUtilFactory, ChartUtilFactory, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.incomeFromDate = new Date(new Date().getFullYear(), 0, 1);
  $scope.incomeUntilDate = new Date();

  $scope.loading = true;

  $scope.yearsArray = intializeYearsArray();
  $scope.selected_year = (1900 + (new Date().getYear())).toString();

  $scope.graphics = ["LINEAR", "BAR", "DYNAMIC"];
  $scope.graphic_type = "LINEAR";

    // INCOMES AREA
    $scope.onDateSelect = function(yearChanged) {
      var month_index = new Date().getMonth();

      // TODO: evaluate the code after 'if'
      if (yearChanged === true) {
        if ($scope.selected_year != (1900 + new Date().getYear())) {
          month_index = 11;
          $scope.monthsArray = extractMonthAsString(month_index, true);
          $scope.selected_month = extractMonthAsString(month_index);
        } else {
          $scope.monthsArray = extractMonthAsString(new Date().getMonth(), true);
          $scope.selected_month = extractMonthAsString(new Date().getMonth());
        }
      }

      $scope.default_currency = "";
      if (!$scope.incomeFromDate) {
        $scope.incomeFromDate = new Date(new Date().getFullYear(), 0, 1);
      }
      if (!$scope.incomeUntilDate) {
        $scope.incomeUntilDate = new Date();
      }
      $scope.loading = true;

      // async execution
      $q.all([
        CurrencyUtilFactory.getDefaultCurrency(),
        IncomeUtilFactory.retrieveIncomesByTimeInterval('*', $scope.incomeFromDate.getTime(), $scope.incomeUntilDate.getTime()),
      ])
          .then(
            function success(responses) {
              var currency = angular.fromJson(responses[0].data);
              $scope.default_currency = currency.value;

              $scope.incomes = responses[1].data;

              // graphic arrays
              // - linear
              // DEL: $scope.labelsLinear = extractMonthAsString(month_index, true);
              $scope.labelsLinear = ChartUtilFactory.createChartLabelsArray($scope.incomeFromDate, $scope.incomeUntilDate);
              $scope.seriesLinear = ['Monthly Incomes in ' + $scope.default_currency];
              $scope.dataLinear = [generateZeroesArray(ChartUtilFactory.calculateNumberOfMonths($scope.incomeFromDate, $scope.incomeUntilDate))];
              $scope.onClick = function (points, evt) {
                console.log(points, evt);
              };
              // - bar
              $scope.labelsBar = [('Monthly Incomes in ' + $scope.default_currency)];
              $scope.seriesBar = ChartUtilFactory.createChartLabelsArray($scope.incomeFromDate, $scope.incomeUntilDate);
              $scope.dataBar = generateArraysWithZero(ChartUtilFactory.calculateNumberOfMonths($scope.incomeFromDate, $scope.incomeUntilDate));
              // - dynamic
              $scope.labelsDynamic = ChartUtilFactory.createChartLabelsArray($scope.incomeFromDate, $scope.incomeUntilDate);
              $scope.dataDynamic = generateZeroesArray(ChartUtilFactory.calculateNumberOfMonths($scope.incomeFromDate, $scope.incomeUntilDate));
              $scope.typeDynamic = 'Pie';
              $scope.toggleDynamicGraphic = function () {
                $scope.typeDynamic = $scope.typeDynamic === 'PolarArea' ?
                  'Pie' : 'PolarArea';
              };

              if (!$scope.incomes || $scope.incomes.length === 0) {
                $scope.loading = false;
                return;
              }
              $scope.incomes.forEach(function(income) {

                  var d = new Date(income.creationDate);
                  income.monthAsInt = d.getMonth();
                  income.monthAsString = extractMonthAsString(d.getMonth(), false);
                  income.year = d.getFullYear();

                  console.log('  >> INCOME: ' + income.name);
                  console.log('      - amount: ' + income.amount);
                  console.log('      - creationDate: ' + income.creationDate);
                  console.log('      - month: ' + income.monthAsString);
                  console.log('      - year: ' + income.year);

                  var categ_index = ChartUtilFactory.getCorrespondingMonthIndex(d, $scope.incomeFromDate, $scope.incomeUntilDate);
                  var incomeAmount = income.defaultCurrencyAmount == null ? income.amount : income.defaultCurrencyAmount;
                  incomeAmount = Number(incomeAmount.toFixed(2));

                  // LINEAR graphic
                  $scope.dataLinear[0][categ_index] += incomeAmount;

                  // BAR graphic
                  $scope.dataBar[categ_index][0] += incomeAmount;

                  // DYNAMIC graphic
                  $scope.dataDynamic[categ_index] += incomeAmount;
                });
                $scope.loading = false;

          }, function error(response){
             // ERROR: inform the user
             $uibModal.open({
               animation: true,
               template: ModalTemplateService.getInfoTemplate(),
               controller: 'WarningPopupController',
               resolve: {
                 items: function() {
                   return {
                     title: 'Information!',
                     message: 'Cannot load Incomes Chart page!',
                     onYesCallback: null
                   };
                 },
               }
             });
          });
    }

    $scope.incomes;
    $scope.onDateSelect(true);
});

/**
  * Function used to extract the name of the month based on the received index.
  * Used because date variables stores the month as an integer and the UI will display month as a string.
  */
var extractMonthAsString = function(monthAsInt, returnSubArray, year) {
  var monthStrings = ["January", "February", "March", "April", "May", "June", "July", "August",
                        "September", "October", "November", "December"];

  if (year) {
    var arrayLength = monthStrings.length;
    for (var i = 0; i < arrayLength; i++) {
        month
    }
  }

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
  * Used to generate arrays based on the specified arrays number.
  * The function returns an array of arrays, each array containing the number 0.
  */
var generateArraysWithZero = function(numberOfArrays) {
  var arrayOfArrays = [];
  var index;
  for (index=0; index<numberOfArrays; index++) {
    arrayOfArrays.push([0]);
  }
  return arrayOfArrays;
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
