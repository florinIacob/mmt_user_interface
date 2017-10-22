'use strict';

app.factory('PaymentService', function($q, $http, $cookieStore, host_name) {
  var service = {};

  /**
    * Request to charge the user
    */
  service.chargeUserLicense = function(chargeDTO) {
      var deferred = $q.defer();

      $http({
          method: 'POST',
          url: host_name + '/payments',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(chargeDTO)
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- POST ERROR: ' + host_name + '/payments/charge WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
  }

  /**
      * Request to charge the user
      */
    service.getPaymentStatus = function() {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: host_name + '/payments/status',
            headers: {
              'Content-Type': "application/json",
              'Authorization': $cookieStore.get('mmtlt')
            }
        }).then(
          function success(response) {
            deferred.resolve(response.data);
          },
          function error(response) {
            console.error(' --- GET ERROR: ' + host_name + '/payments/status ' + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
            deferred.reject(response);
          }
        );
        return deferred.promise;
    }

  return service;
});
