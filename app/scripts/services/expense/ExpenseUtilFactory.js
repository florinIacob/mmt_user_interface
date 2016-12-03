'use strict';

app.factory('ExpenseUtilFactory',
  ['$http', '$cookieStore', 'host_name',
  function($http, $cookieStore, host_name) {

    var service = {};

    /**
    * Function that will retrieve all the expenses in the required time interval
    * from server.
    */
    service.retrieveExpensesByTimeInterval = function(currencyCode, startDate, endDate) {
        var req = {
            method: 'GET',
            url: host_name + '/expense/find/' + currencyCode + '/' + startDate.getTime() + '/' + endDate.getTime(),
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
