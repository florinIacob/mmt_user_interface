'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddLoanCtrl
 * @description
 * # AddLoanCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('NotificationListCtrl', function ($scope, $q, $rootScope, $routeParams, $location, $cookieStore,
      NotificationsFactory, AlertService, $uibModal, $timeout) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.loading = false;

  /**
   * Intitialize Controller data
   *
   */
  $scope.initData = function() {
    if ($rootScope.licencePaymentApproved == null) {
      $timeout($scope.initData, 500);
    } else {
      if ($rootScope.licencePaymentApproved === false) {
        $uibModal.open({
          animation: true,
          templateUrl: 'views/modal/function-locked-modal.html',
          controller: 'FunctionLockedPopupController',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                message: 'Loans, Notifications and Category limit are only available for contributors. In order to be able to use this functions you can contribute to the application accessing PAYMENT page. Thank you!',
                unlockButton: 'Unlock NOTIFICATIONS'
              };
            }
          }
        });

      } else {

        var serverRequestArray = [];
        serverRequestArray.push(NotificationsFactory.findAll());

        $scope.loading = true;

        $q.all(serverRequestArray).then(
          function (responseArray) {
            $scope.notificationList = [];
            angular.forEach(responseArray[0], function (notificationItem, index) {
              if (!notificationItem.seen) {
                $scope.notificationList.push(notificationItem);
              }
            });
            $scope.loading = false;
          },
          function (response) {
            // ERROR: inform the user
            $scope.loading = false;
            console.error("[notification_list] Cannot retrieve data for Reason: " + JSON.stringify(response));
          });
      }
    }
  };

  $scope.initData();

  /**
   * Get class color for the notification Panel
   */
  $scope.getPanelClass = function(notificationPriority) {
    if (notificationPriority === 'HIGH') {
      return 'danger';
    } else if (notificationPriority === 'MEDIUM') {
      return 'warning';
    } else {
      return 'default';
    }
  };

  /**
   * Mark notification as seen
   */
  $scope.markAsSeen = function(index) {
    NotificationsFactory.markAsSeen($scope.notificationList[index]).then(
      function success(response) {
        $scope.notificationList[index].seen = true;
        $scope.notificationList.splice(index, 1);
        $rootScope.totalNotifications--;
      }
    );
  };

});
