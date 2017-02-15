//'use strict';

app.service('DateTimeService', function($http, $cookieStore, host_name) {

  this.createCurrentDateTimeString = function() {

    var date = new Date();
    return date_value = date.getFullYear() + "-" + f(date.getMonth()+1) + "-"
          + f(date.getDate()) + "T" + f(date.getHours()) + ":" + f(date.getMinutes()) + '';
  }

  this.createDateTimeString = function(date) {

    return date_value = date.getFullYear() + "-" + f(date.getMonth()+1) + "-"
          + f(date.getDate()) + "T" + f(date.getHours()) + ":" + f(date.getMinutes()) + '';
  }

  /*
  Function that will add a '0' to a string that has the length 1
  */
  var f = function(int_value) {

    var string_value = int_value.toString();
    if (string_value.length == 1) {
      string_value = '0' + string_value;
    }
    return string_value;
  }

  /*
   * Get options for Date Inputs
   */
  this.getDateOptions = function() {
      var dateOptions = {
       dateDisabled: false,
       formatYear: 'yy',
       maxDate: new Date(2025, 5, 22),
       minDate: new Date(2010, 5, 22),
       startingDay: 1
     };
     return dateOptions;
  }
});
