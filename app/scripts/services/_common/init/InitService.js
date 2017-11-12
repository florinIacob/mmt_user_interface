'use strict';

app.factory('InitService',
  ['$http', '$rootScope', 'host_name', 'NotificationsFactory', 'PaymentService',
  function($http, $rootScope, host_name, NotificationsFactory, PaymentService) {

    var service = {};

    /**
     * Method to be executed in order to initialize current user global variables
     */
    service.init = function() {

      // notifications for user
      NotificationsFactory.findAll().then(
        function success(notificationArray) {
          $rootScope.totalNotifications = 0;
          angular.forEach(notificationArray, function(notificationItem, index) {
            if (!notificationItem.seen) {
              $rootScope.totalNotifications++;
            }
          });
        },
        function error(response) {
          $rootScope.totalNotifications = 0;
          console.log(" - NotificationsFactory.findAll(): " + JSON.stringify(response));
        }
      );

      // Check license payment
      PaymentService.getPaymentStatus("user_license").then(
        function success(response) {
          $rootScope.licencePaymentApproved = response.paymentApproved;
        },
        function error(response) {
          $rootScope.licencePaymentApproved = false;
          console.log(" - PaymentService.getPaymentStatus(): " + JSON.stringify(response));
        }
      );
    };

    return service;
}]);
