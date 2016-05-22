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
        $uibModal, ModalTemplateService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.yearsArray = intializeYearsArray();
  $scope.selected_year = (1900 + (new Date().getYear())).toString();

  $scope.graphics = ["LINEAR", "BAR", "DYNAMIC"];
  $scope.graphic_type = "LINEAR";

  // INCOMES AREA
  $scope.onDateSelect = function(yearChanged) {
    var month_index = new Date().getMonth();
    if (yearChanged === true) {
      if ($scope.selected_year != (1900 + new Date().getYear())) {
        month_index = 11;
        $scope.monthsArray = extractMonthAsString(month_index, true, $rootScope.isEng());
        $scope.selected_month = extractMonthAsString(month_index, false, $rootScope.isEng());
      } else {
        $scope.monthsArray = extractMonthAsString(new Date().getMonth(), true, $rootScope.isEng());
        $scope.selected_month = extractMonthAsString(new Date().getMonth(), false, $rootScope.isEng());
      }
    }

    // graphic arrays
    // - linear
    $scope.labelsLinear = extractMonthAsString(month_index, true, $rootScope.isEng());
    $scope.seriesLinear = ['Incomes ' + $scope.selected_year];
    $scope.dataLinear = [generateZeroesArray(month_index + 1)];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    // - bar
    $scope.labelsBar = [$scope.selected_year];
    $scope.seriesBar = extractMonthAsString(month_index, true, $rootScope.isEng());
    $scope.dataBar = generateArraysWithZero(month_index + 1);
    // - dynamic
    $scope.labelsDynamic = extractMonthAsString(month_index, true, $rootScope.isEng());
    $scope.dataDynamic = generateZeroesArray(month_index + 1);
    $scope.typeDynamic = 'Pie';
    $scope.toggleDynamicGraphic = function () {
      $scope.typeDynamic = $scope.typeDynamic === 'PolarArea' ?
        'Pie' : 'PolarArea';
    };

    $scope.incomes.forEach(function(income) {

        var d = new Date(income.creationDate);
        income.monthAsInt = d.getMonth();
        income.monthAsString = extractMonthAsString(d.getMonth(), false, $rootScope.isEng());
        income.year = 1900 + d.getYear();

        console.log('  >> INCOME: ' + income.name);
        console.log('      - amount: ' + income.amount);
        console.log('      - creationDate: ' + income.creationDate);
        console.log('      - month: ' + income.monthAsString);
        console.log('      - year: ' + income.year);

        // LINEAR graphic
        if ($scope.selected_year == income.year.toString()) {
          var categ_index = $scope.labelsLinear.indexOf(income.monthAsString);
          $scope.dataLinear[0][categ_index] = income.amount
              +$scope.dataLinear[0][categ_index];
        }

        // BAR graphic
        if ($scope.selected_year == income.year.toString()) {
          var categ_index = $scope.seriesBar.indexOf(income.monthAsString);
          $scope.dataBar[categ_index][0] = income.amount
                        +$scope.dataBar[categ_index][0];
        }

        // DYNAMIC graphic
        if ($scope.selected_year == income.year.toString()) {
          categ_index = $scope.labelsDynamic.indexOf(income.monthAsString);
          $scope.dataDynamic[categ_index] = income.amount + $scope.dataDynamic[categ_index];
        }
      })
  }

  // Retrieve incomes
  var retrieveIncomes = function() {
    var deferred = $q.defer();
    var req = {
          method: 'GET',
          url: host_name + '/income/find_all',
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
                  title: $rootScope.isEng() ? 'Information!':'Informatie!',
                  message: $rootScope.isEng() ? 'Incomes could NOT be loaded!':'Incasarile nu au putut fi incarcate!',
                  onYesCallback: null
                };
              },
            }
          });
       });
       return deferred.promise;
    }

    $scope.incomes;
    retrieveIncomes().then(function(incomes) {
      $scope.incomes = incomes;

      $scope.onDateSelect();
    });
});

/**
  * Function used to extract the name of the month based on the received index.
  * Used because date variables stores the month as an integer and the UI will display month as a string.
  */
var extractMonthAsString = function(monthAsInt, returnSubArray, isEnglish) {
  var monthStrings = ["January", "February", "March", "April", "May", "June", "July", "August",
                        "September", "October", "November", "December"];
  if (!isEnglish) {
    var monthStrings = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August",
                            "Septembrie", "Octobrie", "Noiembrie", "Decembrie"];
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
