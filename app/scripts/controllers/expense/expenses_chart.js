'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpensesChartCtrl
 * @description
 * # ExpensesChartCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpensesChartCtrl', function ($scope, $rootScope, $q, $http, $location, $route, $cookieStore, DateTimeService,
        CategoryService, $uibModal, ModalTemplateService, host_name, ExpenseUtilFactory, CurrencyUtilFactory, ChartUtilFactory) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.loading = true;

  $scope.yearsArray = intializeYearsArray();
  $scope.selected_year = new Date().getFullYear().toString();
  $scope.monthsArray = extractMonthAsString(new Date().getMonth(), true);
  $scope.selected_month = extractMonthAsString(new Date().getMonth());
  $scope.show_categories_legend = true;
  $scope.toggleLegendShow = function() {
    $scope.show_categories_legend = !$scope.show_categories_legend;
  }

  $scope.graphics = [
    "LINEAR - Monthly progress by categories",
    "BAR - Compare categories",
    "DYNAMIC - Present expenses for each category",
    "PIE - Monthly presentation",
    "DOUGHNUT - Yearly presentation"
  ];
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
  $scope.onPeriodSelect = function(yearChanged, selected_year) {
    if (selected_year) {
      $scope.selected_year = selected_year;
    }

    var month_index = new Date().getMonth();
    if (yearChanged === true) {
      if ($scope.selected_year != new Date().getFullYear()) {
        month_index = 11;
        $scope.monthsArray = extractMonthAsString(month_index, true);
        $scope.selected_month = extractMonthAsString(month_index);
      } else {
        $scope.monthsArray = extractMonthAsString(new Date().getMonth(), true);
        $scope.selected_month = extractMonthAsString(new Date().getMonth());
      }
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

            // - pie
            $scope.labelsPie = [];
            $scope.dataPie = [];
            // - doughnut
            $scope.labelsDoughnut = [];
            $scope.dataDoughnut = [];

            $scope.expenses.forEach(function(expense) {

                var d = new Date(expense.creationDate);
                expense.monthAsInt = d.getMonth();
                expense.monthAsString = extractMonthAsString(d.getMonth(), false);

                console.log('  >> EXPENSE: ' + expense.category.name);
                console.log('      - amount: ' + expense.amount);
                console.log('      - creationDate: ' + expense.creationDate);
                console.log('      - month: ' + expense.monthAsString);
                console.log('      - year: ' + d.getFullYear());

                // DOUGHNUT graphic
                var categ_index = $scope.labelsDoughnut.indexOf(expense.category.name);
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
              });
            },
            function errorCallback(response) {
              console.error("Problems on loading graphics: " + response.data);
              $scope.loading = false;
            }
      );

  }

  $scope.expenses;
  $scope.onGraphicChange = function(graphic_type, selected_year) {
    if (graphic_type.indexOf("PIE") > -1 || graphic_type.indexOf("DOUGHNUT") > -1) {
      $scope.onPeriodSelect(true, selected_year);
    }
  }

  // ------------- UPDATED GRAPHICS ---------------------
  $scope.expenseFromDate = new Date(new Date().getFullYear(), 0, 1);
  $scope.expenseUntilDate = new Date();

  $scope.barCategoriesModel = [];
  $scope.dynamicCategoriesModel = [];
  $scope.categoriesData = [];
  $scope.categoriesDataLoaded = false;
  var categoryContained = function(categoriesDataArray, categoryName) {
    var i;
    for (i = 0; i < categoriesDataArray.length; i++) {
      if (categoriesDataArray[i].label === categoryName) {
          return true;
      }
    }
    return false;
  }
  $scope.categoriesSettings = {externalIdProp: ''};

  $scope.typeDynamic = 'PolarArea';
  $scope.toggleDynamicGraphic = function () {
    $scope.typeDynamic = $scope.typeDynamic === 'PolarArea' ?
      'Pie' : 'PolarArea';
  };

  /**
   * Function to be executed when the date is changed
   */
  $scope.onDateSelect = function() {

    if (!$scope.expenseFromDate) {
      $scope.expenseFromDate = new Date(new Date().getFullYear(), 0, 1);
    }
    if (!$scope.expenseUntilDate) {
      $scope.expenseUntilDate = new Date();
    }
    $scope.expenseFromDate.setHours(0);
    $scope.expenseFromDate.setMinutes(0);
    $scope.expenseUntilDate.setHours(23);
    $scope.expenseUntilDate.setMinutes(59);
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

          $scope.categoriesData = [];

          $scope.expenses = responses[1];

          // LINEAR - Monthly progress by categories
          $scope.labelsLinear = ChartUtilFactory.createChartLabelsArray($scope.expenseFromDate, $scope.expenseUntilDate);
          $scope.seriesLinear = [];
          $scope.dataLinear = [];
          $scope.onClick = function (points, evt) {
            console.log(points, evt);
          };

          // BAR - Compare categories
          var startDateLabel = $scope.expenseFromDate.formatDate(" ");
          var endDateLabel = $scope.expenseUntilDate.formatDate(" ");
          $scope.labelsBar = [startDateLabel + ' - ' + endDateLabel];
          $scope.seriesBar = [];
          $scope.dataBar = [];

          // DYNAMIC - Present expenses for each category
          $scope.labelsDynamic = [];
          $scope.dataDynamic = [];

          $scope.expenses.forEach(function(expense) {
            var d = new Date(expense.creationDate);
            var currentAmount = (expense.defaultCurrencyAmount == null ? expense.amount : expense.defaultCurrencyAmount);
            currentAmount = Number(currentAmount.toFixed(2));
            var expenseMonthAsInt = ChartUtilFactory.getCorrespondingMonthIndex(d, $scope.expenseFromDate, $scope.expenseUntilDate);

            // Populate Categories for Choice
            if (!categoryContained($scope.categoriesData, expense.category.name)) {
              var selectableCategory = {
                id: expense.category.id,
                label: expense.category.name
              };
              $scope.categoriesData.push(selectableCategory);
              if ($scope.dynamicCategoriesModel.length === 0) {
                $scope.dynamicCategoriesModel.push(selectableCategory);
              }
            }

            // LINEAR - Monthly progress by categories
            var categ_index = $scope.seriesLinear.indexOf(expense.category.name);
            if (categ_index > -1) {
              $scope.dataLinear[categ_index][expenseMonthAsInt] += currentAmount;
            } else {
              $scope.seriesLinear.push(expense.category.name);
              var currentCategoryExpensesAmountsArray = generateZeroesArray(ChartUtilFactory.calculateNumberOfMonths($scope.expenseFromDate, $scope.expenseUntilDate));
              currentCategoryExpensesAmountsArray[expenseMonthAsInt] = currentAmount;
              $scope.dataLinear.push(currentCategoryExpensesAmountsArray);
            }

            // BAR - Compare categories
            if ($scope.barCategoriesModel.length === 0 || categoryContained($scope.barCategoriesModel, expense.category.name)) {
              var categ_index = $scope.seriesBar.indexOf(expense.category.name);
              if (categ_index > -1) {
                var amounts = [currentAmount + $scope.dataBar[categ_index][0]];
                $scope.dataBar[categ_index] = amounts;
              } else {
                $scope.seriesBar.push(expense.category.name);
                var amounts = [currentAmount];
                $scope.dataBar.push(amounts);
              }
            }

            // DYNAMIC - Present expenses for each category
            if ($scope.dynamicCategoriesModel.length === 0 || categoryContained($scope.dynamicCategoriesModel, expense.category.name)) {
              $scope.labelsDynamic.push(expense.name);
              $scope.dataDynamic.push(currentAmount);
            }
          });

          $scope.categoriesDataLoaded = true;
        }
    );
  }

  $scope.onDateSelect();

  $scope.applyCategoriesSelect = function() {
      $scope.onDateSelect();
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
