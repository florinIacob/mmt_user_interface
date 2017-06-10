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
      LoansFactory, AlertService) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.loading = false;

  $scope.isNewCounterparty = false;

  $scope.loan = {
    counterparty: {
      id: null,
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
    var serverRequestArray = [];
    serverRequestArray.push(CurrencyUtilFactory.getDefaultCurrency());
    serverRequestArray.push(LoansFactory.getCounterpartyList());

    $scope.data = {};
    $scope.data.counterpartyList = [];

    $q.all(serverRequestArray).then(
      function(responseArray){
        var currency = angular.fromJson(responseArray[0].data);
        $scope.loan.currency = currency.value;
        $scope.data.counterpartyList = responseArray[1];

      },
      function(response){
        // ERROR: inform the user
        console.error("[add_income] Cannot retrieve default Currency for Reason: " + JSON.stringify(response));
     });
  }

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
      LoansFactory.addLoan($scope.loan).then(
        function success(response) {
          $scope.loading = false;
        },
        function error(response) {
          AlertService.displaySimpleAlert('Error', 'Error while adding Loan!');
          $scope.loading = false;
        }
      )
    }

    if ($scope.isNewCounterparty) {
      $scope.loan.counterparty.id = null;
      LoansFactory.addCounterparty($scope.loan.counterparty).then(
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
