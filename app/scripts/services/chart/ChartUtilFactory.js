'use strict';

app.factory('ChartUtilFactory',
  ['$http', '$cookieStore', 'host_name',
  function($http, $cookieStore, host_name) {

    var ChartUtilFactory = {};

    var monthStrings = ["January", "February", "March", "April", "May", "June", "July", "August",
                        "September", "October", "November", "December"];

    /**
      * Get an array with months as strings starting with start index, ending with endIndex (including)
      */
    function _getMonthsArrayFromIndexToIndex(startIndex, endIndex, appendString, currentArray) {
      var i;
      for (i = startIndex; i <= endIndex; i++) {
        //console.log("  monthStrings[i] + appendString  ---- " + monthStrings[i] + appendString);
        currentArray.push(monthStrings[i] + (appendString ?  ' (' + appendString + ') ' : ' '));
      }
      return currentArray;
    }

    /**
     * Creates the labels that will be print in the chart
     */
    ChartUtilFactory.createChartLabelsArray = function(startDate, endDate) {
        var result = [];
        if (startDate.getFullYear() === endDate.getFullYear()) {
            result = _getMonthsArrayFromIndexToIndex(startDate.getMonth(), endDate.getMonth(), '', result);
        } else {
            var currentYear;
            for (currentYear = startDate.getFullYear(); currentYear <= endDate.getFullYear(); currentYear++) {
              var startMonth;
              var endMonth;
              if (currentYear === startDate.getFullYear()) {
                  startMonth = startDate.getMonth();
                  endMonth = 11;
              } else if (currentYear === endDate.getFullYear()) {
                  startMonth = 0;
                  endMonth = endDate.getMonth();
              } else {
                  startMonth = 0;
                  endMonth = 11;
              }

              result = _getMonthsArrayFromIndexToIndex(startMonth , endMonth, '' + currentYear, result);
            }
        }
        return result;
    }

    /**
     * Get the corresponding chart index using the month of the current date
     */
    ChartUtilFactory.getCorrespondingMonthIndex = function(currentDate, startDate, endDate) {
        var multiplier = currentDate.getFullYear() - startDate.getFullYear();
        var monthIndex = currentDate.getMonth() - startDate.getMonth();
        //console.log("  ChartUtilFactory.getCorrespondingMonthIndex  ---- " + ((multiplier * 12) + monthIndex));
        return ((multiplier * 12) + monthIndex);
    }

    /**
     * Calculate number of months that are included in the period for the received date arguments
     */
    ChartUtilFactory.calculateNumberOfMonths = function(startDate, endDate) {
        var multiplier = endDate.getFullYear() - startDate.getFullYear();
        var monthIndex = endDate.getMonth() - startDate.getMonth();
        //console.log("  ChartUtilFactory.calculateNumberOfMonths  ---- " + ((multiplier * 12) + monthIndex + 1));
        return ((multiplier * 12) + monthIndex + 1);
    }

    return ChartUtilFactory;
}]);
