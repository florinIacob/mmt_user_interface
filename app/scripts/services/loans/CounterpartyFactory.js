'use strict';

app.factory('CounterpartyFactory',
  ['$http', '$q', '$cookieStore', 'host_name',
  function($http, $q, $cookieStore, host_name) {

    var service = {};

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
    * Function used for updating a new Counterparty
    */
    service.updateCounterparty = function(counterpartyEntity) {
      var deferred = $q.defer();

      $http({
          method: 'PUT',
          url: host_name + '/counterparties/' + counterpartyEntity.id,
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
          console.error(' --- PUT ERROR: ' + host_name + '/counterparties/' + counterpartyEntity.id + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    /**
    * Function used for deleting a Counterparty
    */
    service.deleteCounterparty = function(counterpartyEntity) {
      var deferred = $q.defer();

      $http({
          method: 'DELETE',
          url: host_name + '/counterparties/' + counterpartyEntity.id,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          }
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- DELETE ERROR: ' + host_name + '/counterparties/' + counterpartyEntity.id + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    return service;
}]);
