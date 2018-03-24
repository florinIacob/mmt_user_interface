'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('PaymentCtrl', function ($scope, $http, $location, $cookieStore, $uibModal, PaymentService, CurrencyUtilFactory,
          DateTimeService, host_name, stripe, AlertService, $rootScope, $routeParams) {

  $scope.loading = false;
  $scope.paymentApproved = false;
  $scope.rejectMessage = null;

  if ($routeParams.username) {
    $rootScope.username = $routeParams.username;
  }

  /**
   * Initialize controller data
   */
  $scope.initData = function() {
    $scope.loading = true;
    PaymentService.getPaymentStatus("user_license").then(
      function success(response) {
        $scope.paymentApproved = response.paymentApproved;
        $rootScope.licencePaymentApproved = response.paymentApproved;
        $scope.rejectMessage = response.description;
        $scope.loading = false;

      }, function error(errMsg) {
        AlertService.displaySimpleAlert('Info', "Please login for payment information!");
        console.error(" ERROR getting payment status! Response: " + JSON.stringify(errMsg));
        $scope.loading = false;
      }
    );
  };

  $scope.initData();

  /**
   * Configure Stripe handler
   */
  var handler = StripeCheckout.configure({
    key: 'pk_test_dXg1ag4chbeaGcGtpHyt1BkD',
    image: 'images/logo.svg',
    locale: 'auto',
    token: function(token) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      $scope.loading = true;

      var chargeDTO = {
        description: 'Payment for The Accountant License: $4,99',
        amount: null,
        currency: null,
        stripeEmail: token.email,
        stripeToken: token.id
      };
      PaymentService.chargeUserLicense(chargeDTO).then(
        function success(response) {
          $scope.paymentApproved = response.paymentApproved;
          $rootScope.licencePaymentApproved = response.paymentApproved;
          $scope.rejectMessage = response.description;
          $scope.loading = false;
        }, function error(response) {
          var errMsg = 'Error on charging your credit card!';
          if (response.data && response.data.message) {
            errMsg += ' Message: ' + response.data.message;
          }
          AlertService.displaySimpleAlert('Error', errMsg);
          console.error(" ERROR charging card, Response: " + JSON.stringify(response));
          $scope.loading = false;
        }
      );
    }
  });

  /**
   * Configure button to open Stripe payment modal
   */
  document.getElementById('customButton').addEventListener('click', function(e) {
    // Open Checkout with further options:
    handler.open({
      name: 'The Accountant',
      description: 'Pay with credit card',
      amount: 499
    });
    e.preventDefault();
  });

  // Close Checkout on page navigation:
  window.addEventListener('popstate', function() {
    handler.close();
  });

  /*---- Start DATE PICKER ----*/
  $scope.format = 'dd-MMMM-yyyy';
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.datePopup = {
    opened: false
  };
  $scope.openDatePicker = function() {
    $scope.datePopup.opened = true;
  };
  $scope.dateOptions = DateTimeService.getDateOptions();
  /*---- End DATE PICKER ----*/
});
