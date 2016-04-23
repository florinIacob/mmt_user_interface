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
        CategoryService, $uibModal, ModalTemplateService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.yearsArray = intializeYearsArray();
  $scope.selected_year = (1900 + (new Date().getYear())).toString();
  $scope.monthsArray = extractMonthAsString(new Date().getMonth(), true);
  $scope.selected_month = extractMonthAsString(new Date().getMonth());
  $scope.show_categories_legend = true;
  $scope.toggleLegendShow = function() {
    $scope.show_categories_legend = !$scope.show_categories_legend;
  }

  $scope.graphics = ["LINEAR", "BAR", "PIE", "DOUGHNUT", "POLAR", "DYNAMIC"];
  $scope.graphic_type = "LINEAR";

  // EXPENSES AREA
  $scope.onDateSelect = function(yearChanged) {
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
    }

    // graphic arrays
    // - linear
    $scope.labelsLinear = extractMonthAsString(month_index, true);
    $scope.seriesLinear = [];
    $scope.dataLinear = [];
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
    $scope.labelsDynamic = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
    $scope.dataDynamic = [300, 500, 100, 40, 120];
    $scope.typeDynamic = 'PolarArea';
    $scope.toggleDynamic = function () {
      $scope.typeDynamic = $scope.typeDynamic === 'PolarArea' ?
        'Pie' : 'PolarArea';
    };

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

        // LINEAR graphic
        if ($scope.selected_year == expense.year.toString()) {
          var categ_index = $scope.seriesLinear.indexOf(expense.category.name);
          if (categ_index > -1) {
            $scope.dataLinear[categ_index][expense.monthAsInt] = expense.amount
                + $scope.dataLinear[categ_index][expense.monthAsInt];
          } else {
            $scope.seriesLinear.push(expense.category.name);
            var currentCategoryExpensesAmountsArray = generateZeroesArray(new Date().getMonth() + 1);
            currentCategoryExpensesAmountsArray[expense.monthAsInt] = expense.amount;
            $scope.dataLinear.push(currentCategoryExpensesAmountsArray);
          }
        }

        // BAR graphic
        if ($scope.selected_year == expense.year.toString()) {
          var categ_index = $scope.seriesBar.indexOf(expense.category.name);
          if (categ_index > -1) {
            var amounts = [expense.amount + $scope.dataBar[categ_index][0]];
            $scope.dataBar[categ_index] = amounts;
          } else {
            $scope.seriesBar.push(expense.category.name);
            var amounts = [expense.amount];
            $scope.dataBar.push(amounts);
          }
        }

        // DOUGHNUT graphic
        if ($scope.selected_year == expense.year.toString()) {
          categ_index = $scope.labelsDoughnut.indexOf(expense.category.name);
          if (categ_index > -1) {
            $scope.dataDoughnut[categ_index] = expense.amount + $scope.dataDoughnut[categ_index];
          } else {
            $scope.labelsDoughnut.push(expense.category.name);
            $scope.dataDoughnut.push(expense.amount);
          }
        }

        // PIE graphic
        if (($scope.selected_year == expense.year.toString()) && ($scope.selected_month == expense.monthAsString)) {
          categ_index = $scope.labelsPie.indexOf(expense.category.name);
          if (categ_index > -1) {
            $scope.dataPie[categ_index] = expense.amount + $scope.dataPie[categ_index];
          } else {
            $scope.labelsPie.push(expense.category.name);
            $scope.dataPie.push(expense.amount);
          }
        }

        // POLAR graphic
        categ_index = $scope.labelsPolar.indexOf(expense.category.name);
        if (categ_index > -1) {
          $scope.dataPolar[categ_index] = expense.amount + $scope.dataPolar[categ_index];
        } else {
          $scope.labelsPolar.push(expense.category.name);
          $scope.dataPolar.push(expense.amount);
        }
      })
  }

  // Retrieve expenses
  var retrieveExpenses = function() {
    var deferred = $q.defer();
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

    $scope.expenses;
    retrieveExpenses().then(function(expenses) {
      $scope.expenses = expenses;

      $scope.onDateSelect();
    });
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
