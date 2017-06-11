'use strict';

app.factory('LoansFactory',
  ['$http', '$q', '$cookieStore', 'host_name',
  function($http, $q, $cookieStore, host_name) {

    var service = {};

    /**
    * Get the loan list for the specified counterparty
    */
    service.findAllByCounterparty = function(counterpartyId) {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          url: host_name + '/loans/' + counterpartyId,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          }
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          deferred.reject(response);
          console.error(' --- GET ERROR: ' + host_name + '/loans/' + counterpartyId + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
        }
      );
      return deferred.promise;
    };

    /**
    * Get one loan by ID
    */
    service.findOneById = function(loanId) {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          url: host_name + '/loans/findOne/' + loanId,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          }
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          deferred.reject(response);
          console.error(' --- GET ERROR: ' + host_name + '/loans/findOne/' + loanId + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
        }
      );
      return deferred.promise;
    };

    /**
    * Get the loan list for current user
    */
    service.findAll = function() {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          url: host_name + '/loans',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          }
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          deferred.reject(response);
          console.error(' --- GET ERROR: ' + host_name + '/loans WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
        }
      );
      return deferred.promise;
    };

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
    * Function used for updating a new Loan
    */
    service.updateLoan = function(loanEntity) {
      var deferred = $q.defer();

      $http({
          method: 'PUT',
          url: host_name + '/loans/' + loanEntity.id,
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
          console.error(' --- PUT ERROR: ' + host_name + '/loans/' + loanEntity.id + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    /**
    * Function used for deleting a Loan
    */
    service.deleteLoan = function(loanEntity) {
      var deferred = $q.defer();

      $http({
          method: 'DELETE',
          url: host_name + '/loans/' + loanEntity.id,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          }
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- DELETE ERROR: ' + host_name + '/loans/' + loanEntity.id + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    return service;
}]);
