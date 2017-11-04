'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddLoanCtrl
 * @description
 * # AddLoanCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddLoanCtrl', function ($scope, $q, $rootScope, $http, $location, $cookieStore, DateTimeService, CurrencyUtilFactory,
      LoansFactory, CounterpartyFactory, AlertService, $routeParams, $uibModal, $timeout) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.loading = false;

  $scope.loanId = $routeParams.loan != 0 ? $routeParams.loan : null;
  $scope.counterpartyId = $routeParams.counterparty;

  $scope.isEditMode = false;
  if ($scope.loanId) {
    $scope.isEditMode = true;
  }

  $scope.isNewCounterparty = false;

  $scope.loan = {
    counterparty: {
      id: $scope.counterpartyId,
      name: null,
      email: null
    },
    receiving: false,
    active: true,
    amount: null,
    currency: null,
    description: null,
    creationDate: new Date(),
    untilDate: null
  };

  // Currencies -----
  $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();

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
                unlockButton: 'Unlock LOANS'
              };
            }
          }
        });

      } else {
        var serverRequestArray = [];
        serverRequestArray.push(CurrencyUtilFactory.getDefaultCurrency());
        serverRequestArray.push(CounterpartyFactory.getCounterpartyList());
        if ($scope.isEditMode) {
          serverRequestArray.push(LoansFactory.findOneById($scope.loanId));
        }

        $scope.data = {};
        $scope.data.counterpartyList = [];

        $scope.loading = true;
        $q.all(serverRequestArray).then(
          function (responseArray) {
            var currency = angular.fromJson(responseArray[0].data);
            $scope.loan.currency = currency.value;
            $scope.data.counterpartyList = responseArray[1];

            if ($scope.isEditMode) {
              $scope.loan = responseArray[2];
              $scope.loan.counterparty.id = "" + $scope.loan.counterparty.id;
            }
            $scope.loading = false;
          },
          function (response) {
            $scope.loading = false;
            console.error("[add_income] Cannot retrieve default Currency for Reason: " + JSON.stringify(response));
          });
      }
    }
  };

  $scope.initData();

  // Select counterparty
  $scope.onCounterpartySelect = function(counterparty) {
    $scope.loan.counterparty = counterparty;
  };

  // SUBMIT Loan
  $scope.submit = function() {
    if (!$scope.loan.counterparty.id && !$scope.loan.counterparty.name) {
      AlertService.displaySimpleAlert('Warning', 'Counterparty is mandatory!');
      return;
    }

    $scope.loading = true;
    var addLoanRequest = function() {
      var serverRequestArray = [];
      if ($scope.isEditMode) {
        serverRequestArray.push(LoansFactory.updateLoan($scope.loan));
      } else {
        serverRequestArray.push(LoansFactory.addLoan($scope.loan));
      }

     $q.all(serverRequestArray).then(
        function success(response) {
          $scope.loading = false;
          var loanPathSuffix = $scope.counterpartyId ? ('/' + $scope.counterpartyId + '/' + $scope.loan.counterparty.name) : '';
          $location.path('/loan_list' + loanPathSuffix);
        },
        function error(response) {
          AlertService.displaySimpleAlert('Error', 'Error while adding Loan!');
          $scope.loading = false;
        }
      )
    }

    if ($scope.isNewCounterparty) {
      $scope.loan.counterparty.id = null;
      CounterpartyFactory.addCounterparty($scope.loan.counterparty).then(
        function success(responseCounterparty) {
          $scope.loan.counterparty = responseCounterparty;
          addLoanRequest();
        },
        function error(response) {
          AlertService.displaySimpleAlert('Error', 'Error while adding Counterparty!');
          $scope.loading = false;
        }
      )
    } else {
      addLoanRequest();
    }

  };

  /*---- Start DATE PICKER ----*/
  $scope.format = 'dd-MMMM-yyyy';
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.datePopup = [{
    opened: false
  },
  {
    opened: false
  }];
  $scope.openDatePicker = function(index) {
    $scope.datePopup[index].opened = true;
  };
  $scope.dateOptions = DateTimeService.getDateOptions();
  /*---- End DATE PICKER ----*/
});
