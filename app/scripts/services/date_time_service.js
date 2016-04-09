app.service('DateTimeService', function($http, $cookieStore, host_name) {

  this.createCurrentDateTimeString = function() {

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

    var date = new Date();
    return date_value = date.getFullYear() + "-" + f(date.getMonth()+1) + "-"
          + f(date.getDate()) + "T" + f(date.getHours()) + ":" + f(date.getMinutes()) + '';

  }
});
