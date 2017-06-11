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
      LoansFactory, AlertService, $uibModal) {

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
    var serverRequestArray = [];
    if ($scope.counterpartyId) {
      serverRequestArray.push(LoansFactory.findAllByCounterparty($scope.counterpartyId));
    } else {
      serverRequestArray.push(LoansFactory.findAll());
    }

    $scope.loading = true;

    $q.all(serverRequestArray).then(
      function(responseArray){
        $scope.loanList = responseArray[0];
        $scope.loading = false;
      },
      function(response){
        // ERROR: inform the user
        $scope.loading = false;
        console.error("[loan_list] Cannot retrieve data for Reason: " + JSON.stringify(response));
     });
  }

  $scope.initData();

  // Save counterparty
  $scope.saveCounterparty = function(counterparty) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/save-counterparty.modal.html',
      controller: 'SaveCounterpartyModalCtrl',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        counterpartyEntity: function() {
          return counterparty;
        },
      }
    })

    modalInstance.result.then(
      function success(responseCounterparty) {
        if (counterparty) {
          angular.forEach($scope.counterpartyList, function(counterpartyItem, index) {
            if (counterpartyItem.id === responseCounterparty.id) {
              $scope.counterpartyList[index] = responseCounterparty;
              return;
            }
          });
        } else {
          $scope.counterpartyList.push(responseCounterparty);
        }
      }
    );
  };

  // Delete counterparty
  $scope.deleteCounterparty = function(counterparty) {
    // Function to be executed if the user press Yes on modal window
    var deleteFunction = function() {
      CounterpartyFactory.deleteCounterparty(counterparty).then(
        function(response){
          angular.forEach($scope.counterpartyList, function(counterpartyItem, index) {
            if (counterpartyItem.id === counterparty.id) {
              $scope.counterpartyList.splice(index, 1);
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
                  message: 'Error on deleting counterparty!',
                  onYesCallback: null
                };
              },
            }
          });
          console.error('Error on deleting counterparty! MESSAGE: ' + JSON.stringify(response))
       });
     }

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
            message: 'Are you sure do you want to delete counterparty [' + counterparty.name + '] and all his loans ?',
            onYesCallback: deleteFunction
          };
        },
      }
    });
  };

  // Sort options
  $scope.sortColumn = 'name';
   $scope.sortReverse = false;

   $scope.changeSortingCriteria = function(columnName) {
      $scope.sortColumn = columnName;
      $scope.sortReverse = !$scope.sortReverse;
   }

});
