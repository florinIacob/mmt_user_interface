'use strict';

app.factory('LoansFactory',
  ['$http', '$q', '$cookieStore', 'host_name',
  function($http, $q, $cookieStore, host_name) {

    var service = {};

    /**
    * Function used for adding a new loan
    */
    service.addLoan = function(loanEntity) {
      var deferred = $q.defer();

      $http({
          method: 'POST',
          url: host_name + '/loans',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(loanEntity)
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- POST ERROR: ' + host_name + '/loans WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    /**
    * Function used for adding a new Counterparty
    */
    service.addCounterparty = function(counterpartyEntity) {
      var deferred = $q.defer();

      $http({
          method: 'POST',
          url: host_name + '/counterparties',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(counterpartyEntity)
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- POST ERROR: ' + host_name + '/counterparties WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    /**
    * Get Counterparty list for this user
    */
    service.getCounterpartyList = function() {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          url: host_name + '/counterparties',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          }
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- GET ERROR: ' + host_name + '/counterparties WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    return service;
}]);
