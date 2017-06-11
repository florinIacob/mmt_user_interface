'use strict';

app.factory('NotificationsFactory',
  ['$http', '$q', '$cookieStore', 'host_name',
  function($http, $q, $cookieStore, host_name) {

    var service = {};

    /**
    * Get all notifications for current user
    */
    service.findAll = function() {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          url: host_name + '/notifications?limit=1000&offset=0',
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
          console.error(' --- GET ERROR: ' + host_name + '/notifications?limit=1000&offset=0  WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
        }
      );
      return deferred.promise;
    };

    /**
    * Mark notification as seen
    */
    service.markAsSeen = function(notificationEntity) {
      var deferred = $q.defer();

      $http({
          method: 'PUT',
          url: host_name + '/notifications/' + notificationEntity.id,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          }
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- PUT ERROR: ' + host_name + '/notifications/' + notificationEntity.id + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    return service;
}]);
