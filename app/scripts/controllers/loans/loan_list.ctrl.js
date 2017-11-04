'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddLoanCtrl
 * @description
 * # AddLoanCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('LoanListCtrl', function ($scope, $q, $rootScope, $routeParams, $location, $cookieStore, CurrencyUtilFactory,
      LoansFactory, AlertService, $uibModal, $timeout) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.counterpartyId = $routeParams.counterparty;
  $scope.counterpartyName = $routeParams.counterpartyName;
  console.log(' -- counterparty: ' + $scope.counterpartyId);

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
                unlockButton: 'Unlock LOANS'
              };
            }
          }
        });

      } else {
        var serverRequestArray = [];
        if ($scope.counterpartyId) {
          serverRequestArray.push(LoansFactory.findAllByCounterparty($scope.counterpartyId));
        } else {
          serverRequestArray.push(LoansFactory.findAll());
        }

        $scope.loading = true;

        $q.all(serverRequestArray).then(
          function (responseArray) {
            $scope.loanList = responseArray[0];
            $scope.loading = false;
          },
          function (response) {
            // ERROR: inform the user
            $scope.loading = false;
            console.error("[loan_list] Cannot retrieve data for Reason: " + JSON.stringify(response));
          });
      }
    }
  };

  $scope.initData();

  // Save loan
  $scope.saveLoan = function(loan) {
    var loanPathSuffix = "";
    if (loan) {
      loanPathSuffix += "/" + loan.id;
      if ($scope.counterpartyId) {
        loanPathSuffix += "/" + $scope.counterpartyId;
      }
    } else {
      if ($scope.counterpartyId) {
        loanPathSuffix += "/0/" + $scope.counterpartyId;
      }
    }

    $location.path('/add_loan' + loanPathSuffix);
  };

  // Delete loan
  $scope.deleteLoan = function(loan) {
    // Function to be executed if the user press Yes on modal window
    var deleteFunction = function() {
      LoansFactory.deleteLoan(loan).then(
        function(response){
          angular.forEach($scope.loanList, function(loanItem, index) {
            if (loanItem.id === loan.id) {
              $scope.loanList.splice(index, 1);
              return;
            }
          });
        },
        function(response){

          $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/info-modal.html',
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Error!',
                  message: 'Error on deleting loan!',
                  onYesCallback: null
                };
              },
            }
          });
          console.error('Error on deleting loan! MESSAGE: ' + JSON.stringify(response))
       });
     }

    var loanAmountString = (loan.receiving ? 1 : -1) * loan.amount + ' ' + loan.currency;
    $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/warning-modal.html',
      controller: 'WarningPopupController',
      scope: $scope,
      size: 'lg',
      resolve: {
        items: function() {
          return {
            title: 'Warning!',
            message: 'Are you sure do you want to delete loan with amount ' + loanAmountString + ' for counterparty ' + loan.counterparty.name + '?',
            onYesCallback: deleteFunction
          };
        },
      }
    });
  };

  $scope.toggleActivation = function(loan) {
    var isActive = loan.active;
    loan.active = !isActive;
    LoansFactory.updateLoan(loan).then(
      function success(response) {

      }, function error(response) {
        loan.active = isActive;
        console.error('Error on toggle loan activation! MESSAGE: ' + JSON.stringify(response))
      }
    );
  };

  // Sort options
  $scope.sortColumn = 'name';
   $scope.sortReverse = false;

   $scope.changeSortingCriteria = function(columnName) {
      $scope.sortColumn = columnName;
      $scope.sortReverse = !$scope.sortReverse;
   }

});
