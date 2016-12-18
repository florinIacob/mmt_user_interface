'use strict';

app.factory('IncomeUtilFactory',
  ['$http', '$cookieStore', 'host_name',
  function($http, $cookieStore, host_name) {

    var service = {};

    /**
    * Function that will retrieve all the incomes in the required time interval
    * from server.
    */
    service.retrieveIncomesByTimeInterval = function(currencyCode, startTimeInMillis, endTimeInMillis) {
        // TODO: should also contain currency_code
        var req = {
            method: 'GET',
            url: host_name + '/income/findByInterval/' + startTimeInMillis + '/' + endTimeInMillis,
            headers: {
              'Content-Type': "application/json",
              'Authorization': $cookieStore.get('mmtlt')
           }
        }
        // make server request
        return $http(req);
    }

    return service;
}]);
